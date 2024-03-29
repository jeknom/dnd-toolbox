import { Player } from "@/types";
import { App, Modal, Setting } from "obsidian";
import { v4 } from 'uuid'

export class AddPlayerModal extends Modal {
    result: Player = { id: "", name: "" };
    onSubmit: (result: Player) => Promise<void>;

    constructor(app: App, onSubmit: (result: Player) => Promise<void>) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;

        this.result.id = v4()

        new Setting(contentEl)
            .setName("Name")
            .addText((text) =>
                text.onChange((value) => {
                    this.result.name = value
                }));

        new Setting(contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText("Submit")
                    .setCta()
                    .onClick(() => {
                        this.close();
                        this.onSubmit(this.result);
                    }));
    }

    onClose() {
        this.contentEl.empty();
    }
}