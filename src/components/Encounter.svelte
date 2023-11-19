<script lang="ts">
	import { DndCharacter, DndCombatant, DndEncounter, DndToolboxState } from "src/types";
	import {
		randomRange,
		sortAlphabetical,
		generateRandomEmoji,
	} from "src/utils";
	import { v4 as uuid } from "uuid";
	import Character from "./Character.svelte";

	export let state: DndToolboxState;

	let encounter: DndEncounter = {
		combatants: [],
		hasStarted: false,
	};

	let debounceTimer: number;

	function sortCombatants(by: "name" | "initiative") {
		if (by === "name") {
			encounter.combatants = encounter.combatants.sort((a, b) =>
				sortAlphabetical(a.character.id, b.character.id)
			);
		} else {
			encounter.combatants = encounter.combatants.sort((a, b) =>
				(a.initiative ?? 0) < (b.initiative ?? 0)
					? 1
					: (a.initiative ?? 0) > (b.initiative ?? 0)
					? -1
					: 0
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
				combatantId
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

	function startEncounter() {
		encounter.hasStarted = true;
		sortCombatants("initiative");
	}

	function stopEncounter() {
		encounter.hasStarted = false;
		sortCombatants("name");
	}

    let currentTurnCombatant: DndCombatant | null = null;

	const debounceInitiativeChange = (
		id: string,
		event: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(
			() => handleInitiativeChange(id, event.target as HTMLInputElement),
			750
		) as unknown as number;
	};

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
				({ id }) => id === currentTurnCombatant?.id
			) + 1;

		if (nextIdx >= encounter.combatants.length) {
			nextIdx = 0;
		}

		currentTurnCombatant = encounter.combatants[nextIdx];
	}

	function previousCombatant() {
		let nextIdx =
			encounter.combatants.findIndex(
				({ id }) => id === currentTurnCombatant?.id
			) - 1;

		if (nextIdx < 0) {
			nextIdx = encounter.combatants.length - 1;
		}

		currentTurnCombatant = encounter.combatants[nextIdx];
	}

	const allCharacters = Array.from(state.characters.values());
	const characters = allCharacters
		.filter((c) => !c.isPlayer)
		.sort((a, b) => sortAlphabetical(a.id, b.id));
	const players = allCharacters
		.filter((c) => c.isPlayer)
		.sort((a, b) => sortAlphabetical(a.id, b.id));
	const templateCharacters = Array.from(state.characterTemplates.values()).map(t => ({
		id: t.id,
		template: t,
		alignment: 'Unknown',
		size: 'Unknown',
		race: 'Unknown'
	} as DndCharacter)).sort((a, b) => sortAlphabetical(a.id, b.id))

	function addPlayers() {
		for (const player of players) {
			addCombatant(player);
		}
	}
</script>

{#if encounter.hasStarted}
	<div class="grid">
		<div class="grid-section grid-left">
			<ul>
				{#each encounter.combatants as combatant (combatant.id)}
					<li
						class={`picker-item ${
							combatant.id === currentTurnCombatant?.id
								? "active-picker-item"
								: ""
						}`}
					>
						<span class="combatant-item-grid">
							<label for="name">🧑</label>
							<input id="name" value={combatant.character.id} />
							<label for="name">🎲</label>
							<input
								id="name"
								value={combatant.initiative}
								on:input={(e) =>
									debounceInitiativeChange(combatant.id, e)}
							/>
							{#if combatant.character.template !== undefined}
								<label for="hp">❤️</label>
								<input
									id="hp"
									value={combatant.character.template.stats
										.hp}
								/>
							{/if}
						</span>
					</li>
				{/each}
			</ul>
		</div>
		<div class="grid-section grid-right">
            {#if currentTurnCombatant !== null}
                <Character character={currentTurnCombatant.character} />
            {:else}
                Start combat!
            {/if}
        </div>
	</div>
	<div class="actions">
		<button on:click={previousCombatant}> Prev </button>
		<button on:click={nextCombatant}> Next </button>
		<button on:click={stopEncounter}> Stop </button>
	</div>
{:else}
	<div class="grid">
		<div class="grid-section grid-left">
			<h3>Characters</h3>
			<ul>
				{#each characters as character (character.id)}
					<li class="picker-item">
						<p>{character.id}</p>
						<button on:click={() => addCombatant(character)}
							>Add</button
						>
					</li>
				{/each}
			</ul>
			<h3>Players</h3>
			<button on:click={addPlayers}>Add players</button>
			<ul>
				{#each players as character (character.id)}
					<li class="picker-item">
						<p>{character.id}</p>
						<button on:click={() => addCombatant(character)}
							>Add</button
						>
					</li>
				{/each}
			</ul>
			<h3>Templates</h3>
			<ul>
				{#each templateCharacters as template (template.id)}
					<li class="picker-item">
						<p>{template.id}</p>
						<button on:click={() => addCombatant(template)}
							>Add</button
						>
					</li>
				{/each}
			</ul>
		</div>
		<div class="grid-section grid-right">
			<h3>Combatants</h3>
			<ul>
				{#each encounter.combatants as combatant (combatant.id)}
					<li class="picker-item">
						<p>
							{combatant.character.id}
							<span
								class={combatant.character.isPlayer
									? "player-indicator"
									: "npc-indicator"}
								>{combatant.character.isPlayer
									? "(Player)"
									: "(NPC)"}</span
							>
						</p>
						<button on:click={() => removeCombatant(combatant.id)}
							>Remove</button
						>
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<div class="actions">
		<button
			disabled={encounter.combatants.length === 0}
			on:click={startEncounter}
		>
			Start
		</button>
	</div>
{/if}

<style>
	ul {
		display: flex;
		flex-direction: column;
		padding: 0px;
		gap: 6px;
	}

	.player-indicator {
		color: green;
	}

	.npc-indicator {
		color: yellow;
	}

	.grid {
		display: grid;
		gap: 16px;
		grid-template-columns: 25% 75%;
		grid-template-rows: auto;
		grid-template-areas:
			"header-left header-right"
			"grid-left grid-right";
	}

	.grid-section {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.grid-right {
		grid-area: grid-right;
	}

	.grid-left {
		grid-area: grid-left;
	}

	.picker-item {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		background-color: rgb(89, 89, 89);
		padding: 6px 12px 6px 12px;
		border-radius: 8px;
		min-height: 40px;
	}

	.combatant-item-grid {
		display: grid;
		gap: 16px;
		grid-template-columns: 15% 85%;
		grid-template-rows: auto;
	}

	.active-picker-item {
		border: 1px yellow solid;
	}

	.actions {
		position: absolute;
		right: 20px;
		bottom: 20px;
	}
</style>
