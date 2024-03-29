<script lang="ts">
	import { Encounter, Player, StatBlock } from "@/types";
	import {
		X,
		Dices,
		HeartPulse,
		Clock,
		Swords,
		SunSnow,
		Menu,
	} from "lucide-svelte";
	import encounterStore from "./encounterStore";
	import EncounterStateHandler from "./EncounterStateHandler";
	import { sortAlphabetical } from "@/utils";
	import StatBlockView from "../StatBlock/StatBlock.svelte";
	import { CONDITIONS } from "@/constants";

	export let monsters: StatBlock[];
	export let players: Player[];
	export let handler: EncounterStateHandler;

	let sidebarOpen = true;

	let encounter: Encounter;
	$: ({ combatants, currentCombatantIndex, focusedCombatantIndex } =
		encounter);
	$: currentCombatant =
		typeof currentCombatantIndex === "number"
			? combatants[currentCombatantIndex]
			: null;
	$: focusedCombatant =
		typeof focusedCombatantIndex === "number"
			? combatants[focusedCombatantIndex]
			: null;

	encounterStore.subscribe((e) => (encounter = e));

	let monsterFilter = "";
</script>

<div class="relative grid grid-cols-10 gap-4 pb-24 h-full w-full">
	{#if sidebarOpen}
		<div
			class="absolute z-10 flex flex-col gap-2 left-2 bg-zinc-900 h-full p-4 overflow-y-auto"
		>
			<button
				class="absolute bottom-2 left-2"
				on:click={() => (sidebarOpen = false)}><X /></button
			>
			<span class="ht text-xl">Players</span>
			<div class="flex flex-col gap-1">
				{#each players.sort( (a, b) => sortAlphabetical(a.name, b.name), ) as player (player.id)}
					<button
						on:click={() => handler.addPlayer(encounter, player)}
						>{player.name}</button
					>
				{/each}
			</div>
			<span class="ht text-xl">Monsters</span>
			<input
				type="text"
				bind:value={monsterFilter}
				placeholder="Filter monsters"
			/>
			<div class="flex flex-col gap-1">
				{#each monsters
					.filter((m) => m.name
							.toLowerCase()
							.includes(monsterFilter.toLowerCase()))
					.sort( (a, b) => sortAlphabetical(a.name, b.name), ) as monster (monster.id)}
					<button
						on:click={() => handler.addMonster(encounter, monster)}
						>{monster.name}</button
					>
				{/each}
			</div>
		</div>
	{:else}
		<button
			class="absolute bottom-2 left-2 z-10"
			on:click={() => (sidebarOpen = true)}><Menu /></button
		>
	{/if}
	<div class="flex flex-col gap-2 left-2 col-span-2 overflow-y-auto">
		{#if currentCombatant !== null}
			<div class="flex gap-2">
				<Clock />
				{#if encounter.turns <= combatants.length}
					<span>First round</span>
				{:else}
					<span
						>Round {Math.floor(
							encounter.turns / combatants.length,
						) + 1}</span
					>
				{/if}
				<Swords />
				<span
					>{currentCombatant.player?.name ??
						currentCombatant.statBlock?.name}'s turn</span
				>
			</div>
		{/if}
		{#if combatants.length > 0}
			<div class="flex gap-2">
				<button on:click={() => handler.prevCombatant(encounter)}
					>Prev</button
				>
				<button on:click={() => handler.nextCombatant(encounter)}
					>Next</button
				>
				<button on:click={() => handler.clearEncounter()}>Clear</button>
			</div>
		{/if}
		<div class="flex flex-col gap-1">
			{#each combatants as { id, player, initiative, hp, statBlock, conditions }, i (id)}
				<div
					class="relative flex flex-col gap-2 p-2 cursor-pointer {hp ===
					0
						? 'bg-red-500'
						: i === focusedCombatantIndex
							? 'bg-zinc-500'
							: i === currentCombatantIndex
								? 'bg-zinc-600'
								: 'bg-zinc-700'}"
					role="button"
					tabindex="0"
					on:keyup={(e) =>
						e.key === "Enter" && handler.changeFocus(encounter, id)}
					on:click={() => handler.changeFocus(encounter, id)}
				>
					<span
						class="text-lg {player !== undefined
							? 'text-green-600'
							: 'text-yellow-400'}"
						>{player?.name ?? statBlock?.name}</span
					>
					<div class="flex gap-1 text-xs items-center">
						<Dices />
						<input
							value={initiative}
							on:input={(e) =>
								handler.updateInitiative(
									encounter,
									id,
									e.currentTarget.value,
								)}
						/>
					</div>
					{#if hp !== undefined}
						<div class="flex gap-1 text-xs items-center">
							<HeartPulse />
							<input
								value={hp.toString()}
								on:input={(e) =>
									handler.updateHp(
										encounter,
										id,
										e.currentTarget.value,
									)}
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
						on:click={() => handler.removeCombatant(encounter, id)}
						><X /></button
					>
				</div>
			{/each}
		</div>
	</div>
	{#if focusedCombatant !== null}
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
								focusedCombatant.conditions ?? []
							).includes(condition)}
							on:change={() =>
								handler.toggleCondition(
									encounter,
									focusedCombatant?.id ?? "",
									condition,
								)}
						/>
					</label>
				{/each}
			</div>
			<textarea
				class="p-2 min-h-[120px]"
				value={focusedCombatant?.notes ?? ""}
				on:input={(e) =>
					handler.updateNotes(
						encounter,
						focusedCombatant?.id ?? "",
						e.currentTarget.value,
					)}
				placeholder="This person is located at the far end of the room..."
			/>
			{#if focusedCombatant.statBlock !== undefined}
				<StatBlockView block={focusedCombatant.statBlock} />
			{/if}
		</div>
	{/if}
</div>
