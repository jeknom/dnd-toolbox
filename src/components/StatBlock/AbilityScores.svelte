<script lang="ts">
	import { StatBlock } from "@/types";
	import AbilityScore from "./AbilityScore.svelte";

	export let block: StatBlock;
	$: ({ str, dex, con, int, wis, cha } = block.abilityScores)
</script>

<div class="flex flex-row gap-4">
    <AbilityScore ability="STR" score={str} />
    <AbilityScore ability="DEX" score={dex} />
    <AbilityScore ability="CON" score={con} />
    <AbilityScore ability="INT" score={int} />
    <AbilityScore ability="WIS" score={wis} />
    <AbilityScore ability="CHA" score={cha} />
</div>