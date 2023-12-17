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
    
	$: isZeroHp = combatant.hp && parseInt(combatant.hp) <= 0

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
    <button class='flex flex-col items-start p-4 gap-4 rounded-md min-h-[40px] w-full h-full shadow-md' on:click={() => click(combatant.id)}>
		{#if isZeroHp}
			<div class="flex w-full justify-between items-center">
				<span>💀 {combatant.character.id}</span>
				<button on:click={() => combatant.hp = '1'}>Revive</button>
			</div>
		{:else}
			<div class={`${combatant.character.isPlayer ? 'text-green-500' : 'text-yellow-500'}`}>
				<label>
					🧑
					<input class='text-xl' value={combatant.character.id} />
				</label>
			</div>
			<div class="grid grid-cols-2 gap-2">
				<label class="align-top">
					🎲
					<input
						class='w-20'
						id="initiative"
						value={combatant.initiative}
						on:input={(e) => debounceInitiativeChange(combatant.id, e)}
					/>
				</label>
				{#if combatant.character.template !== undefined}	
					<label>
						🧡
						<input class='w-20' bind:value={combatant.hp} />
					</label>
				{/if}
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
