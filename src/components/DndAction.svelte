<script lang="ts">
	import { DndActionRaw } from "src/types";
	import Die from "./Die.svelte";
	import { parseDiceDataFromString } from "src/utils";

	export let action: DndActionRaw;
	const detectedDice = parseDiceDataFromString(action.description)
</script>

<div class="action">
	<p><span class="actionName">{action.id}.</span> {action.description}</p>
	{#if detectedDice.length > 0}
		<div class="detected-dice">
			{#each detectedDice as dice}
				<Die dice={dice} />
			{/each}
		</div>
	{/if}
</div>

<style>
	p {
		margin: 0px;
	}

	.action {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.actionName {
		font-weight: bold;
	}
	.detected-dice {
		display: flex;
		flex-direction: row;
		gap: 4px;
	}
</style>
