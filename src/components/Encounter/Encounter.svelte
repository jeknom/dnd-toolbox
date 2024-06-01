<script lang="ts">
	import encounterStore, { EncounterStore } from "./encounterStore";
	import Sidebar from "./Sidebar.svelte";
	import Status from "./Status.svelte";
	import encounterHandlerStore, {
		EncounterHandlerStore,
	} from "./encounterHandlerStore";
	import Navigation from "./Navigation.svelte";
	import Combatant from "./Combatant.svelte";
	import FocusView from "./FocusView.svelte";

	let eStore: EncounterStore;
	encounterStore.subscribe((e) => (eStore = e));

	$: ({ encounter: { combatants }} = eStore);

	let handler: EncounterHandlerStore;
	encounterHandlerStore.subscribe((h) => (handler = h));
</script>

<div class="flex flex-row gap-4 pb-24 h-full w-full">
	<div class="relative min-w-[300px] overflow-y-auto col-span-2">
		<div class="sticky flex flex-col gap-2 top-0 left-0 z-10 bg-stone-900 rounded-b-md shadow-md p-2">
			<Status />
			<Navigation />
		</div>
		<div class="flex flex-col gap-1 mt-8">
			{#each combatants as combatant (combatant.id)}
				<Combatant combatant={combatant} />
			{/each}
		</div>
	</div>
	<FocusView />
	<Sidebar />
</div>
