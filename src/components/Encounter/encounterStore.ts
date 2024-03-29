import { writable } from 'svelte/store'

import type { Encounter } from '../../types'
import { DEFAULT_STORE } from '@/constants'

const encounterStore = writable<Encounter>(DEFAULT_STORE.lastEncounter)

export default encounterStore