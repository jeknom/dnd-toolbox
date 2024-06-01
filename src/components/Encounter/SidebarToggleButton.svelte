<script lang="ts">
	import { ChevronLeft, ChevronRight } from "lucide-svelte";

	export let sidebarOpen = true;
	export let onClick: () => void;
</script>

<div
    class={`bg-zinc-900 hover:bg-zinc-800 p-2 rounded-l-md border-y border-l border-zinc-700`}
	role="button"
	tabindex="0"
	on:click={onClick}
	on:keydown={(e) => {
		if (e.key === "Enter") {
			onClick();
		}
	}}
>
    {#if sidebarOpen}
     <ChevronRight />
    {:else}
        <ChevronLeft />
    {/if}
</div>
