import { CampaignStore } from "@/types";
import { ItemView, Notice, WorkspaceLeaf } from "obsidian";
import Encounter from "../components/Encounter/Encounter.svelte";
import EncounterStateHandler from "../components/Encounter/EncounterStateHandler";
import { loadCampaignStoreFromDisk, writeCampaignStoreToDisk } from "@/utils";
import { ENCOUNTER_VIEW } from "@/constants";

export class EncounterView extends ItemView {
    handler: EncounterStateHandler

    constructor(public leaf: WorkspaceLeaf) {
        super(leaf)
    }

    async onOpen() {
        const { contentEl } = this;
        
        new Promise<CampaignStore>(async (resolve, reject) => {
            try {
                const store = await loadCampaignStoreFromDisk(this.app.vault)
                resolve(store)
            } catch (e) {
                reject()
            }
            
        })
        .then((store) => {
            this.handler = new EncounterStateHandler(
                store.lastEncounter,
                async (encounter) => {
                    const newStore = store
                    newStore.lastEncounter = encounter

                    await writeCampaignStoreToDisk(this.app.vault, newStore)
                }
            )

            new Encounter({
                target: contentEl,
                props: {
                    handler: this.handler,
                    players: store.players,
                    monsters: store.npcs
                }
            })
        
        })
        .catch(() => {
            new Notice("Error loading campaign store")
            this.onClose()
        })
    }

    getViewType(): string {
        return ENCOUNTER_VIEW
    }

    getDisplayText(): string {
        return 'Encounter'
    }
}