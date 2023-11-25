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

<div class="border rounded-md bg-red-800 text-white px-2">
    {#each error.errors as issue}
	    <p>{getErrorMessage(issue)}</p>
    {/each}
</div>
