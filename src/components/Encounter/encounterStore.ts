import { writable } from 'svelte/store'

import type { Combatant, Encounter, Player, StatBlock } from '../../types'
import { DEFAULT_STORE } from '@/constants'

export type EncounterStore = {
    players: Player[]
    npcs: StatBlock[]
    encounter: Encounter
    currentCombatant: Combatant | null
    focusedCombatant: Combatant | null
}

const encounterStore = writable<EncounterStore>({
    players: [],
    npcs: [],
    encounter: DEFAULT_STORE.lastEncounter,
    currentCombatant: null,
    focusedCombatant: null,
})

export default encounterStore