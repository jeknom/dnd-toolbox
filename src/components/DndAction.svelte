<script lang="ts">
	import { DndActionRaw } from "src/types";
	import Die from "./Die.svelte";
	import { parseDiceDataFromString } from "src/utils";

	export let action: DndActionRaw;
	const detectedDice = parseDiceDataFromString(action.description)
</script>

<div class="flex flex-col gap-1">
	<div><span class='font-bold'>{action.id}.</span> {action.description}</div>
	{#if detectedDice.length > 0}
		<div class="flex flex-row gap-1">
			{#each detectedDice as dice}
				<Die dice={dice} />
			{/each}
		</div>
	{/if}
</div>