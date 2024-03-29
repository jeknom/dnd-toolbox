import { Command, Editor } from "obsidian";
import { BLOCK_PREVIEW_LANG } from "./constants";
import { StatBlock } from "./types";

const createCodeBlock = (lang: string, content: string) => {
    return `\`\`\`${lang}\n${(content)}\n\`\`\`\n`
}

export const createAddStatBlockCommand = (block: StatBlock): Command => ({
    id: block.id,
    name: `Insert ${block.name}`,
    editorCallback: async (editor: Editor, ctx) => {
        const content = createCodeBlock(BLOCK_PREVIEW_LANG, block.id)
        editor.replaceRange(content, editor.getCursor())
        editor.setCursor(editor.getCursor().line + content.length, 0)
    }
})