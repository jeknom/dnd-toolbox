import { writable } from "svelte/store";
import type OpenAI from "openai";

const settingsStore = writable({
    openAiClient: null as OpenAI | null
})

export default settingsStore