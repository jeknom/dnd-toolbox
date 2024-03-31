<script lang="ts">
	import { StatBlock } from "@/types";
	import AbilityScores from "./AbilityScores.svelte";
	import Separator from "../Separator.svelte";
	import Title from "./Title.svelte";
	import ActionList from "./ActionList.svelte";
	import Dice from "../Dice/Dice.svelte";

	export let singleColumn = false
	export let block: StatBlock
	$: ({ name, ac, hp, actions, bonusActions, abilites, legendary, speeds, senses, languages } = block)
</script>

<div class="relative flex gap-2 flex-col bg-orange-100 p-2 rounded-md pb-24">
	<div class="grid {singleColumn ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-4">
		<div class="flex flex-col gap-4">
			<Title {block} />
			<Separator />
			<div class="flex flex-col leading-4  gap-1">
				<span class="hb"><span class="hst">Armor Class</span> {ac}</span>
				<span class="hb"><span class="hst">Hit Points</span> {hp}</span>
				<span class="hb">
					<span class="hst">Speed</span>
					{#if speeds?.ground}{speeds.ground} ft.,{/if} {Object.entries(speeds ?? {}).filter(([speed]) => speed !== 'ground').map(([speed, distance]) => distance && `${speed} ${distance} ft.`).filter(Boolean).join(', ')}
				</span>
			</div>
			<Separator />
			<AbilityScores block={block} />
			<Separator />
			<div class="flex flex-col leading-4 gap-1">
				{#if senses}
					<span class="hb">
						<span class="hst">Senses</span>
						{Object.entries(senses ?? {}).map(([sense, distance]) => distance && `${sense} ${distance} ft.`).filter(Boolean).join(', ')}
					</span>
				{/if}
				{#if languages}
					<span class="hb">
						<span class="hst">Languages</span>
						{languages?.join(', ')}
					</span>
				{/if}
			</div>
			<Separator />
			{#if legendary}
				<span class="hb2">
					<span class="hst2">Legendary Resistance (3/Day).</span>
					If the {name} fails a saving throw, it can choose to succeed instead.
				</span>
			{/if}
		</div>
		<div class="flex flex-col gap-4">
			<ActionList title="Actions" actions={actions} />
			<ActionList title="Bonus Actions" actions={bonusActions} />
			<ActionList title="Abilities" actions={abilites} />
			<ActionList title="Legendary Actions" actions={legendary?.actions} />
		</div>
	</div>
	<Dice class="absolute bottom-2 right-2" />
</div>