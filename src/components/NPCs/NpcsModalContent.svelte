<script lang="ts">
	import { createAIStatBlockGeneratePrompt, sortAlphabetical } from "@/utils";
	import campaignStore, {
		SvelteCampaignStore,
	} from "../../svelteCampaignStore";
	import { v4 as uuidv4 } from "uuid";
	import { Difficulty, Model, StatBlockSchema } from "@/types";
	import StatBlock from "../StatBlock/StatBlock.svelte";
	import { Notice } from "obsidian";
	import settingsStore from "@/settingsStore";
	import OpenAI from "openai";

	let openAiClient: OpenAI | null = null;
	settingsStore.subscribe((v) => {
		openAiClient = v.openAiClient
	});

	let store: SvelteCampaignStore | null = null;
	campaignStore.subscribe((v) => (store = v));

    let npcFilter = "";

    let name = "";
    let description = "";
    let groupLevel = 5;
    let groupSize = 4
    let desiredDifficulty: Difficulty | string = "easy";
	let statBlockJson = "";
	let isGeneratingResponse = false;
	let model: Model = 'gpt-3.5-turbo'

	const getValidation = (statBlock: string) => {
		let result: object = {};

		try {
			result = JSON.parse(statBlock);
		} catch (e) {
			console.warn("Could not parse StatBlock JSON", e);
		}

		return StatBlockSchema.safeParse(result);
	}

	let statBlockValidation = getValidation(statBlockJson);
	$: existingNpc = store?.campaign.npcs.find(n => statBlockValidation.success ? statBlockValidation.data.id === n.id : false) ?? null
	
	const handleCreateAndUpdate = () => {
		const validation = StatBlockSchema.safeParse(JSON.parse(statBlockJson));
		if (!validation.success) {
			return;
		}

		statBlockJson = "";



		store?.onUpdate((s) => ({
			...s,
			npcs: [
				...s.npcs.filter((n) => n.id !== validation.data.id),
				{
					...validation.data,
					id: existingNpc !== null ? existingNpc.id : uuidv4(),
				},
			],
		}));

		statBlockJson = "";
	}

	const handleDelete = (mouseEvent: MouseEvent, id: string) => {
		store?.onUpdate((s) => ({
			...s,
			npcs: s.npcs.filter((n) => n.id !== id),
		}), mouseEvent);
	}

    const handleUpdateNpcName = (id: string, target: EventTarget | null) => {
        if (!target) return;

        const value = (target as HTMLInputElement).value;
        store?.onUpdateDeferred((s) => ({
            ...s,
            npcs: s.npcs.map(n => n.id === id ? { ...n, name: value } : n)
        }))
    }

	const handleGenerateContentFromOpenAI = async () => {
		if (!openAiClient) {
			new Notice("OpenAI client not initialized. Please check your settings.");
			return;
		}

		try {
			isGeneratingResponse = true

			const completion = await openAiClient.chat.completions.create({
				model,
				messages: [{ role: 'user', content: createAIStatBlockGeneratePrompt(name, description, groupLevel, groupSize, desiredDifficulty) }],
				max_tokens: 4096,
				response_format: { type: 'json_object' }
			})

			statBlockJson = statBlockJson.concat(completion.choices[0]?.message.content || '')
			statBlockValidation = getValidation(statBlockJson);
		} catch (e) {
			console.error(e)
			new Notice(e.message)
		} finally {
			isGeneratingResponse = false
		}	
	}

	const handleModelChange = (value: string) => {
		if (value === 'gpt-3.5-turbo' || value === 'gpt-4-0125-preview') {
			model = value
		} else {
			console.error('Unknown model', value)
			new Notice('Unknown model')
		}
	}
</script>

<div class="flex flex-col gap-4">
    <span class="text-xl">Generate AI Prompt</span>
    <span>You can generate a prompt for AI to create the statblock JSON for you. Just fill in the character name and a short description to give the AI some context.</span>
    <input type="text" placeholder="Character name" bind:value={name} />
    <textarea placeholder="Character description" bind:value={description} />
    <input type="number" placeholder="Group level" on:input={e => groupLevel = parseInt(e.currentTarget.value)} />
    <input type="number" placeholder="Group size" on:input={e => groupSize = parseInt(e.currentTarget.value)} />
    <select name="Difficulty" on:change={e => desiredDifficulty = e.currentTarget.value}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
        <option value="deadly">Deadly</option>
      </select>
	<select on:change={(e) => handleModelChange(e.currentTarget.value)}>
		<option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
		<option value="gpt-4-0125-preview">GPT-4 Turbo</option>
	</select>
	<button disabled={isGeneratingResponse} on:click={handleGenerateContentFromOpenAI}>{isGeneratingResponse ? 'Generating...' : 'Generate'}</button>
    <button on:click={() => {
        const prompt = createAIStatBlockGeneratePrompt(name, description, groupLevel, groupSize, desiredDifficulty);
		console.log(prompt.length)
        navigator.clipboard.writeText(prompt);

        new Notice(`Copied prompt to clipboard (${prompt.length} characters)`)
    }}>Copy prompt</button>

    <br />
	<span class="text-xl">Add NPC</span>
	<span>Once you have generated your JSON statblock, paste it here to validate it and create new NPC.</span>
	<form
		class="flex flex-col gap-2"
		on:submit={(e) => {
			e.preventDefault();
			handleCreateAndUpdate();
		}}
	>
		<textarea
			placeholder="Add your statblock JSON here"
			disabled={isGeneratingResponse}
			on:input={(e) => statBlockValidation = getValidation(e.currentTarget.value)}
			bind:value={statBlockJson}
		/>
		<button disabled={!statBlockValidation.success} type="submit">{existingNpc !== null ? 'Update' : 'Create'}</button
		>
        {#if statBlockJson === ""}
            <span class="text-gray-400">Add a statblock JSON to see a preview</span>
		{:else if !statBlockValidation.success}
			{#each statBlockValidation.error.issues as issue}
				<p class="text-red-500">{issue.message} {#if issue.path}{issue.path.join(".")}{/if}</p>
			{/each}
		{:else}
			<StatBlock singleColumn block={statBlockValidation.data} />
		{/if}
	</form>
    <br />
	<span class="text-xl">NPCs</span>
	<span>Here are your existing NPCs. You can delete them or load them to the above Add NPC editor to update them.</span>
    <input type="text" placeholder="Filter NPCs" bind:value={npcFilter} />
	<ul class="flex flex-col gap-2">
		{#if store?.campaign.npcs.length === 0}
			<li>No statblocks</li>
		{/if}
		{#each (store?.campaign.npcs ?? []).filter(n => n.name.toLowerCase().includes(npcFilter.toLowerCase())).sort((a, b) => sortAlphabetical(a.name, b.name), ) as npc (npc.id)}
			<li class="flex items-center gap-2">
                <input
                    class="w-full"
                    type="text"
                    value={npc.name}
                    on:input={(e) => handleUpdateNpcName(npc.id, e.target)} />
				<button on:click={(e) => {
					const npcJson = JSON.stringify(npc, null, 4)
					statBlockJson = npcJson
					statBlockValidation = getValidation(npcJson)
				}}>Load</button>
				<button on:click={(e) => handleDelete(e, npc.id)}>Remove</button>
			</li>
		{/each}
	</ul>
</div>
