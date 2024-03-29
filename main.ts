import { Plugin } from 'obsidian';
import StatBlock from './src/components/StatBlock/index.svelte'
import { BLOCK_PREVIEW_LANG } from 'src/constants';
import { CampaignStore } from 'src/types';
import { getSavedCampaignStore } from 'src/utils';
import { createAddStatBlockCommand } from '@/commands';

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class DndToolboxPlugin extends Plugin {
	settings: MyPluginSettings;
	store: CampaignStore

	async onload() {
		await this.loadSettings();
		this.store = await getSavedCampaignStore(this.app.vault)

		// this.registerView(ENCOUNTER_VIEW, (leaf) => new EncounterView(leaf, this))

		// this.addRibbonIcon('swords', 'Start encounter', async (evt: MouseEvent) => {
		// 	await this.handleLoadAllData()
		// 	const existingLeaves = this.app.workspace.getLeavesOfType(ENCOUNTER_VIEW)
		// 	let leaf: WorkspaceLeaf
			
		// 	if (existingLeaves.length > 0) {
		// 		leaf = existingLeaves[0]
		// 	} else {
		// 		leaf = this.app.workspace.getLeaf("window")
		// 		await leaf.setViewState({ type: ENCOUNTER_VIEW })
		// 	}
			
		// 	await this.app.workspace.setActiveLeaf(leaf, { focus: true });
		// 	this.app.workspace.revealLeaf(leaf)
		// });

		// this.registerEvent(this.app.vault.on('modify', async (file) => {
		// 	await this.handleLoadAllData()
		// }))

		this.registerMarkdownCodeBlockProcessor(BLOCK_PREVIEW_LANG, async (source, el, ctx) => {
			const npc = this.store.npcs.find((npc) => npc.id === source)
			console.log(source, npc)
			if (npc) {
				new StatBlock({
					target: el,
					props: {
						block: npc
					}
				})
			}
		})

		for (const npc of this.store.npcs) {
			this.addCommand(createAddStatBlockCommand(npc))
		}

		// for (const command of Object.values(commands)) {
		// 	this.addCommand(command)
		// }

		// this.registerMarkdownCodeBlockProcessor(DND_TEMPLATE_CHARACTER_LANG, async (source, el, ctx) => {
		// 	const { characterTemplate, error } = validateDndCharacterTemplate(parse(source))

		// 	if (error !== null) {
		// 		new ErrorBox({
		// 			target: el,
		// 			props: {
		// 				error
		// 			}
		// 		})
		// 	} else if (characterTemplate !== null){
		// 		new Character({
		// 			target: el,
		// 			props: {
		// 				character: {
		// 					id: characterTemplate.id,
		// 					isPlayer: false,
		// 					template: this.state.characterTemplates.get(characterTemplate.id)
		// 				}
		// 			}
		// 		})
		// 	}
		// })

		// this.registerMarkdownCodeBlockProcessor(DND_CHARACTER_LANG, async (source, el, ctx) => {
		// 	const { character, error } = validateDndCharacter(parse(source))

		// 	if (error !== null) {
		// 		new ErrorBox({
		// 			target: el,
		// 			props: {
		// 				error
		// 			}
		// 		})
		// 	} else if (character !== null){
		// 		new Character({
		// 			target: el,
		// 			props: {
		// 				character: {
		// 					...character,
		// 					template: character?.template !== undefined ? this.state.characterTemplates.get(character?.template) : undefined
		// 				}
		// 			}
		// 		})
		// 	}
		// })
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
