<script>
    import { plannerState } from "@/stores/planner/index.svelte";
</script>

<main class="flex-1 p-4">
    <p>planner</p>

    {#each plannerState.planners as planner}
        {planner.name}
    {/each}
</main>
