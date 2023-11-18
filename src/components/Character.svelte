<script lang="ts">
	import { DndCharacter } from "src/types";
	import Stat from "./Stat.svelte";
	import DndAction from "./DndAction.svelte";

	export let character: DndCharacter
    const { id, template } = character
    console.log(template)
</script>

<div class="character grid">
    <div class="header">
        <h2 class="highlight">{id}</h2>
        <img class="mon-stat-block__separator-img" alt="" src="https://www.dndbeyond.com/file-attachments/0/579/stat-block-header-bar.svg">
    </div>
    {#if template !== undefined}
        <div class="grid-left grid-section">
            <div class="stats">
                <p><span class="highlight">Armor Class</span> {template.stats.ac}</p>
                <p><span class="highlight">Hit Points</span> {template.stats.hp}</p>
                <p><span class="highlight">Speed</span> {template.stats.speedFt} ft.</p>
                <img class="mon-stat-block__separator-img" alt="" src="https://www.dndbeyond.com/file-attachments/0/579/stat-block-header-bar.svg">
            </div>
            <div class="modifiers">
                <Stat stat='str' value={template.modifiers.str} />
                <Stat stat='dex' value={template.modifiers.dex} />
                <Stat stat='con' value={template.modifiers.con} />
                <Stat stat='int' value={template.modifiers.int} />
                <Stat stat='wis' value={template.modifiers.wis} />
                <Stat stat='cha' value={template.modifiers.cha} />
            </div>
        </div>
        <div class="grid-right grid-section">
            {#each template.actions as action}
                <DndAction action={action} />
            {/each}
        </div>
    {/if}
</div>

<style>
    .character {
        color: black;
        background: url("https://www.dndbeyond.com/content/1-0-2598-0/skins/waterdeep/images/mon-summary/stat-block-top-texture.png"),url("https://www.dndbeyond.com/content/1-0-2598-0/skins/waterdeep/images/mon-summary/paper-texture.png");
        background-size: 100% auto;
        background-position: top center;
        background-repeat: no-repeat,repeat;
        position: relative;
        box-shadow: 0 0 5px #979AA4;
        border: 1px solid #d4d0ce;
        padding: 15px;
        margin: 15px 0;
        font-family: "Scala Sans Offc",Roboto,Helvetica,sans-serif;
        font-size: 15px;
    }

    .header {
        grid-area: header;
    }

    .highlight {
        color: darkred;
        font-weight: bold;
    }

    .stats {
        line-height: 4px;
    }

    .modifiers {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .grid {
        display: grid;
        gap: 8px;
        grid-template-columns: 50% 50%;
        grid-template-rows: auto;
        grid-template-areas:
            "header header"
            "grid-left grid-right";
    }
    
    .grid-section {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .grid-left {
        grid-area: grid-left;
    }

    .grid-right {
        grid-area: grid-right;
    }
</style>