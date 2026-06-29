import { type MenuItem } from "@/components/ui/layout/menu/type";
import { removeTask, updateTaskComplete } from "@/lib/task/service";
import { Circle, CircleCheck, Trash } from "@lucide/svelte";
import { SvelteSet } from "svelte/reactivity";
import { type Task } from "@/lib/task/type";

/** A boolean flag that determines if the user wants to execute actions using 
multiple items (bulk - true) or for one item (single - false) */
let isBulkAction: boolean = $state(false)

/** A list of tasks that are selected by the user, this is used in the bulk menu actions */
let selectedTasks: SvelteSet<Task> = new SvelteSet()

/** The current task on which the user has focused on, this is used in single menu actions  */
let currentTask: Task | null = $state(null)

/** A list of menu items that relate to the the task menu. */
let menuItems: MenuItem[] = $state([])

/** An interface for accessing the task menu's selected tasks, menu items, 
and functions for opening and selecting items. */
export const taskMenu = {
    get selectedTasks () {
        return selectedTasks
    }, 
    get items () {
        return menuItems
    }, 
    open (task: Task) { 
        createTaskMenu(task)
    }, 
    select (task: Task) { 
        if (selectedTasks.has(task)) {
            selectedTasks.delete(task)
        }
        else {
            selectedTasks.add(task)
        }
    }
}

/** This wrapper function creates a function that can handle single and bulk actions */
function createAction(operationFn: (item: Task) => void): void {
    if (isBulkAction == true) {
        selectedTasks.forEach((item) => { 
            operationFn(item)
        })

        selectedTasks.clear()
    }

    else if (currentTask !== null) {
        operationFn(currentTask)
        currentTask = null
    }
}

/** Sets the menu list to one that has different capabilities based on amount of tasks selected. */
export function createTaskMenu(task: Task): void {
    /** Resets items in the menu so that it doesn't duplicate */
    menuItems = []

    /** If current task is not selected, a single action approach is taken. In contrast, 
    a current task that is selected uses a bulk action to handle multiple items. */
    isBulkAction = selectedTasks.has(task) && selectedTasks.size > 0;

    /** Updates the current task so that the menu can open for the current task. */
    currentTask = task

    /** Adds new menu items based on action approach and  */
    menuItems.push({
        name: 'Mark as Complete', 
        icon: CircleCheck,
        function: () => {
            createAction((item) => updateTaskComplete({
                id: item.id, 
                complete: true
            }))
        },
        disabled: isBulkAction == false && task.completed == true
    })
    menuItems.push({
        name: 'Mark as Incomplete', 
        icon: Circle,
        function: () => {
            createAction((item) => updateTaskComplete({
                id: item.id, 
                complete: false
            }))
        },
        disabled: isBulkAction == false && task.completed == false
    })
    menuItems.push({
        name: 'Delete', 
        icon: Trash,
        function: () => {
            createAction((item) => removeTask({
                id: item.id
            }))
        },
        disabled: false
    })
}