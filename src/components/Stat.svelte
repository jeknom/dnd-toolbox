<script lang="ts">
	import { Stat } from "src/types";

    export let stat: Stat
    export let value: number

    let statPrefix = stat.toUpperCase()
    let valuePrefix = ''

    if (stat !== 'hp' && stat !== 'ac') {
        valuePrefix = value >= 0 ? '+' : ''
    }
</script>

<div class="stat">
    <span class="highlight">{statPrefix}</span>
    <span>{valuePrefix}{value}</span>
</div>

<style>
    .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-items: center;
    }

    .highlight {
        color: darkred;
        font-weight: bold;
    }
</style>