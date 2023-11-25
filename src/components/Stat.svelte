<script lang="ts">
	import { DndStat } from "src/types";

    export let stat: DndStat
    export let value: number

    let statPrefix = stat.toUpperCase()
    let valuePrefix = ''

    if (stat !== 'hp' && stat !== 'ac') {
        valuePrefix = value >= 0 ? '+' : ''
    }
</script>

<div class="flex flex-col items-center justify-center">
    <span class="text-red-800 font-bold">{statPrefix}</span>
    <span>{valuePrefix}{value}</span>
</div>