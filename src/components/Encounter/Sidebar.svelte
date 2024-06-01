<script lang="ts">
	import encounterStore, { EncounterStore } from "./encounterStore";
	import { sortAlphabetical } from "@/utils";
	import encounterHandlerStore, {
		EncounterHandlerStore,
	} from "./encounterHandlerStore";
	import SidebarToggleButton from "./SidebarToggleButton.svelte";

	let encounter: EncounterStore;
	encounterStore.subscribe((e) => (encounter = e));

	let handler: EncounterHandlerStore;
	encounterHandlerStore.subscribe((h) => (handler = h));

	let monsterFilter = "";
	let sidebarOpen = true;
</script>

{#if sidebarOpen}
	<div
		class="flex flex-row items-center h-full"
	>
		<SidebarToggleButton
			{sidebarOpen}
			onClick={() => (sidebarOpen = false)}
		/>
		<div class="p-4 flex flex-col gap-2 bg-zinc-900 h-full overflow-y-auto rounded-md shadow-md min-w-[300px]">
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
	</div>
{:else}
	<span class="flex h-full items-center">
		<SidebarToggleButton
			{sidebarOpen}
			onClick={() => (sidebarOpen = true)}
		/>
	</span>
{/if}
