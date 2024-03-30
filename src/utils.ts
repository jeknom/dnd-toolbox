import { Notice, Vault } from "obsidian";
import { APP_NAME, DEFAULT_STORE, EXAMPLE_EASY_NPC, EXAMPLE_LEGENDARY_NPC, EXAMPLE_MEDIUM_NPC, STORE_FILENAME } from "./constants";
import { CampaignStore, CampaignStoreSchema, Difficulty, Encounter } from "./types";

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

export const createAIStatBlockGeneratePrompt = (name: string, description: string, groupLevel: number, groupSize: number, desiredDifficulty: Difficulty | string) => {
    const context1 = `Create a stat block for a dungeons and dragons 5e creature who goes by the name of ${name}. The following is a description of the creature: "${description}"\n\n`
    const context2 = `The stat block needs to be JSON and follow specific format rules. Please ensure that the stat block is valid JSON and follows the format rules. Here are examples of valid stat blocks:\n\n`
    const context3 = `${JSON.stringify(EXAMPLE_EASY_NPC, null, 4)}\n\n`
    const context4 = `${JSON.stringify(EXAMPLE_MEDIUM_NPC, null, 4)}\n\n`
    const context5 = `${JSON.stringify(EXAMPLE_LEGENDARY_NPC, null, 4)}\n\n`
    const context6 = `Scale the creature so that it provides a ${desiredDifficulty} challenge for a group of ${groupSize} players who are all level ${groupLevel}.`

    return `${context1}${context6}${context2}${context3}${context4}${context5}`
}