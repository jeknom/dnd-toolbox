<script lang="ts">
	import { DndCombatant } from "src/types";

	export let combatant: DndCombatant;
	export let focused: boolean;
	export let turn: boolean;
    export let click: (id: string) => void
	export let onInitiativeChange: (
		id: string,
		newValue: HTMLInputElement,
	) => void;
    
	let debounceTimer: number;

	const debounceInitiativeChange = (
		id: string,
		event: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		},
	) => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(
			() => onInitiativeChange(id, event.target as HTMLInputElement),
			750,
		) as unknown as number;
	};
</script>

<li class={`rounded-md shadow-md ${focused ? 'shadow-yellow-200' : turn ? 'shadow-yellow-600' : ''}`}>
    <button class='flex flex-col items-start px-4 py-8 gap-4 rounded-md min-h-[40px] w-full h-full shadow-md' on:click={() => click(combatant.id)}>
        <div class={`${combatant.character.isPlayer ? 'text-green-500' : 'text-yellow-500'}`}>
            <label for="name">🧑</label>
            <input class="w-full text-lg bg-transparent border-b hover:border-b-2 border-b-white" id="name" value={combatant.character.id} />
        </div>
        <div>
            <label for="initiative">🎲</label>
            <input
                id="initiative"
				class="w-full text-md bg-transparent border-b hover:border-b-2 border-b-white"
                value={combatant.initiative}
                on:input={(e) => debounceInitiativeChange(combatant.id, e)}
            />
        </div>
        {#if combatant.character.template !== undefined}
            <div>
                <label for="hp">🧡</label>
                <input id="hp" class="w-full text-md bg-transparent border-b hover:border-b-2 border-b-white" value={combatant.character.template.stats.hp} />
            </div>
        {/if}
    </button>
</li>

<style>
    .combatant-name {
        color: var(--name-color)
    }

	.picker-item {
		display: flex;
        flex-direction: column;
		padding: 24px 16px 24px 16px;
        gap: 6px;
		border-radius: 8px;
		min-height: 40px;
        width: 100%;
        height: 100%
	}

	.combatant-tracker {
		display: flex;
		width: 100%;
		gap: 8px;
	}
</style>
