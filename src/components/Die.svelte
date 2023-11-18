<script lang="ts">
	import { DndDiceData } from "src/types";
	import { parseDiceDataFromString, randomRange } from "../utils";

    export let dice: DndDiceData
    const { die, multiplier, modifier } = dice

    let lastRoll: number | null = null

    let diceString = `🎲 ${multiplier}d${die}`
    if (modifier !== undefined) {
        diceString = `${diceString} + ${modifier}`
    }

    function roll() {
        let total = 0;
        for (let i = 0; i < multiplier ?? 0; i++) {
            total += randomRange(1, die);
        }

        if (modifier !== undefined) {
            total += modifier
        }

        lastRoll = total
    }
</script>

<button class="die-button" on:click={roll}>
    {diceString}
    {#if lastRoll !== null}
        = {lastRoll}
    {/if}
</button>

<style>
    .die-button {
        cursor: pointer;
    }
</style>