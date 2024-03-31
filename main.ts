import { Menu, Plugin, WorkspaceLeaf } from 'obsidian';
import StatBlock from './src/components/StatBlock/StatBlock.svelte'
import { APP_NAME, BLOCK_PREVIEW_LANG, ENCOUNTER_VIEW } from 'src/constants';
import { loadCampaignStoreFromDisk, writeCampaignStoreToDisk } from 'src/utils';
import { createInsertStatBlockCommand } from '@/commands';
import PlayersModal from '@/components/Players/PlayersModal';
import { EncounterView } from '@/views/EncounterView';
import svelteCampaignStore from '@/svelteCampaignStore';
import { CampaignStore } from '@/types';
import NpcsModal from '@/components/NPCs/NpcsModal';
import { SettingsTab } from '@/SettingsTab';
import settingsStore from '@/settingsStore';
import OpenAI from 'openai';

interface PluginSettings {
	openaiApiKey: string;
}

const DEFAULT_SETTINGS: PluginSettings = {
	openaiApiKey: ''
}

export default class RPToolboxPlugin extends Plugin {
	settings: PluginSettings;
	updateDebounceTimeoutId?: number

	handleUpdateDeferred(currentStore: CampaignStore, updateFn: (store: CampaignStore) => CampaignStore) {
		clearTimeout(this.updateDebounceTimeoutId)
		this.updateDebounceTimeoutId = setTimeout(async () => {
			await this.handleUpdate(currentStore, updateFn)
		}, 1000) as unknown as number
	}

	async handleUpdate(currentStore: CampaignStore, updateFn: (store: CampaignStore) => CampaignStore) {
		const newStore = updateFn(currentStore)
		
		svelteCampaignStore.set({
			campaign: newStore,
			onUpdateDeferred: async (updateFn) => this.handleUpdateDeferred(newStore, updateFn),
			onUpdate: async (updateFn, confirm) => {
				if (confirm) {
					const menu = new Menu()
					
					menu.addItem((item) =>
						item
						.setTitle("Confirm")
						.onClick(() => this.handleUpdate(newStore, updateFn))
					);

					menu.addItem((item) =>
						item
						.setTitle("Cancel")
					);

      				menu.showAtMouseEvent(confirm);
				} else {
					await this.handleUpdate(newStore, updateFn)
				}
			}
		})

		await writeCampaignStoreToDisk(this.app.vault, newStore)
	}

	async refreshAll() {
		const store = await loadCampaignStoreFromDisk(this.app.vault)

		svelteCampaignStore.set({
			campaign: store,
			onUpdate: async (updateFn) => await this.handleUpdate(store, updateFn),
			onUpdateDeferred: (updateFn) => this.handleUpdateDeferred(store, updateFn),
		})

		for (const npc of store.npcs) {
			this.addCommand(createInsertStatBlockCommand(npc))
		}
	}

	async onload() {
		await this.loadSettings()
		await this.refreshAll()
		
		this.addSettingTab(new SettingsTab(this.app, this));
		this.registerView(ENCOUNTER_VIEW, (leaf) => new EncounterView(leaf))

		this.addRibbonIcon('sword', APP_NAME, (e) => {
			const menu = new Menu()

			menu.addItem((item) => {
				item.setTitle('Players')
				item.onClick(() => {
					new PlayersModal(this.app)
					.open()
				})
			})

			menu.addItem((item) => {
				item.setTitle('NPCs')
				item.onClick(() => {
					new NpcsModal(this.app)
					.open()
				})
			})

			menu.addItem((item) => {
				item.setTitle('Encounter')
				item.onClick(async () => {
					const existingLeaves = this.app.workspace.getLeavesOfType(ENCOUNTER_VIEW)
					let leaf: WorkspaceLeaf
					
					if (existingLeaves.length > 0) {
						leaf = existingLeaves[0]
					} else {
						leaf = this.app.workspace.getLeaf("window")
						await leaf.setViewState({ type: ENCOUNTER_VIEW })
					}
					
					await this.app.workspace.setActiveLeaf(leaf, { focus: true });
					this.app.workspace.revealLeaf(leaf)
				})
			})

			menu.showAtMouseEvent(e)
		})

		this.registerMarkdownCodeBlockProcessor(BLOCK_PREVIEW_LANG, async (source, el, ctx) => {
			const store = await loadCampaignStoreFromDisk(this.app.vault)
			const npc = store.npcs.find((npc) => npc.id === source)
			
			if (npc) {
				new StatBlock({
					target: el,
					props: {
						block: npc
					}
				})
			}
		})
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

		settingsStore.update((store) => ({ ...store, openAiClient: new OpenAI({
			apiKey: this.settings.openaiApiKey,
			dangerouslyAllowBrowser: true
		}) }));
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
