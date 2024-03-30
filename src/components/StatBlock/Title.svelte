<script lang="ts">
	import { StatBlock } from "@/types";

	export let block: StatBlock;
	$: ({ name, size, type, alignment } = block)
</script>

<div class="flex flex-col">
    <span class="ht text-3xl">{name}</span>
    <span class="hb2 italic">{size} {type}, {alignment}</span>
</div>