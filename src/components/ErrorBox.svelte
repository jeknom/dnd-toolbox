<script lang="ts">
	import { ZodError, ZodIssue } from "zod";

	export let error: ZodError

    const getErrorMessage = (issue: ZodIssue) => {
        const issuePathString = issue.path.join('.')
        let message = `${issue.code} at ${issuePathString}`

        if (issue.code === 'invalid_type') {
            message = `Unexpected type at '${issuePathString}', got ${issue.received} while expected ${issue.expected}`
        }

        return message
    }
</script>

<div class="error">
    {#each error.errors as issue}
	    <p>{getErrorMessage(issue)}</p>
    {/each}
</div>

<style>
	.error {
        border: 1px rgb(92, 92, 92) solid;
        border-radius: 4px;
        background-color: rgb(144, 30, 30);
        color: white;
        padding-right: 4px;
        padding-left: 4px;
    }
</style>
