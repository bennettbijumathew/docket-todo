<script lang="ts">
    import AccordionItem from "@/components/ui/layout/containers/accordion-item.svelte";
    import MenuTrigger from "@/components/ui/layout/menu/trigger.svelte";
    import { editor } from "@/components/ui/layout/editor/util.svelte";
    import TaskItem from "@/components/ui/task/task-item.svelte";
    import { type TaskSort, type Task } from "@/lib/task/type";
    import MenuRoot from "../layout/menu/root.svelte";
    import { tasks } from "@/lib/task/store.svelte";
    import { taskMenu } from "./task-menu.svelte";
    import { formatDay } from "@/lib/shared/date";
    import { Accordion } from "bits-ui";

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
                bg-background-100 hover:bg-background-200 cursor-pointer mb-2 rounded-lg 
                w-full px-1 py-2
                lg:w-auto lg:px-2 lg:py-0
            "
            contentClasses="
                flex flex-col gap-4 mb-4
            "
        >   
            <!-- In each task item, context menus are provided to edit the tasks -->
            <!-- On pressing ctrl+left click, you can select a list of tasks for the menu -->
            <!-- On pressing left click, you can open the editor -->
            {#each groupList as task (task.id)}
                <MenuRoot items={taskMenu.items}>
                    <MenuTrigger 
                        onLeftClick={(e) => {
                            if (e.ctrlKey) {
                                taskMenu.select(task)
                            }
                            else {
                                editor.value == task.id ? editor.close() : editor.open(task.id)
                            }
                        }}
                        onRightClick={() => taskMenu.open(task)}
                        ariaLabel="Button to view details about '{task.name}'"
                        triggerClasses="
                            {taskMenu.selectedTasks.has(task) ? 'border-2' : 'border'}
                            flex items-center shrink-0 py-0.5 
                            min-h-24 px-2 gap-2
                            sm:min-h-22 sm:px-3 sm:gap-3
                            lg:min-h-16
                        "
                    >
                        <TaskItem
                            task={task}
                        />
                    </MenuTrigger>
                </MenuRoot>
            {/each}
        </AccordionItem>
    {/each}
</Accordion.Root>