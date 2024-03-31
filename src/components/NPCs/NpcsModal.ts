import { App, Modal } from "obsidian";
import StatBlockModalContent from "./NpcsModalContent.svelte"

export default class StatBlockModal extends Modal {
    constructor(app: App) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;

        new StatBlockModalContent({
            target: contentEl,
            props: {}
        })
    }

    onClose() {
        this.contentEl.empty();
    }
}