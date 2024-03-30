import { App, Modal } from "obsidian";
import Players from "./Players.svelte";

export default class PlayersModal extends Modal {
    constructor(app: App) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;

        new Players({
            target: contentEl,
            props: {}
        })
    }

    onClose() {
        this.contentEl.empty();
    }
}