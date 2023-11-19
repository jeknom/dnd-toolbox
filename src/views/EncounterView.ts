import { ItemView, WorkspaceLeaf } from "obsidian";
import { ENCOUNTER_VIEW } from "src/constants";
import Encounter from 'src/components/Encounter.svelte'
import DndToolboxPlugin from "main";
import { DndEncounter } from "src/types";

export default class EncounterView extends ItemView {
    encounter: DndEncounter = {
        hasStarted: false,
        combatants: []
    }

    constructor(public leaf: WorkspaceLeaf, public plugin: DndToolboxPlugin) {
        super(leaf)
    }

    async onOpen() {
        new Encounter({
            target: this.contentEl,
            props: {
                state: this.plugin.state,
            }
        })
    }
    
    getViewType(): string {
        return ENCOUNTER_VIEW
    }

    getDisplayText(): string {
        return 'Dnd Encounter'
    }

}