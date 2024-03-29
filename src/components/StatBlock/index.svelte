<script lang="ts">
	import { StatBlock } from "@/types";
	import AbilityScores from "./AbilityScores.svelte";
	import Separator from "../Separator.svelte";
	import Title from "./Title.svelte";
	import ActionList from "./ActionList.svelte";

	export let block: StatBlock;
	const { ac, hp } = block;
</script>

<div class="flex gap-2 flex-col bg-orange-100 p-2 rounded-md">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="flex flex-col gap-4">
			<Title {block} />
			<Separator />
			<div class="flex flex-col leading-4  gap-1">
				<span class="hb"><span class="hst">Armor Class</span> {ac}</span>
				<span class="hb"><span class="hst">Hit Points</span> {hp}</span>
				<span class="hb">
					<span class="hst">Speed</span>
					{#if block.speeds?.ground}{block.speeds.ground} ft.,{/if} {Object.entries(block.speeds ?? {}).filter(([speed]) => speed !== 'ground').map(([speed, distance]) => distance && `${speed} ${distance} ft.`).filter(Boolean).join(', ')}
				</span>
			</div>
			<Separator />
			<AbilityScores block={block} />
			<Separator />
			<div class="flex flex-col leading-4 gap-1">
				{#if block.senses}
					<span class="hb">
						<span class="hst">Senses</span>
						{Object.entries(block.senses ?? {}).map(([sense, distance]) => distance && `${sense} ${distance} ft.`).filter(Boolean).join(', ')}
					</span>
				{/if}
				{#if block.languages}
					<span class="hb">
						<span class="hst">Languages</span>
						{block.languages?.join(', ')}
					</span>
				{/if}
			</div>
			<Separator />
			{#if block.legendary}
				<span class="hb2">
					<span class="hst2">Legendary Resistance (3/Day).</span>
					If the {block.name} fails a saving throw, it can choose to succeed instead.
				</span>
			{/if}
		</div>
		<div class="flex flex-col gap-4">
			<ActionList title="Actions" actions={block.actions} />
			<ActionList title="Bonus Actions" actions={block.bonusActions} />
			<ActionList title="Abilities" actions={block.abilites} />
			<ActionList title="Legendary Actions" actions={block.legendary?.actions} />
		</div>
	</div>
</div>