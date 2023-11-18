import { TFile } from "obsidian";
import { parse } from 'yaml'
import { DndActionRaw, DndActionRawSchema, DndCharacter, DndCharacterRaw, DndCharacterRawSchema, DndCharacterTemplate, DndCharacterTemplateRaw, DndCharacterTemplateRawSchema, DndDiceData, DndDiceRegexGroupsSchema, DndToHitRegexGroupsSchema, ParseErrorTypeIndicator } from "./types";
import { ZodError } from "zod";

export const REGEX_DND_ACTION = /```dnd-action\s*(?<yaml>[\s\S]+?)\s*```/g
export const REGEX_DND_CHARACTER_TEMPLATE = /```dnd-template-character\s*(?<yaml>[\s\S]+?)\s*```/gm
export const REGEX_DND_CHARACTER = /```dnd-character\s*(?<yaml>[\s\S]+?)\s*```/g
export const REGEX_DICE = /\b(?<multiplier>\d+)d(?<die>\d+)(?:\s*(?<operator>[+-])\s*(?<modifier>\d+))?\b/g
export const REGEX_TO_HIT = /\+(?<toHit>\d+)\s+to\s+hit/g

/**
 * Get a random number between the min and max values
 */
export function randomRange(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * When you call `.sort` on an array, you can use this to sort the items alphabetically based on any properties you'd like
 */
export function sortAlphabetical(a: string, b: string) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

export function parseDiceDataFromString(value: string) {
    const diceData: DndDiceData[] = []

    const toHitMatches = value.matchAll(REGEX_TO_HIT)
    for (const match of toHitMatches) {
        const validation = DndToHitRegexGroupsSchema.safeParse(match.groups)
        if (validation.success) {
            const { toHit } = validation.data

            try {
                diceData.push({
                    die: 20,
                    multiplier: 1,
                    modifier: parseInt(toHit)
                })
            } catch (error) {
                console.warn('Failed to parse dice data:', validation.data)
            }
        }
    }

    const diceMatches = value.matchAll(REGEX_DICE)
    for (const match of diceMatches) {
        const validation = DndDiceRegexGroupsSchema.safeParse(match.groups)
        if (validation.success) {
            const { die, multiplier, modifier, operator } = validation.data

            try {
                diceData.push({
                    die: parseInt(die),
                    multiplier: parseInt(multiplier),
                    modifier: modifier === undefined
                        ? undefined
                        : operator === '-'
                            ? -(parseInt(modifier))
                            : parseInt(modifier)
                })
            } catch (error) {
                console.warn('Failed to parse dice data:', validation.data)
            }
        }
    }

    return diceData
}

/**
 * Loads all necessary data for the application. Some resources are dependent on each other which is why these need to be loaded in order.
 */
export async function loadAllData(
    files: TFile[],
    actions: Map<string, DndActionRaw>,
    characterTemplates: Map<string, DndCharacterTemplate>,
    characters: Map<string, DndCharacter>,
) {
    const errors: ZodError[] = []
    const loadActionPromises: Promise<void>[] = []
    files.forEach(f => loadActionPromises.push(loadDndAction(f, actions, errors)))
    await Promise.all(loadActionPromises)

    // Character templates are dependent on actions
    const loadCharacterTemplatePromises: Promise<void>[] = []
    files.forEach(f => loadCharacterTemplatePromises.push(loadDndCharacterTemplate(f, characterTemplates, actions, errors)))
    await Promise.all(loadCharacterTemplatePromises)

    // Characters are dependent on the character templates
    const loadCharacterPromises: Promise<void>[] = []
    files.forEach(f => loadCharacterPromises.push(loadDndCharacter(f, characters, characterTemplates, errors)))
    await Promise.all(loadCharacterPromises)

    return { errors }
}

export function validateDndAction(data: unknown) {
    const validation = DndActionRawSchema.safeParse(data)
    let action: DndActionRaw | null = null
    let error: ZodError<DndActionRaw> | null = null

    if (validation.success) {
        action = validation.data
    } else {
        error = validation.error
    }

    return { action, error }
}

/**
 * Loads all action blocks from a file and adds them to the provided actions map.
 */
async function loadDndAction(
    file: TFile,
    actions: Map<string, DndActionRaw>,
    errors: ZodError[]
) {
    await parseAndProcessRegexMatches<DndActionRaw>(
        REGEX_DND_ACTION,
        file,
        'Action',
        errors,
        (data) => {
            const { action, error } = validateDndAction(data)

            if (action !== null) {
                actions.set(action.id, action)
            }

            if (error !== null) {
                updateErrors(file, error, errors)
            }
        }
    )
}

/**
 * Loads all character template blocks from a file and adds them to the provided character templates map.
 */
async function loadDndCharacterTemplate(
    file: TFile,
    characterTemplates: Map<string, DndCharacterTemplate>,
    actions: Map<string, DndActionRaw>,
    errors: ZodError[]
) {
    await parseAndProcessRegexMatches<DndCharacterTemplateRaw>(
        REGEX_DND_CHARACTER_TEMPLATE,
        file,
        'CharacterTemplate',
        errors,
        (templateRaw) => {
            const validation = DndCharacterTemplateRawSchema.safeParse(templateRaw)

            if (validation.success) {
                const { actions: templateActions, id, stats, modifiers } = validation.data
                const charActions = (templateActions ?? [])
                    .map(a => actions.get(a))
                    .filter(a => a !== undefined) as DndActionRaw[]
                characterTemplates.set(id, { id, stats, modifiers, actions: charActions })
            } else {
                updateErrors(file, validation.error, errors)
            }
        }
    )
}

/**
 * Loads all character blocks from a file and adds them to the provided character array.
 */
async function loadDndCharacter(
    file: TFile,
    characters: Map<string, DndCharacter>,
    characterTemplates: Map<string, DndCharacterTemplate>,
    errors: ZodError[]
) {
    await parseAndProcessRegexMatches<DndCharacterRaw>(
        REGEX_DND_CHARACTER,
        file,
        'Character',
        errors,
        (characterRaw) => {
            const validation = DndCharacterRawSchema.safeParse(characterRaw)

            if (validation.success) {
                const { id, isPlayer, template } = validation.data
                const charTemplate = template !== undefined ? characterTemplates.get(template) : undefined

                characters.set(id, { id, template: charTemplate, isPlayer })
            } else {
                updateErrors(file, validation.error, errors)
            }
        })
}

async function parseAndProcessRegexMatches<ResultingType>(
    regex: RegExp,
    file: TFile,
    typeIndicatorForErrors: ParseErrorTypeIndicator,
    errors: ZodError[],
    forEach: (resultingType: ResultingType) => void
) {
    const fileAsText = await file.vault.read(file)
    const matches = fileAsText.matchAll(regex)

    for (const match of matches) {
        try {
            const resultingType = parse(match[1]) as ResultingType
            forEach(resultingType)
        } catch (error) {
            const zodError = new ZodError([
                {
                    code: 'custom',
                    message: `An error occurred in ${file.path}: Failed to parse ${typeIndicatorForErrors} data\n${(error as Error).message}`,
                    path: file.path.split('/'),
                }
            ])
            errors.push(zodError)
        }
    }
}

function updateErrors<TError>(file: TFile, zodError: ZodError<TError>, errors: ZodError[]) {
    const errorPrefix = `An error occurred in ${file.path}: `
    zodError.errors.forEach(e => {
        let message = errorPrefix

        if (e.code === 'invalid_type') {
            message = `${message} Invalid type at '${e.path.join('.')}', expected ${e.expected} but got ${e.received} instead`
        } else {
            message = `${message} unhandled error type ${e.code}`
        }

        e.message = message
    })

    errors.push(zodError)
}