<script lang="ts">
	import encounterStore, { EncounterStore } from "./encounterStore";
	import encounterHandlerStore, { EncounterHandlerStore } from "./encounterHandlerStore";
	import { Info } from "lucide-svelte";
    import StatBlockView from "../StatBlock/StatBlock.svelte";
	import { CONDITIONS } from "@/constants";
    
    let eStore: EncounterStore;
	encounterStore.subscribe((e) => (eStore = e));

	$: ({ focusedCombatant } = eStore);

	let handler: EncounterHandlerStore;
	encounterHandlerStore.subscribe((h) => (handler = h));
</script>

{#if focusedCombatant}
    <div class="flex flex-col gap-2 left-2 col-span-8 overflow-y-auto">
        <div
            class="grid gap-2 col-start-auto grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 text-xs"
        >
            {#each CONDITIONS as condition}
                <label>
                    {condition}
                    <input
                        type="checkbox"
                        checked={(
                            focusedCombatant?.conditions ?? []
                        ).includes(condition)}
                        on:change={() =>
                            handler?.toggleCondition(
                                focusedCombatant?.id ?? "",
                                condition,
                            )}
                    />
                </label>
            {/each}
        </div>
        <input
            type="text"
            class="p-2"
            value={focusedCombatant?.notes ?? ""}
            on:input={({ currentTarget: { value } }) =>
                handler?.updateNotes(focusedCombatant?.id ?? "", value)}
            placeholder="Write notes here..."
        />
        {#if focusedCombatant.statBlock !== undefined}
            <StatBlockView block={focusedCombatant.statBlock} />
        {/if}
    </div>
{:else}
    <div class="flex flex-col gap-2 left-2 col-span-8 overflow-y-auto">
        <Info />
        <span>Select a combatant to focus</span>
    </div>
{/if}
