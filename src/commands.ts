import { Command, Editor } from "obsidian";
import { BLOCK_PREVIEW_LANG } from "./constants";
import { Player, StatBlock } from "./types";
import { loadCampaignStoreFromDisk, writeCampaignStoreToDisk } from "./utils";

const createCodeBlock = (lang: string, content: string) => {
    return `\`\`\`${lang}\n${(content)}\n\`\`\`\n`
}

export const createInsertStatBlockCommand = ({ id, name }: StatBlock): Command => ({
    id: `insert-${id}`,
    name: `Insert ${name}`,
    editorCallback: async (editor: Editor, ctx) => {
        const content = createCodeBlock(BLOCK_PREVIEW_LANG, id)
        editor.replaceRange(content, editor.getCursor())
        editor.setCursor(editor.getCursor().line + content.length, 0)
    }
})

export const createDeletePlayerCommand = ({ id, name }: Player): Command => ({
    id: `delete-${id}`,
    name: `Delete ${name}`,
    editorCallback: async (editor: Editor, ctx) => {
        const store = await loadCampaignStoreFromDisk(ctx.app.vault)
        const newStore = {
            ...store,
            npcs: store.npcs.filter((npc) => npc.id !== id)
        }

        await writeCampaignStoreToDisk(ctx.app.vault, newStore)
    }
})