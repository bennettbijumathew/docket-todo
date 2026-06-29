<script lang="ts">
    import { planners } from "@/lib/planner/store.svelte";
    import { type Planner, type PlannerSort } from "@/lib/planner/type";
    import { Accordion } from "bits-ui";
    import AccordionItem from "@/components/ui/layout/containers/accordion-item.svelte";
    import PlannerItem from "./planner-item.svelte";

    interface PlannerListProps {
        list: Planner[], 
        sortBy: PlannerSort
    }

    let { list, sortBy }: PlannerListProps = $props() 

    interface PlannerGroup {
        title: string, 
        list: Planner[]
    }

    /** This function is called when user wants to toggle the planner view */
    export function toggleSort() {
        switch (sortBy) {
            case "visible":
                planners.sortType = "color"
                break; 

            case "color": 
                planners.sortType = "all"
                break;

            case "all": 
                planners.sortType = "visible"
                break;
        }
    }

    let filteredPlanners: PlannerGroup[] = $derived.by(() => {
        if (sortBy == "visible") {
            return [
                {
                    title: "Visible Planners",
                    list: list.filter(t => t.visible)
                },
                {
                    title: "Hidden Planners",
                    list: list.filter(t => !t.visible)
                }
            ];
        }
        else if (sortBy == "color") {
            return [...Map.groupBy(list, t => t.color)].map(([title, list]) => ({ title, list }))
        }
        else {
            return [{
                title: "All", 
                list: planners.all
            }]
        }
    })

</script>

<!-- This is a list of headers that when opened show a list of planner -->
<Accordion.Root
    type="multiple"
    value={filteredPlanners.map((item) => item.title)}
>
    {#each filteredPlanners as group}
        <AccordionItem 
            title={group.title}
            triggerClasses="
                hover:bg-background-200 cursor-pointer mb-2 rounded-md font-title font-medium
                bg-background-100 w-full px-1 py-1.5 
                lg:w-auto lg:px-2 lg:py-0 lg:bg-transparent 
            "
            contentClasses="flex flex-col gap-4 mb-4"
        >   
            <!-- In each task item, context menus are provided to edit the planner -->
            {#each group.list as planner}
                <PlannerItem planner={planner}/>
            {/each}
        </AccordionItem>
    {/each}
</Accordion.Root>