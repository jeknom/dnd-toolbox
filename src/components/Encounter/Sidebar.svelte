<script lang="ts">
	import encounterStore, { EncounterStore } from "./encounterStore";
	import { sortAlphabetical } from "@/utils";
	import { Menu, X } from "lucide-svelte";
	import encounterHandlerStore, { EncounterHandlerStore } from "./encounterHandlerStore";
    
    let encounter: EncounterStore;
	encounterStore.subscribe((e) => (encounter = e))
	
	let handler: EncounterHandlerStore
	encounterHandlerStore.subscribe((h) => (handler = h))
	
    let monsterFilter = "";
	let sidebarOpen = true;
</script>

{#if sidebarOpen}
	<div
		class="absolute z-10 flex flex-col gap-2 right-2 bg-zinc-900 h-full p-4 overflow-y-auto"
	>
		<button
			class="absolute bottom-2 right-2"
			on:click={() => (sidebarOpen = false)}><X /></button
		>
		<span class="ht text-xl">Players</span>
		<div class="flex flex-col gap-1">
			{#each encounter.players.sort( (a, b) => sortAlphabetical(a.name, b.name), ) as player (player.id)}
				<button on:click={() => handler?.addPlayer(player)}
					>{player.name}</button
				>
			{/each}
		</div>
		<span class="ht text-xl">Monsters</span>
		<input
			type="text"
			bind:value={monsterFilter}
			placeholder="Filter monsters"
		/>
		<div class="flex flex-col gap-1">
			{#each encounter.npcs
				.filter((n) => n.name
						.toLowerCase()
						.includes(monsterFilter.toLowerCase()))
				.sort( (a, b) => sortAlphabetical(a.name, b.name), ) as npc (npc.id)}
				<button on:click={() => handler?.addMonster(npc)}
					>{npc.name}</button
				>
			{/each}
		</div>
	</div>
{:else}
	<button
		class="absolute bottom-2 right-2 z-10"
		on:click={() => (sidebarOpen = true)}><Menu /></button
	>
{/if}
