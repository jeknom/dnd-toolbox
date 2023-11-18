export type DndActionRaw = {
    id: string
    description: string
}

export type DndAction = DndActionRaw

export type DndStats = {
    ac: number
    hp: number
    spd: number
}

export type DndAbilityModifiers = {
    str: number
    dex: number
    int: number
    wis: number
    cha: number
    con: number
}

export type DndCharacterTemplateRaw = {
    id: string
    stats: DndStats
    modifiers: DndAbilityModifiers
    actions: string[]
}

export type DndCharacterTemplate = Omit<DndCharacterTemplateRaw, 'actions'> & { actions: DndAction[] }

export type DndCharacterRaw = {
    template?: string
    id: string
}

export type DndCharacter = Omit<DndCharacterRaw, 'template'> & { template?: DndCharacterTemplate }