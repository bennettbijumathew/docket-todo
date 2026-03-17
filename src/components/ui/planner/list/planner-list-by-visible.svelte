<script lang="ts">
    import PlannerGroup from "./parts/planner-group.svelte";
    import { type Planner } from "@/lib/planner/type";
    import PlannerItem from "./parts/planner-item.svelte";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { authStore } from "@/lib/auth/store.svelte";

    // The list receives an optional planner select function. If it exists, the function is passed to the PlannerItem, 
    // so that on clicking the planner leads to an action being done. 
    interface ListProps {
        onPlannerSelect?: (planner: Planner) => void
    }
    
    let { onPlannerSelect }: ListProps = $props()

    // Gets a filtered version of the planner list that is used for the groups.
    const visiblePlanners: Planner[] = $derived(plannerStore.getList().filter((item) => item.users[authStore.getUserId()] === true))
    const hiddenPlanners: Planner[] = $derived(plannerStore.getList().filter((item) => item.users[authStore.getUserId()] === false))
</script>

<PlannerGroup header="Visible Planners">
    {#each visiblePlanners as planner (planner.id)}
        <PlannerItem 
            planner={planner} 
            onPlannerSelect={onPlannerSelect}
        />
    {/each}
</PlannerGroup>

<PlannerGroup header="Hidden Planners">
    {#each hiddenPlanners as planner (planner.id)}
        <PlannerItem 
            planner={planner}
            onPlannerSelect={onPlannerSelect}
        />
    {/each}
</PlannerGroup>