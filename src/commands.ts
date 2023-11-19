import { Command, Editor } from "obsidian";
import { stringify } from "yaml";
import { DndActionRaw, DndCharacterRaw, DndCharacterTemplateRaw } from "./types";
import { DND_ACTION_LANG, DND_CHARACTER_LANG, DND_TEMPLATE_CHARACTER_LANG } from "./constants";

const createCodeBlock = <TContent extends object>(lang: string, content: TContent) => {
    return `\`\`\`${lang}\n${stringify(content)}\`\`\``
}

export const insertAction: Command = {
    id: 'insert-action',
    name: 'Insert Action',
    editorCallback: (editor: Editor) => {
        editor.replaceRange(createCodeBlock(DND_ACTION_LANG, {
            id: 'Name and ID of the action',
            description: '+5 to hit. The sword does 1d6+4 slashing damage and 1d4 piercing damage'
        } as DndActionRaw),
            editor.getCursor()
        )
    }
}

export const insertCharacterTemplate: Command = {
    id: 'insert-character-template',
    name: 'Insert Character Template',
    editorCallback: (editor: Editor) => {
        editor.replaceRange(createCodeBlock(DND_TEMPLATE_CHARACTER_LANG, {
            id: 'Name and ID of the template',
            stats: {
                hp: 100,
                ac: 14,
                speedFt: 30
            },
            modifiers: {
                str: 5,
                dex: 3,
                int: 1,
                wis: 1,
                cha: 1,
                con: 1,
            },
            actions: [
                'This needs to match to the ID of an action',
                'And you can have multiple actions'

            ]
        } as DndCharacterTemplateRaw),
        editor.getCursor())
    }
}

export const insertCharacter: Command = {
    id: 'insert-character',
    name: 'Insert Character',
    editorCallback: (editor: Editor) => {
        editor.replaceRange(createCodeBlock(DND_CHARACTER_LANG, {
            id: 'Name and ID of the character',
            isPlayer: false,
            template: 'This needs to match to the ID of a character template',
            alignment: 'Neutral Good',
            size: 'Medium',
            race: 'Human'
        } as DndCharacterRaw),
        editor.getCursor())
    }
}