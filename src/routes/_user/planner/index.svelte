<script>
    import { plannerState } from "@/stores/planner/index.svelte";
</script>

<main>
    <p>planner</p>
    
    {#each plannerState.planners as planner}
        {planner.name}
    {/each}
</main>