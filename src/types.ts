import { z } from 'zod'
import { LANGUAGES, MONSTER_TYPES, SIZES } from './constants'

const REQUIRED_MESSAGE = 'Property is required'
const VALUE_ZERO_OR_ABOVE_MESSAGE = 'Value needs to be more or equal to zero'

const MonsterType = z.enum(MONSTER_TYPES)
const MonsterSize = z.enum(SIZES)
const MonsterLanguages = z.enum(LANGUAGES)

export const ActionSchema = z.object({
    name: z.string().min(1, { message: REQUIRED_MESSAGE }),
    description: z.string().min(1, { message: REQUIRED_MESSAGE })
})

export type Action = z.infer<typeof ActionSchema>

const AbilityScoreSchema = z.number().min(0)

export const AbilityScoresSchema = z.object({
    str: AbilityScoreSchema,
    dex: AbilityScoreSchema,
    int: AbilityScoreSchema,
    wis: AbilityScoreSchema,
    cha: AbilityScoreSchema,
    con: AbilityScoreSchema,
})

export const SensesSchema = z.object({
    blindsight: z.number().min(0).optional(),
    darkvision: z.number().min(0).optional(),
    tremorsense: z.number().min(0).optional(),
    truesight: z.number().min(0).optional(),
})

export const SpeedsSchema = z.object({
    ground: z.number().min(0).optional(),
    fly: z.number().min(0).optional(),
    swim: z.number().min(0).optional(),
    climb: z.number().min(0).optional(),
})

export const LegendarySchema = z.object({
    hasResistance: z.boolean().optional(),
    actions: z.array(ActionSchema).optional()
})

export const StatBlockSchema = z.object({
    id: z.string().min(1, { message: REQUIRED_MESSAGE }),
    name: z.string().min(1, { message: REQUIRED_MESSAGE }), 
    ac: z.number().min(0, { message: VALUE_ZERO_OR_ABOVE_MESSAGE }),
    hp: z.number().min(0, { message: VALUE_ZERO_OR_ABOVE_MESSAGE }),
    speeds: SpeedsSchema.optional(),
    abilityScores: AbilityScoresSchema,
    alignment: z.string().optional(),
    type: MonsterType.optional(),
    size: MonsterSize.optional(),
    languages: MonsterLanguages.array().optional(),
    senses: SensesSchema.optional(),
    actions: ActionSchema.array().optional(),
    bonusActions: ActionSchema.array().optional(),
    abilites: ActionSchema.array().optional(),
    legendary: LegendarySchema.optional(),
})

export type StatBlock = z.infer<typeof StatBlockSchema>

export const CampaignStoreSchema = z.object({
    npcs: StatBlockSchema.array()
})

export type CampaignStore = z.infer<typeof CampaignStoreSchema>