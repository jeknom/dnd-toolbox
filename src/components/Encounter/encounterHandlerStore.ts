import { writable } from 'svelte/store';
import EncounterStateHandler from './EncounterStateHandler'

export type EncounterHandlerStore = EncounterStateHandler | null

const encounterHandlerStore = writable<EncounterHandlerStore>(null)

export default encounterHandlerStore