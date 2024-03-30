import { CampaignStore } from "@/types";
import { writable } from "svelte/store";

export type SvelteCampaignStore = {
    campaign: CampaignStore
    onUpdate: (updateFn: (store: CampaignStore) => CampaignStore, confirm?: MouseEvent) => Promise<void>
    onUpdateDeferred: (updateFn: (store: CampaignStore) => CampaignStore) => void
}

const svelteCampaignStore = writable<SvelteCampaignStore | null>(null)

export default svelteCampaignStore