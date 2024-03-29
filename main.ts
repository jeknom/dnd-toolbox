import { Menu, Plugin, WorkspaceLeaf } from 'obsidian';
import StatBlock from './src/components/StatBlock/StatBlock.svelte'
import { APP_NAME, BLOCK_PREVIEW_LANG, ENCOUNTER_VIEW } from 'src/constants';
import { loadCampaignStoreFromDisk, writeCampaignStoreToDisk } from 'src/utils';
import { createDeletePlayerCommand, createInsertStatBlockCommand } from '@/commands';
import { AddPlayerModal } from '@/modals/AddPlayer';
import { EncounterView } from '@/views/EncounterView';

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class RPToolboxPlugin extends Plugin {
	settings: MyPluginSettings;

	async refreshAll() {
		const store = await loadCampaignStoreFromDisk(this.app.vault)
		
		for (const npc of store.npcs) {
			this.addCommand(createInsertStatBlockCommand(npc))
		}

		for (const player of store.players) {
			this.addCommand(createDeletePlayerCommand(player))
		}
	}

	async onload() {
		await this.loadSettings()
		await this.refreshAll()
		
		this.registerView(ENCOUNTER_VIEW, (leaf) => new EncounterView(leaf))

		this.addRibbonIcon('sword', APP_NAME, (e) => {
			const menu = new Menu()

			menu.addItem((item) => {
				item.setTitle('Add player')
				item.setIcon('user-round')
				item.onClick(() => {
					new AddPlayerModal(this.app, async (player) => {
						const store = await loadCampaignStoreFromDisk(this.app.vault)
						store.players.push(player)
						await writeCampaignStoreToDisk(this.app.vault, store)
						this.refreshAll()
					})
					.open()
				})
			})

			menu.addItem((item) => {
				item.setTitle('Encounter')
				item.setIcon('skull')
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
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
