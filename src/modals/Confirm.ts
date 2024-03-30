import { App, Modal, Setting } from "obsidian";

export class ConfirmModal extends Modal {
    onConfirm: () => Promise<void>;

    constructor(app: App, onConfirm: () => Promise<void>) {
        super(app);
        this.onConfirm = onConfirm;
    }

    onOpen() {
        const { contentEl } = this;

        contentEl.createEl('h2', { text: 'Are you sure?' })

        new Setting(contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText("Yes")
                    .setCta()
                    .onClick(() => {
                        this.close();
                        this.onConfirm();
                    }));
        new Setting(contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText("No")
                    .setCta()
                    .onClick(() => {
                        this.close();
                    }));
    }

    onClose() {
        this.contentEl.empty();
    }
}