<script lang="ts">
	import { Combatant } from "@/types";
	import encounterStore, { EncounterStore } from "./encounterStore";
	import encounterHandlerStore, { EncounterHandlerStore } from "./encounterHandlerStore";
	import { Dices, HeartPulse, SunSnow, X } from "lucide-svelte";

	export let combatant: Combatant;
    $: ({ id, hp, player, statBlock, notes, initiative, conditions } = combatant)
    
    let eStore: EncounterStore;
	encounterStore.subscribe((e) => (eStore = e));

	$: ({ focusedCombatant, currentCombatant } = eStore);

	let handler: EncounterHandlerStore;
	encounterHandlerStore.subscribe((h) => (handler = h));
</script>

<div
	class="relative flex flex-col gap-2 p-2 cursor-pointer {hp === 0
		? 'bg-red-500'
		: id === focusedCombatant?.id
			? 'bg-zinc-500'
			: id === currentCombatant?.id
				? 'bg-zinc-600'
				: 'bg-zinc-700'}"
	role="button"
	tabindex="0"
	on:keyup={(e) => e.key === "Enter" && handler?.changeFocus(id)}
	on:click={() => handler?.changeFocus(id)}
>
	<span
		class="text-sm {player !== undefined
			? 'text-green-600'
			: 'text-yellow-400'}">{player?.name ?? statBlock?.name}</span
	>
	{#if notes}
		<span class="text-xs text-gray-400">{notes}</span>
	{/if}
	<div class="flex gap-1 text-xs items-center">
		<Dices />
		<input
			type="text"
			value={initiative}
			on:input={({ currentTarget: { value } }) =>
				handler?.updateInitiative(id, value)}
		/>
	</div>
	{#if hp !== undefined}
		<div class="flex gap-1 text-xs items-center">
			<HeartPulse />
			<input
				type="text"
				value={hp.toString()}
				on:input={({ currentTarget: { value } }) =>
					handler?.updateHp(id, value)}
			/>
		</div>
	{/if}
	{#if conditions !== undefined && conditions.length > 0}
		<div class="flex gap-1 text-xs items-center">
			<SunSnow />
			<span>{conditions.join(", ")}</span>
		</div>
	{/if}
	<button
		class="absolute top-2 right-2"
		on:click={() => handler?.removeCombatant(id)}><X /></button
	>
</div>
