<script lang="ts">
    import AccordionItem from "@/components/ui/layout/containers/accordion-item.svelte";
    import TaskItem from "@/components/ui/task/task-item.svelte";
    import { tasks } from "@/lib/task/store.svelte";
    import { formatDay } from "@/lib/shared/date";
    import { type Task } from "@/lib/task/type";
    import { Accordion } from "bits-ui";
    import { onMount } from "svelte";

    interface TaskListProps {
        list: Task[], 
    }

    interface TaskGroup {
        title: string, 
        list: Task[]
    }

    let { list }: TaskListProps = $props() 

    /** A list of groups that filter by different sort types for tasks */
    let filteredGroups: TaskGroup[] = $derived.by(() => {     
        if (tasks.sortType == "completed") {
            return [
                { title: "Incomplete Tasks", list: list.filter(task => !task.completed) }, 
                { title: "Complete Tasks", list: list.filter(task => task.completed) }, 
            ];
        }
        else if (tasks.sortType == "due-date-asc") {
            return [...Map.groupBy(list, ({ dueDate }) => formatDay(dueDate))].map(([title, list]) => ({ title, list })).reverse();
        }
        else if (tasks.sortType == "due-date-desc") {
            return [...Map.groupBy(list, ({ dueDate }) => formatDay(dueDate))].map(([title, list]) => ({ title, list }));
        }
        else {
            return [{ title: "All", list: list }]
        }
    })
                
    let values: string[] = $state([])

    //** On loading, the first filtered groups are shown to the user. */
    onMount(() => {
        values = filteredGroups.map((item) => item.title)
    })
</script>

<!-- This is a list of headers that when opened show a list of planner -->
<Accordion.Root
    type="multiple"
    bind:value={values}
>
    {#each filteredGroups as group}
        <AccordionItem 
            title={group.title}
            subText="({group.list.length})"
            triggerClasses="
                bg-background-100 hover:bg-background-200 rounded-md mb-1 
                w-full py-1.5
                lg:w-auto lg:py-0.5
            "
            contentClasses="flex flex-col gap-4 mb-5"
        >   
            <!-- In each task item, context menus are provided to edit the planner -->
            {#each group.list as task}
                <TaskItem task={task}/>
            {/each}
        </AccordionItem>
    {/each}
</Accordion.Root>