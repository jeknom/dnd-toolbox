import { App, ItemView, WorkspaceLeaf } from "obsidian";
import StatBlockModalContent from "./NpcsModalContent.svelte"
import { NPCS_VIEW } from "@/constants";

export default class NpcsView extends ItemView {
    constructor(public leaf: WorkspaceLeaf) {
        super(leaf)
    }

    async onOpen() {
        const { contentEl } = this;

        new StatBlockModalContent({
            target: contentEl,
            props: {}
        })
    }

    getViewType(): string {
        return NPCS_VIEW
    }
    
    getDisplayText(): string {
        return 'NPCs'
    }
}