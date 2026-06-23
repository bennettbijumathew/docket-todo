<script lang="ts">
    import { type TaskSort, type Task } from "@/lib/task/type";
    import { Accordion } from "bits-ui";
    import TaskItem from "./list/parts/task-item.svelte";
    import AccordionItem from "../layout/containers/accordion-item.svelte";
    import { tasks } from "@/lib/task/store.svelte";

    interface TaskListProps {
        list: Task[], 
        sortBy: TaskSort
    }

    let { 
        list, 
        sortBy 
    }: TaskListProps = $props() 

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
            const groupedByDesc = Map.groupBy(list, ({ dueDate }) => dueDate.toString());
            return new Map([...groupedByDesc.entries()].reverse());
        }
        else if (sortBy == "due-date-desc") {
            return Map.groupBy(list, ({ dueDate }) => dueDate.toString());
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
                bg-background-200 hover:bg-background-300 cursor-pointer mb-2 rounded-lg 
                w-full px-1 py-2
                lg:w-auto lg:px-2 lg:py-0
            "
            contentClasses="
                flex flex-col gap-4 mb-4
            "
        >
            {#each groupList as task (task.id)}
                <TaskItem
                    task={task}
                />
            {/each}
        </AccordionItem>
    {/each}
</Accordion.Root>