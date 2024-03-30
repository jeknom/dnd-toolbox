<script lang="ts">
	import { ArrowBigLeft, ArrowBigRight } from "lucide-svelte";
	import encounterStore, { EncounterStore } from "./encounterStore";
	import encounterHandlerStore, { EncounterHandlerStore } from "./encounterHandlerStore";

	let eStore: EncounterStore;
	encounterStore.subscribe((e) => (eStore = e));

    let handler: EncounterHandlerStore;
	encounterHandlerStore.subscribe((h) => (handler = h));

	$: ({ encounter: { turns, combatants }} = eStore);

    $: navigationDisabled = combatants.length === 0
</script>

<div class="flex items-center justify-center gap-2">
    {#if turns > 0}
        <button disabled={navigationDisabled} on:click={() => handler?.prevCombatant()}>
            <ArrowBigLeft />
        </button>
        <button disabled={navigationDisabled} on:click={() => handler?.nextCombatant()}>
            <ArrowBigRight />
        </button>
        <button disabled={navigationDisabled}  on:click={() => handler?.clearEncounter()}>Finish</button>
    {:else}
        <button disabled={navigationDisabled}  on:click={() => handler?.nextCombatant()}>Start</button>
    {/if}
</div>
