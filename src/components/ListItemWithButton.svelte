<script lang="ts">
	export let type: string
	export let value: string
	export let buttonText: string
	export let onButtonClick: () => void
    export let typeClasses: string | undefined = undefined
</script>

<li class="grid grid-cols-6 list-none h-14 bg-zinc-800 rounded-lg">
    <div class='flex items-center justify-center bg-zinc-900 col-span-1'>
        <p class={`font-bold text-lg ${typeClasses ?? ''}`}>{type}</p>
    </div>
    <div class='flex items-center pl-6 text-lg col-span-4 rounded-r-lg'>
        <p>{value}</p>
    </div>
    <button class='col-span-1 h-full' on:click={onButtonClick}>{buttonText}</button>
</li>
