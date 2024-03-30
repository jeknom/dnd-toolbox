import { Command, Editor } from "obsidian";
import { BLOCK_PREVIEW_LANG } from "./constants";
import { Player, StatBlock } from "./types";
import { loadCampaignStoreFromDisk, writeCampaignStoreToDisk } from "./utils";
import { ConfirmModal } from "./modals/Confirm";
import RPToolboxPlugin from "main";

const createCodeBlock = (lang: string, content: string) => {
    return `\`\`\`${lang}\n${(content)}\n\`\`\`\n`
}

export const createInsertStatBlockCommand = ({ id, name }: StatBlock): Command => ({
    id: `insert-${id}`,
    name: `Insert ${name}`,
    editorCallback: async (editor: Editor) => {
        const content = createCodeBlock(BLOCK_PREVIEW_LANG, id)
        editor.replaceRange(content, editor.getCursor())
        editor.setCursor(editor.getCursor().line + content.length, 0)
    }
})