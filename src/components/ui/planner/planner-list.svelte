<script lang="ts">
    import AccordionItem from "@/components/ui/layout/containers/accordion-item.svelte";
    import PlannerItem from "@/components/ui/planner/planner-item.svelte";
    import { planners } from "@/lib/planner/store.svelte";
    import { type Planner } from "@/lib/planner/type";
    import { Accordion } from "bits-ui";

    interface PlannerListProps {
        list: Planner[], 
    }

    interface PlannerGroup {
        title: string, 
        list: Planner[]
    }

    let { list }: PlannerListProps = $props() 

    /** A list of groups that filter by different sort types for planners */
    let filteredGroups: PlannerGroup[] = $derived.by(() => {        
        if (planners.sortType == "visible") {
            return [
                { title: "Visible Planners", list: list.filter(t => t.visible) },
                { title: "Hidden Planners", list: list.filter(t => !t.visible) }
            ];
        }
        else if (planners.sortType == "color") {
            return [...Map.groupBy(list, t => t.color)].map(([title, list]) => ({ title, list }))
        }
        else {
            return [{ title: "All", list: list }]
        }
    })
                
    let values: string[] = $state([])
</script>

<!-- This is a list of headers that when opened show a list of planner -->
<Accordion.Root
    type="multiple"
    bind:value={values}
>
    {#each filteredGroups as group}
        <AccordionItem 
            title="{group.title}  ({group.list.length})"
            triggerClasses="
                bg-background-100 hover:bg-background-200 rounded-md mb-1 
                w-full py-1.5
                lg:w-auto lg:py-0.5
            "
            contentClasses="flex flex-col gap-4 mb-5"
        >   
            <!-- In each task item, context menus are provided to edit the planner -->
            {#each group.list as planner}
                <PlannerItem planner={planner}/>
            {/each}
        </AccordionItem>
    {/each}
</Accordion.Root>