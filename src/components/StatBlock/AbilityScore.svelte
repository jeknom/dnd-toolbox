<script lang="ts">
    export let ability: string
    export let score: number
    let modifier = Math.floor((score - 10) / 2)
    let modifierText = `(${modifier >= 0 ? `+${modifier}` : modifier})`
</script>

<span class="flex flex-col items-center justfy-center p-2">
    <span class="hst">{ability}</span>
    <span class="hb">{score}</span>
    <span class="hb">{modifierText}</span>
</span>