<script lang="ts">
	import { Clock, Swords } from "lucide-svelte";
	import encounterStore, { EncounterStore } from "./encounterStore";

	let eStore: EncounterStore;
	encounterStore.subscribe((e) => (eStore = e));

	$: ({
		currentCombatant,
		encounter: { turns, combatants },
	} = eStore);
</script>

<div class="flex gap-2 items-center justify-center text-xs">
	{#if currentCombatant}
		<div class="flex gap-1 items-center">
			<Clock size="16" />
			{#if turns <= combatants.length}
				<span>First round</span>
			{:else if turns % combatants.length === 0}
				<span>Round {Math.floor(turns / combatants.length)}</span>
			{:else}
				<span>Round {Math.floor(turns / combatants.length) + 1}</span>
			{/if}
		</div>
		<div class="flex gap-1 items-center">
			<Swords size="16" />
			<span
				>{currentCombatant?.player?.name ??
					currentCombatant?.statBlock?.name ??
					"Unknown"}'s turn</span
			>
		</div>
	{:else}
		<span>Waiting for encounter to start...</span>
	{/if}
</div>
