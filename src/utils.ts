import { TFile, Vault } from "obsidian";
import { parse } from 'yaml'
import type { DndAction, DndActionRaw, DndCharacter, DndCharacterRaw, DndCharacterTemplate, DndCharacterTemplateRaw } from "./types";

export const REGEX_DND_ACTION = /```dnd-action\s*([\s\S]+?)\s*```/g
export const REGEX_DND_CHARACTER_TEMPLATE = /```dnd-character-template\s*([\s\S]+?)\s*```/g
export const REGEX_DND_CHARACTER = /```dnd-character\s*([\s\S]+?)\s*```/g

/**
 * Loads all necessary data for the application. Some resources are dependent on each other which is why these need to be loaded in order.
 */
export async function loadAllData(files: TFile[], actions: Map<string, DndAction>, characterTemplates: Map<string, DndCharacterTemplate>, characters: Map<string, DndCharacter>) {
    const loadActionPromises: Promise<void>[] = []
    files.forEach(f => loadActionPromises.push(loadDndAction(f, actions)))
    await Promise.all(loadActionPromises)

    // Character templates are dependent on actions
    const loadCharacterTemplatePromises: Promise<void>[] = []
    files.forEach(f => loadCharacterTemplatePromises.push(loadDndCharacterTemplate(f, characterTemplates, actions)))
    await Promise.all(loadCharacterTemplatePromises)

    // Characters are dependent on the character templates
    const loadCharacterPromises: Promise<void>[] = []
    files.forEach(f => loadCharacterPromises.push(loadDndCharacter(f, characters, characterTemplates)))
    await Promise.all(loadCharacterPromises)
}

/**
 * Loads all action blocks from a file and adds them to the provided actions map.
 */
async function loadDndAction(file: TFile, actions: Map<string, DndAction>) {
    await parseAndProcessRegexMatches<DndActionRaw>(
        REGEX_DND_ACTION,
        file,
        (action) => actions.set(action.id, action as DndAction)
    )
}

/**
 * Loads all character template blocks from a file and adds them to the provided character templates map.
 */
async function loadDndCharacterTemplate(file: TFile, characterTemplates: Map<string, DndCharacterTemplate>, actions: Map<string, DndAction>) {
    await parseAndProcessRegexMatches<DndCharacterTemplateRaw>(
        REGEX_DND_CHARACTER_TEMPLATE,
        file,
        ({ id, stats, modifiers, actions: templateActions }) => {
            const charActions = templateActions
                .map(a => actions.get(a))
                .filter(a => a !== undefined) as DndAction[]
            console.log({ charActions, templateActions })
            characterTemplates.set(id, { id, stats, modifiers, actions: charActions })
        }
    )
}

/**
 * Loads all character blocks from a file and adds them to the provided character array.
 */
async function loadDndCharacter(file: TFile, characters: Map<string, DndCharacter>, characterTemplates: Map<string, DndCharacterTemplate>) {
    await parseAndProcessRegexMatches<DndCharacterRaw>(REGEX_DND_CHARACTER, file, ({ id, template }) => {
        const charTemplate = template !== undefined ? characterTemplates.get(template) : undefined

        characters.set(id, { id, template: charTemplate })
    })
}

async function parseAndProcessRegexMatches<ResultingType>(
    regex: RegExp,
    file: TFile,
    forEach: (resultingType: ResultingType) => void) {
    const fileAsText = await file.vault.read(file)
    const matches = fileAsText.matchAll(regex)
    
    for (const match of matches) {
        try {
            const resultingType = parse(match[1]) as ResultingType
            forEach(resultingType)
        } catch (error) {
            console.warn('Failed to parse', error)
        }
    }
}