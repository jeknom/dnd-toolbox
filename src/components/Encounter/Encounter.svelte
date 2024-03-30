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

<div class="relative grid grid-cols-10 gap-4 pb-24 h-full w-full">
	<Sidebar />
	<div class="flex flex-col gap-2 left-2 col-span-2 overflow-y-auto">
		<Status />
		<Navigation />
		<div class="flex flex-col gap-1">
			{#each combatants as combatant (combatant.id)}
				<Combatant combatant={combatant} />
			{/each}
		</div>
	</div>
	<FocusView />
</div>
