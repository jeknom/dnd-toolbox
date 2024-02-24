<script lang="ts">
	import { DndCharacter } from "src/types";
	import Stat from "./Stat.svelte";
	import DndAction from "./DndAction.svelte";

	export let character: DndCharacter

    $: ({ id, size, race, template, alignment, uniqueActions  } = character)
</script>

<div class="character relative text-black grid grid-cols-2 gap-2 shadow-md border border-yellow-500 p-4 m-4 text-md">
    <div class="col-span-2">
        <div class="font-bold text-red-800 text-[1.5rem] m-0">{id}</div>
        <div class="text-black mb-2">{#if size !== undefined}{size}{/if}{#if race !== undefined}{' '}{race}{/if}{#if alignment !== undefined}, {alignment}{/if}</div>
        <img class="mon-stat-block__separator-img" alt="" src="https://www.dndbeyond.com/file-attachments/0/579/stat-block-header-bar.svg">
    </div>
    {#if template !== undefined}
        <div class="flex flex-col gap-4">
            <div class="leading-4">
                <p><span class="text-red-800 font-bold">Armor Class</span> {template.stats.ac}</p>
                <p><span class="text-red-800 font-bold">Hit Points</span> {template.stats.hp}</p>
                <p><span class="text-red-800 font-bold">Speed</span> {template.stats.speedFt} ft.</p>
                <img class="mon-stat-block__separator-img" alt="" src="https://www.dndbeyond.com/file-attachments/0/579/stat-block-header-bar.svg">
            </div>
            <div class="flex flex-row gap-4">
                <Stat stat='str' value={template.modifiers.str} />
                <Stat stat='dex' value={template.modifiers.dex} />
                <Stat stat='con' value={template.modifiers.con} />
                <Stat stat='int' value={template.modifiers.int} />
                <Stat stat='wis' value={template.modifiers.wis} />
                <Stat stat='cha' value={template.modifiers.cha} />
            </div>
        </div>
        <div class="flex flex-col gap-4">
            {#each uniqueActions ?? [] as action}
                <DndAction action={action} />
            {/each}
            {#each template.uniqueActions ?? [] as action}
                <DndAction action={action} />
            {/each}
            {#each template.actions as action}
                <DndAction action={action} />
            {/each}
        </div>
    {/if}
</div>

<style>
    .character {
        background: url("https://www.dndbeyond.com/content/1-0-2598-0/skins/waterdeep/images/mon-summary/stat-block-top-texture.png"),url("https://www.dndbeyond.com/content/1-0-2598-0/skins/waterdeep/images/mon-summary/paper-texture.png");
        background-size: 100% auto;
        background-position: top center;
        background-repeat: no-repeat,repeat;
        font-family: "Scala Sans Offc",Roboto,Helvetica,sans-serif;
    }
</style>