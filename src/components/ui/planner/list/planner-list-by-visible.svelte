<script lang="ts">
    import PlannerGroup from "./parts/planner-group.svelte";
    import { type Planner } from "@/lib/planner/type";
    import PlannerItem from "./parts/planner-item.svelte";
    import { planners } from "@/lib/planner/store.svelte";

    // The list receives an optional planner select function. If it exists, the function is passed to the PlannerItem, 
    // so that on clicking the planner leads to an action being done. 
    interface ListProps {
        onPlannerSelect?: (planner: Planner) => void
    }
    
    let { onPlannerSelect }: ListProps = $props()
</script>

<PlannerGroup header="Visible Planners">
    {#each planners.visible as planner (planner.id)}
        <PlannerItem 
            planner={planner} 
            onPlannerSelect={onPlannerSelect}
        />
    {/each}
</PlannerGroup>

<PlannerGroup header="Hidden Planners">
    {#each planners.hidden as planner (planner.id)}
        <PlannerItem 
            planner={planner}
            onPlannerSelect={onPlannerSelect}
        />
    {/each}
</PlannerGroup>