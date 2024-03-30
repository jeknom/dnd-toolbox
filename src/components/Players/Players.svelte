<script lang="ts">
	import { sortAlphabetical } from "@/utils";
	import campaignStore, { SvelteCampaignStore } from "../../svelteCampaignStore";
    import { v4 as uuidv4 } from 'uuid';

	let store: SvelteCampaignStore | null = null;
	campaignStore.subscribe((v) => (store = v));

	let name = "";

    const handleCreate = () => {
        if (name === "") {
            return
        }

        store?.onUpdate((s) => ({
            ...s,
            players: [
                ...s.players,
                {
                    id: uuidv4(),
                    name,
                },
            ],
        
        }))
        name = "";
    }

    const handleDelete = (id: string, mouseEvent: MouseEvent) => {
        store?.onUpdate((s) => ({
            ...s,
            players: s.players.filter((p) => p.id !== id),
        }), mouseEvent);
    }
</script>

<div class="flex flex-col gap-4">
	<span class="text-xl">Add player</span>
    <form class="flex flex-col gap-2" on:submit={(e) => {
        e.preventDefault()
        handleCreate()
    }}>
        <input type="text" placeholder="Player name" bind:value={name} />
        <button disabled={name === ""} type="submit">Create</button>
    </form>
	<span class="text-xl">Players</span>
	<ul class="flex flex-col gap-2">
		{#if store?.campaign.players.length === 0}
			<li>No players</li>
		{/if}
		{#each (store?.campaign.players ?? []).sort( (a, b) => sortAlphabetical(a.name, b.name), ) as { id, name } (id)}
			<li class="flex items-center justify-between">
				{name}
				<button on:click={(e) => handleDelete(id, e)}>Remove</button>
			</li>
		{/each}
	</ul>
</div>
