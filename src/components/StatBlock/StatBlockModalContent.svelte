<script lang="ts">
	import { createAIStatBlockGeneratePrompt, sortAlphabetical } from "@/utils";
	import campaignStore, {
		SvelteCampaignStore,
	} from "../../svelteCampaignStore";
	import { v4 as uuidv4 } from "uuid";
	import { Difficulty, StatBlockSchema } from "@/types";
	import StatBlock from "./StatBlock.svelte";
	import { Notice } from "obsidian";

	let store: SvelteCampaignStore | null = null;
	campaignStore.subscribe((v) => (store = v));

    let npcFilter = "";

    let name = "";
    let description = "";
    let groupLevel = 5;
    let groupSize = 4
    let desiredDifficulty: Difficulty | string = "easy";
	let statBlockJson = "";

	const getValidation = () => {
		let result: object = {};

		try {
			result = JSON.parse(statBlockJson);
		} catch (e) {
			console.warn("Could not parse StatBlock JSON", e);
		}

		return StatBlockSchema.safeParse(result);
	}

	let statBlockValidation = getValidation();

	const handleCreate = () => {
		const validation = StatBlockSchema.safeParse(JSON.parse(statBlockJson));
		if (!validation.success) {
			return;
		}

		store?.onUpdate((s) => ({
			...s,
			npcs: [
				...s.npcs,
				{
					...validation.data,
					id: uuidv4(),
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
    <button on:click={() => {
        const prompt = createAIStatBlockGeneratePrompt(name, description, groupLevel, groupSize, desiredDifficulty);
        navigator.clipboard.writeText(prompt);

        new Notice("Prompt copied to clipboard")
    }}>Copy prompt</button>
    <br />
	<span class="text-xl">Add NPC</span>
	<form
		class="flex flex-col gap-2"
		on:submit={(e) => {
			e.preventDefault();
			handleCreate();
		}}
	>
		<textarea
			placeholder="Add your statblock JSON here"
			on:input={(e) => {
				statBlockJson = e.currentTarget.value;
				statBlockValidation = getValidation();
			}}
		/>
		<button disabled={!statBlockValidation.success} type="submit"
			>Create</button
		>
        {#if statBlockJson === ""}
            <span class="text-gray-400">Add a statblock JSON to see a preview</span>
		{:else if !statBlockValidation.success}
			<p class="text-yellow-500">Statblock is invalid</p>
		{:else}
			<StatBlock block={statBlockValidation.data} />
		{/if}
	</form>
    <br />
	<span class="text-xl">NPCs</span>
    <input type="text" placeholder="Filter NPCs" bind:value={npcFilter} />
	<ul class="flex flex-col gap-2">
		{#if store?.campaign.npcs.length === 0}
			<li>No statblocks</li>
		{/if}
		{#each (store?.campaign.npcs ?? []).filter(n => n.name.toLowerCase().includes(npcFilter.toLowerCase())).sort((a, b) => sortAlphabetical(a.name, b.name), ) as { id, name } (id)}
			<li class="flex items-center gap-2">
                <input
                    class="w-full"
                    type="text"
                    value={name}
                    on:input={(e) => handleUpdateNpcName(id, e.target)} />
				<button on:click={(e) => handleDelete(e, id)}>Remove</button>
			</li>
		{/each}
	</ul>
</div>
