import { Vault } from "obsidian";
import { DEFAULT_STORE, STORE_FILENAME } from "./constants";
import { CampaignStoreSchema } from "./types";

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

export async function getSavedCampaignStore(vault: Vault) {
    const files = vault.getFiles()
    let storedBlocks = files.find((f) => f.name.includes(STORE_FILENAME))

    if (storedBlocks === undefined) {
        storedBlocks = await vault.create(`/${STORE_FILENAME}`, JSON.stringify(DEFAULT_STORE, null, 4))
    }
    
    const content = await vault.read(storedBlocks)
    const validation = CampaignStoreSchema.safeParse(JSON.parse(content))
    
    if (validation.success) {
        return validation.data
    } else {
        throw validation.error
    }
}