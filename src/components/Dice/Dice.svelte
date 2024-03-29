<script lang="ts">
	import { randomRange } from "@/utils";
    import { Dices, Dice6, X, RefreshCcw } from 'lucide-svelte'

    $: dice = {
        d4: 0,
        d6: 0,
        d8: 0,
        d10: 0,
        d12: 0,
        d20: 0,
        d100: 0
    }

    $: state = 'idle' as 'idle' | 'rolling' | 'rolled'
    $: lastTotal = 0

    const handleRoll = () => {
        state = 'rolling'
        lastTotal = 0
        
        for (const [die, count] of Object.entries(dice)) {
            for (let i = 0; i < count; i++) {
                lastTotal += randomRange(1, parseInt(die.slice(1)))
            }
        }

        setTimeout(() => {
            state = 'rolled'
        }, 1000)
    }

    const handleClear = () => dice = {d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0, d100: 0}

    const setIdle = () => {
        handleClear()
        state = 'idle'
    }
</script>

<div class="flex flex-col gap-2 {$$restProps.class || ""}">
    {#if state === 'idle' && Object.values(dice).reduce((acc, val) => acc + val, 0) > 0}
        <div class="flex justify-end gap-1">
            <button on:click={handleRoll}><Dices /> Roll</button>
            <button on:click={handleClear}><X /> Clear</button>
        </div>
    {/if}
    <div class="flex justify-end gap-1">
        {#if state === 'idle'}
            <button on:click={() => dice.d4++}>d4 {#if dice.d4 !== 0}({dice.d4.toString()}){/if}</button>
            <button on:click={() => dice.d6++}>d6 {#if dice.d6 !== 0}({dice.d6.toString()}){/if}</button>
            <button on:click={() => dice.d8++}>d8 {#if dice.d8 !== 0}({dice.d8.toString()}){/if}</button>
            <button on:click={() => dice.d10++}>d10 {#if dice.d10 !== 0}({dice.d10.toString()}){/if}</button>
            <button on:click={() => dice.d12++}>d12 {#if dice.d12 !== 0}({dice.d12.toString()}){/if}</button>
            <button on:click={() => dice.d20++}>d20 {#if dice.d20 !== 0}({dice.d20.toString()}){/if}</button>
            <button on:click={() => dice.d100++}>d100 {#if dice.d100 !== 0}({dice.d100.toString()}){/if}</button>
        {:else if state === 'rolling'}
            <span><Dice6 class="animate-spin" color="#000000" /></span>
        {:else if state === 'rolled'}
            <button on:click={setIdle}><RefreshCcw /> Rolled {lastTotal}</button>
        {/if}
    </div>
</div>