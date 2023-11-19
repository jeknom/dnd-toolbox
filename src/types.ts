import { z } from 'zod'

const REQUIRED_MESSAGE = 'Property is required'
const VALUE_ZERO_OR_ABOVE_MESSAGE = 'Value needs to be more or equal to zero'

export const DndActionRawSchema = z.object({
    id: z.string().min(1, { message: REQUIRED_MESSAGE }),
    description: z.string().min(1, { message: REQUIRED_MESSAGE })
})

export const DndStatsRawSchema = z.object({
    ac: z.number().min(0, { message: VALUE_ZERO_OR_ABOVE_MESSAGE }),
    hp: z.number().min(0, { message: VALUE_ZERO_OR_ABOVE_MESSAGE }),
    speedFt: z.number().min(0, { message: VALUE_ZERO_OR_ABOVE_MESSAGE }),
})

export const DndAbilityModifiersRawSchema = z.object({
    str: z.number().min(0, { message: VALUE_ZERO_OR_ABOVE_MESSAGE }),
    dex: z.number().min(0, { message: VALUE_ZERO_OR_ABOVE_MESSAGE }),
    int: z.number().min(0, { message: VALUE_ZERO_OR_ABOVE_MESSAGE }),
    wis: z.number().min(0, { message: VALUE_ZERO_OR_ABOVE_MESSAGE }),
    cha: z.number().min(0, { message: VALUE_ZERO_OR_ABOVE_MESSAGE }),
    con: z.number().min(0, { message: VALUE_ZERO_OR_ABOVE_MESSAGE }),
})

export const DndCharacterTemplateRawSchema = z.object({
    id: z.string().min(1, { message: REQUIRED_MESSAGE }),
    stats: DndStatsRawSchema,
    modifiers: DndAbilityModifiersRawSchema,
    actions: z.array(z.string().min(1, { message: REQUIRED_MESSAGE })).optional()
})

export const DndCharacterRawSchema = z.object({
    id: z.string().min(1, { message: REQUIRED_MESSAGE }),
    isPlayer: z.boolean(),
    template: z.string().optional(),
    alignment: z.string().optional(),
    size: z.string().optional(),
    race: z.string().optional(),
})

export const DndDiceRegexGroupsSchema = z.object({
    die: z.string().min(1, { message: REQUIRED_MESSAGE }),
    multiplier: z.string().min(1, { message: REQUIRED_MESSAGE }),
    operator: z.literal('+').or(z.literal('-')).optional(),
    modifier: z.string().min(1, { message: REQUIRED_MESSAGE }).optional()
})

export const DndToHitRegexGroupsSchema = z.object({
    toHit: z.string().min(1, { message: REQUIRED_MESSAGE })
})

export type DndActionRaw = z.infer<typeof DndActionRawSchema>
export type DndStatsRaw = z.infer<typeof DndStatsRawSchema>
export type DndAbilityModifiersRaw = z.infer<typeof DndAbilityModifiersRawSchema>
export type DndCharacterTemplateRaw = z.infer<typeof DndCharacterTemplateRawSchema>
export type DndCharacterRaw = z.infer<typeof DndCharacterRawSchema>

export type DndToolboxState = {
	actions: Map<string, DndActionRaw>
	characterTemplates: Map<string, DndCharacterTemplate>
	characters: Map<string, DndCharacter>
}
export type DndCharacterTemplate = Omit<DndCharacterTemplateRaw, 'actions'> & { actions: DndActionRaw[] }
export type DndCharacter = Omit<DndCharacterRaw, 'template'> & { template?: DndCharacterTemplate }
export type DndDiceData = { die: number, multiplier: number, modifier?: number }
export type DndStat = 'hp' | 'ac' | 'str' | 'int' | 'wis' | 'cha' | 'con' | 'dex'
export type DndCombatant = { id: string, initiative: number, character: DndCharacter }
export type DndEncounter = { hasStarted: boolean, combatants: DndCombatant[] }
export type ParseErrorTypeIndicator = 'CharacterTemplate' | 'Character' | 'Action'