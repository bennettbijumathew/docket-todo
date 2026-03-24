<script lang="ts">
    import { routes } from "@/components/util/routes";
    import { authStore } from "@/lib/auth/store.svelte";
    import { ArrowRight } from "@lucide/svelte";
</script>

<main class="flex flex-col justify-center items-center flex-1 bg-linear-to-r from-purple-100 to-blue-200 px-6 gap-y-6">
    <div class="text-center">
        <h2 class="text-2xl font-title font-bold"> Welcome to Docket! </h2>
        <p> This is a task management application </p>
    </div>

    {#if authStore.getUser() === null}
        <a
            href={routes.get("Log In")?.link} 
            aria-label="This is a link to go to the log in page"
            class="min-w-26 flex justify-between items-center gap-x-2 p-2 px-4 bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer"
        >
            Log In
            <ArrowRight class="size-4"/>
        </a>
    {:else}
        <a
            href={routes.get("Task")?.link} 
            aria-label="This is a link to go to the task page"
            class="min-w-26 flex justify-between items-center gap-x-2 p-2 px-4 bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer"
        >
            Log In
            <ArrowRight class="size-4"/>
        </a>
    {/if}
</main>
