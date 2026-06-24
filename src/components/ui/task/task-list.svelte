<script lang="ts">
    import AccordionItem from "@/components/ui/layout/containers/accordion-item.svelte";
    import TaskItem from "@/components/ui/task/task-item.svelte";
    import { type TaskSort, type Task } from "@/lib/task/type";
    import { tasks } from "@/lib/task/store.svelte";
    import { formatDay } from "@/lib/shared/date";
    import { Accordion } from "bits-ui";
    import { ArrowDown } from "@lucide/svelte";

    interface TaskListProps {
        list: Task[], 
        sortBy: TaskSort
    }

    let { list, sortBy }: TaskListProps = $props() 

    /** This function is called when user wants to toggle the task view */
    export function toggleSort() {
        switch (sortBy) {
            case "completed":
                tasks.sortType = "due-date-asc"
                break; 
            case "due-date-asc": 
                tasks.sortType = "due-date-desc"
                break;
            case "due-date-desc": 
                tasks.sortType = "all"
                break;
            case "all": 
                tasks.sortType = "completed"
        }
    }

    /** This is the filtered version of the tasks, it is sorted by the received sort type. */
    let filteredTasks: Map<string, Task[]> = $derived.by(() => {
        if (sortBy == "completed") {
            return new Map([
                ["Incomplete Tasks", list.filter(task => !task.completed)], 
                ["Complete Tasks", list.filter(task => task.completed)], 
            ]);
        }
        else if (sortBy == "due-date-asc") {
            const groupedByDesc = Map.groupBy(list, ({ dueDate }) => formatDay(dueDate));
            return new Map([...groupedByDesc.entries()].reverse());
        }
        else if (sortBy == "due-date-desc") {
            return Map.groupBy(list, ({ dueDate }) => formatDay(dueDate));
        }
        else {
            return new Map([
                ["All", list], 
            ])
        }
    })
</script>

<!-- This is a list of headers that when opened show a list of tasks -->
<Accordion.Root
    type="multiple"
    value={[...filteredTasks.keys()]}
>
    {#each filteredTasks as [group, groupList] }
        <AccordionItem 
            title={group}
            triggerClasses="
                hover:bg-background-200 cursor-pointer mb-2 rounded-md font-title font-medium
                bg-background-100 w-full px-1 py-1.5 
                lg:w-auto lg:px-2 lg:py-0 lg:bg-transparent
            "
            contentClasses="flex flex-col gap-4 mb-4"
        >   
            <!-- In each task item, context menus are provided to edit the tasks -->
            {#each groupList as task (task.id)}
                <TaskItem task={task}/>
            {/each}
        </AccordionItem>
    {/each}
</Accordion.Root>