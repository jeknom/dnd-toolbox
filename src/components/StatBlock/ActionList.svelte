<script lang="ts">
	import { Action } from "@/types";
	export let title: string;
	export let actions: Action[] | undefined;
</script>

{#if actions?.length ?? 0 > 0}
	<div class="flex flex-col gap-2">
		<span class="ht text-2xl border-b border-rose-900">{title}</span>
		{#each actions ?? [] as action}
			<div class="flex flex-col gap-2">
				<span class="hb2"
					><span class="hst2">{action.name}.</span>
					{action.description}</span
				>
			</div>
		{/each}
	</div>
{/if}
