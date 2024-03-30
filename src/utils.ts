import { Notice, Vault } from "obsidian";
import { APP_NAME, DEFAULT_STORE, STORE_FILENAME } from "./constants";
import { CampaignStore, CampaignStoreSchema, Encounter } from "./types";

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

export async function loadCampaignStoreFromDisk(vault: Vault) {
    const storeExists = await vault.adapter.exists(STORE_FILENAME)
    
    if (!storeExists) {
        new Notice("No store found, creating a new one")
        
        await vault.create(STORE_FILENAME, JSON.stringify(DEFAULT_STORE, null, 4))
        
        new Notice("New store created with default values")
    }
    
    const content = await vault.adapter.read(STORE_FILENAME)
    const validation = CampaignStoreSchema.safeParse(JSON.parse(content))
    
    if (validation.success) {
        new Notice(`${APP_NAME} store loaded successfully!`)

        return validation.data
    } else {
        throw validation.error
    }
}

export async function writeCampaignStoreToDisk(vault: Vault, newStore: CampaignStore) {
    const validation = CampaignStoreSchema.safeParse(newStore)
    if (validation.success) {
        await vault.adapter.write(STORE_FILENAME, JSON.stringify(validation.data, null, 4))
    } else {
        throw validation.error
    }
}

export function getCurrentCombatant(encounter: Encounter) {
    if (encounter.currentCombatantIndex === null) {
        return null
    }

    return encounter.combatants[encounter.currentCombatantIndex]
}

export function getFocusedCombatant(encounter: Encounter) {
    if (encounter.focusedCombatantIndex === null) {
        return null
    }

    return encounter.combatants[encounter.focusedCombatantIndex]
}