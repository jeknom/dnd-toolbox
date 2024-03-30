import { CampaignStore, Encounter } from "@/types";
import { ItemView, Notice, WorkspaceLeaf } from "obsidian";
import EncounterComponent from "../components/Encounter/Encounter.svelte";
import EncounterStateHandler from "../components/Encounter/EncounterStateHandler";
import { getCurrentCombatant, getFocusedCombatant, loadCampaignStoreFromDisk, writeCampaignStoreToDisk } from "@/utils";
import { ENCOUNTER_VIEW } from "@/constants";
import encounterHandlerStore from "@/components/Encounter/encounterHandlerStore";
import encounterStore from "@/components/Encounter/encounterStore";

export class EncounterView extends ItemView {
    constructor(public leaf: WorkspaceLeaf) {
        super(leaf)
    }

    async writeEncounterToDisc(curr: CampaignStore, encounter: Encounter) {
        curr.lastEncounter = encounter

        try {
            await writeCampaignStoreToDisk(this.app.vault, curr)
        } catch (e) {
            console.error(e)
            new Notice("Unexpected error while loading campaign store. It has been logged to dev console.")
            this.onClose()
        }
    }

    async onOpen() {
        const campaignStore = await loadCampaignStoreFromDisk(this.app.vault)

        encounterStore.set({
            encounter: campaignStore.lastEncounter,
            players: campaignStore.players,
            npcs: campaignStore.npcs,
            currentCombatant: getCurrentCombatant(campaignStore.lastEncounter),
            focusedCombatant: getFocusedCombatant(campaignStore.lastEncounter)
        })

        encounterHandlerStore.set(new EncounterStateHandler(async (enc) => await this.writeEncounterToDisc(campaignStore, enc)))

        new EncounterComponent({ target: this.contentEl })
    }

    getViewType(): string {
        return ENCOUNTER_VIEW
    }

    getDisplayText(): string {
        return 'Encounter'
    }
}