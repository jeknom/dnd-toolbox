<script lang="ts">
	import {
		DndCharacter,
		DndCombatant,
		DndEncounter,
		DndToolboxState,
	} from "src/types";
	import {
		randomRange,
		sortAlphabetical,
		generateRandomEmoji,
	} from "src/utils";
	import { v4 as uuid } from "uuid";
	import Character from "./Character.svelte";
	import CombatantItem from "./CombatantItem.svelte";
	import ListItemWithButton from "./ListItemWithButton.svelte";
	import Die from "./Die.svelte";

	export let state: DndToolboxState;

	const ulClasses = "flex flex-col p-0 gap-2";
	let encounter: DndEncounter = {
		combatants: [],
		hasStarted: false,
	};

	let currentTurnCombatant: DndCombatant | null = null;
	let focusedCombatant: DndCombatant | null = null;

	function sortCombatants(by: "name" | "initiative") {
		if (by === "name") {
			encounter.combatants = encounter.combatants.sort((a, b) =>
				sortAlphabetical(a.character.id, b.character.id),
			);
		} else {
			encounter.combatants = encounter.combatants.sort((a, b) =>
				(a.initiative ?? 0) < (b.initiative ?? 0)
					? 1
					: (a.initiative ?? 0) > (b.initiative ?? 0)
					  ? -1
					  : 0,
			);
		}
	}

	function addCombatant(character: DndCharacter) {
		const newCharacter = structuredClone(character);
		const combatantId: string = uuid();
		const hasDuplicates =
			encounter.combatants.filter((c) => c.character.id === character.id)
				.length > 0;
		if (hasDuplicates) {
			newCharacter.id = `${newCharacter.id} (${generateRandomEmoji(
				combatantId,
			)})`;
		}

		const combatant = {
			id: combatantId,
			initiative: randomRange(1, 20),
			character: newCharacter,
		};
		console.log(combatant);
		encounter.combatants = [...encounter.combatants, combatant];

		sortCombatants("name");
	}

	function removeCombatant(id: string) {
		encounter = {
			...encounter,
			combatants: encounter.combatants.filter((c) => c.id !== id),
		};

		sortCombatants("name");
	}

	function handleSetFocusedCombatant(id?: string) {
		if (focusedCombatant?.id === id) {
			return;
		}

		const matchingCombatant = encounter.combatants.find((c) => c.id === id);

		focusedCombatant =
			matchingCombatant !== undefined ? matchingCombatant : null;
	}

	function startEncounter() {
		encounter.hasStarted = true;
		sortCombatants("initiative");
	}

	function stopEncounter() {
		encounter.hasStarted = false;
		sortCombatants("name");
	}

	function handleInitiativeChange(id: string, newValue: HTMLInputElement) {
		let newNum = 0;
		try {
			newNum = parseInt(newValue.value);
		} catch {
			console.warn("Could not parse new initiative");
		}

		const idx = encounter.combatants.findIndex((c) => c.id === id);
		if (idx != -1) {
			encounter.combatants[idx].initiative = newNum;
		}

		newValue.blur();
		sortCombatants("initiative");
	}

	function nextCombatant() {
		let nextIdx =
			encounter.combatants.findIndex(
				({ id }) => id === currentTurnCombatant?.id,
			) + 1;

		if (nextIdx >= encounter.combatants.length) {
			nextIdx = 0;
		}

		currentTurnCombatant = encounter.combatants[nextIdx];
		handleSetFocusedCombatant(currentTurnCombatant.id);
	}

	function previousCombatant() {
		let nextIdx =
			encounter.combatants.findIndex(
				({ id }) => id === currentTurnCombatant?.id,
			) - 1;

		if (nextIdx < 0) {
			nextIdx = encounter.combatants.length - 1;
		}

		currentTurnCombatant = encounter.combatants[nextIdx];
		handleSetFocusedCombatant(currentTurnCombatant.id);
	}

	const allCharacters = Array.from(state.characters.values());
	const characters = allCharacters
		.filter((c) => !c.isPlayer)
		.sort((a, b) => sortAlphabetical(a.id, b.id));
	const players = allCharacters
		.filter((c) => c.isPlayer)
		.sort((a, b) => sortAlphabetical(a.id, b.id));
	const templateCharacters = Array.from(state.characterTemplates.values())
		.map(
			(t) =>
				({
					id: t.id,
					template: t,
					alignment: "Unknown",
					size: "Unknown",
					race: "Unknown",
				}) as DndCharacter,
		)
		.sort((a, b) => sortAlphabetical(a.id, b.id));

	function addPlayers() {
		for (const player of players) {
			addCombatant(player);
		}
	}
</script>

{#if encounter.hasStarted}
	<div class="grid grid-cols-6 h-[80vh]">
		<div class="flex flex-col gap-2 col-span-2 overflow-y-auto px-2">
			<ul class={ulClasses}>
				{#each encounter.combatants as combatant (combatant.id)}
					<CombatantItem
						{combatant}
						focused={focusedCombatant?.id === combatant.id}
						turn={currentTurnCombatant?.id === combatant.id}
						onInitiativeChange={handleInitiativeChange}
						click={handleSetFocusedCombatant}
					/>
				{/each}
			</ul>
		</div>
		<div class="flex flex-col gap-2 col-span-4 px-2">
			{#if focusedCombatant !== null}
				<Character character={focusedCombatant.character} />
			{:else}
				Start combat!
			{/if}
		</div>
	</div>
	<div class="absolute right-3 bottom-3">
		<button class="px-4" on:click={previousCombatant}> Prev </button>
		<button class="px-4" on:click={nextCombatant}> Next </button>
		<button class="px-4" on:click={stopEncounter}> Stop </button>
	</div>
{:else}
	<div class="grid grid-cols-2 gap-8 h-[80vh]">
		<div class="flex flex-col gap-2 overflow-y-auto px-2">
			<h3>Characters</h3>
			<ul class={ulClasses}>
				{#each characters as character (character.id)}
					<ListItemWithButton
						type="NPC"
						typeClasses='text-yellow-500'
						value={character.id}
						buttonText="Add"
						onButtonClick={() => addCombatant(character)}
					/>
				{/each}
			</ul>
			<h4>Players</h4>
			<button on:click={addPlayers}>Add players</button>
			<ul class={ulClasses}>
				{#each players as character (character.id)}
					<ListItemWithButton
						type="Player"
						typeClasses='text-green-500'
						value={character.id}
						buttonText="Add"
						onButtonClick={() => addCombatant(character)}
					/>
				{/each}
			</ul>
			<h4>Templates</h4>
			<ul class={ulClasses}>
				{#each templateCharacters as template (template.id)}
					<ListItemWithButton
						type="NPC"
						value={template.id}
						typeClasses='text-yellow-500'
						buttonText="Add"
						onButtonClick={() => addCombatant(template)}
					/>
				{/each}
			</ul>
		</div>
		<div class="flex flex-col gap-2 overflow-y-auto px-2">
			<h3>Combatants</h3>
			<ul class={ulClasses}>
				{#each encounter.combatants as combatant (combatant.id)}
					<ListItemWithButton
						type={combatant.character.isPlayer ? 'Player' : 'NPC'}
						typeClasses={combatant.character.isPlayer ? 'text-green-500' : 'text-yellow-500'}
						value={combatant.character.id}
						buttonText='Remove'
						onButtonClick={() => removeCombatant(combatant.id)}
					/>
				{/each}
			</ul>
		</div>
	</div>
	<div class="absolute right-3 bottom-3">
		<button
			class='px-4'
			disabled={encounter.combatants.length === 0}
			on:click={startEncounter}
		>
			Start
		</button>
	</div>
{/if}

<div class="absolute left-3 bottom-3">
	<Die dice={{ die: 4, multiplier: 1 }} />
	<Die dice={{ die: 6, multiplier: 1 }} />
	<Die dice={{ die: 8, multiplier: 1 }} />
	<Die dice={{ die: 10, multiplier: 1 }} />
	<Die dice={{ die: 12, multiplier: 1 }} />
	<Die dice={{ die: 20, multiplier: 1 }} />
</div>

<style>
	.actions {
		position: absolute;
		right: 20px;
		bottom: 20px;
	}
</style>
