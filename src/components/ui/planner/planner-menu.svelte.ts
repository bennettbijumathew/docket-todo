import { updatePlannerVisibility } from "@/lib/planner/repository";
import { type MenuItem } from "@/components/ui/layout/menu/type";
import { Circle, CircleCheck, Trash } from "@lucide/svelte";
import { authentication } from "@/lib/auth/store.svelte";
import { removePlanner } from "@/lib/planner/service";
import { SvelteSet } from "svelte/reactivity";
import { Planner } from "@/lib/planner/type";
import { planners } from "@/lib/planner/store.svelte";

/** A boolean flag that determines if the user wants to execute actions using 
multiple items (bulk - true) or for one item (single - false) */
let isBulkAction: boolean = $state(false)

/** A list of planners that are selected by the user, this is used in the bulk menu actions */
let selectedPlanners: SvelteSet<Planner> = new SvelteSet()

/** The current planner on which the user has focused on, this is used in single menu actions  */
let currentPlanner: Planner | null = $state(null)

/** A list of menu items that relate to the the p;anner menu. */
let menuItems: MenuItem[] = $state([])

/** An interface for accessing planner menu's selected planner, menu items, 
and functions for opening and selecting items. */
export const plannerMenu = {
    get selectedPlanners () {
        return selectedPlanners
    }, 
    get items () {
        return menuItems
    }, 
    open (planner: Planner) { 
        createPlannerMenu(planner)
    }, 
    select (planner: Planner) { 
        if (selectedPlanners.has(planner)) {
            selectedPlanners.delete(planner)
        }
        else {
            selectedPlanners.add(planner)
        }
    }
}

/** This wrapper function creates a function that can handle single and bulk actions */
function createAction(operationFn: (item: Planner) => void): void {
    if (isBulkAction == true) {
        selectedPlanners.forEach((item) => { 
            operationFn(item)
        })

        selectedPlanners.clear()
    }

    else if (currentPlanner !== null) {
        operationFn(currentPlanner)
        currentPlanner = null
    }
}

/** Sets the menu list to one that has different capabilities based on amount of planners selected. */
export function createPlannerMenu(planner: Planner): void {
    /** Resets items in the menu so that it doesn't duplicate */
    menuItems = []

    /** If current planner is not selected, a single action approach is taken. In contrast, 
    a current planner that is selected uses a bulk action to handle multiple items. */
    isBulkAction = selectedPlanners.has(planner) && selectedPlanners.size > 0;

    /** Updates the current planner so that the menu can open for the current planner. */
    currentPlanner = planner

    /** Adds new menu items based on action approach and  */
    menuItems.push({
        name: 'Mark as Visible', 
        icon: CircleCheck,
        function: () => {
            createAction((item) => updatePlannerVisibility({
                id: item.id, 
                userId: authentication.userId,
                visibility: true
            }))
        },
        disabled: isBulkAction == false && planner.visible == true
    })
    menuItems.push({
        name: 'Mark as Hidden', 
        icon: Circle,
        function: () => {
            createAction((item) => updatePlannerVisibility({
                id: item.id, 
                userId: authentication.userId,
                visibility: false
            }))
        },
        disabled: isBulkAction == false && planner.visible == false
    })
    menuItems.push({
        name: 'Delete', 
        icon: Trash,
        function: () => {
            createAction((item) => removePlanner({
                id: item.id
            }))
        },
        disabled: selectedPlanners.size >= planners.all.length
    })
}