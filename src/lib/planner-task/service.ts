import { listenPlanners } from "@/lib/planner/repository";
import { planners } from "@/lib/planner/store.svelte";
import { listenTasks } from "@/lib/task/repository";
import { tasks } from "@/lib/task/store.svelte";

let unSubFromPlannerUpdates: () => void = () => {};
let unSubFromTaskUpdates: () => void = () => {};

type startArgs = {
    userId: string
}

export function startPlannerTasks({userId}: startArgs) {
    unSubFromPlannerUpdates?.()
    
    unSubFromPlannerUpdates = listenPlanners(userId, (loadedPlanners) => {
        // Sets past planners into a set for comparisons.
        const oldPlannerIds = new Set(planners.allIds)

        // Sets new planners into planners store.
        planners.all = loadedPlanners;

        // If the planners have been added/removed, the task listener is updated. 
        const newPlannerIds = new Set(planners.allIds)
        const changedIds = oldPlannerIds.symmetricDifference(newPlannerIds)

        if (changedIds.size > 0) {
            unSubFromTaskUpdates?.()
            unSubFromTaskUpdates = listenTasks(planners.allIds, (loadedTasks) => {
                tasks.all = loadedTasks
            })
        }
    })
}

export function stopPlannerTasks() {
    unSubFromPlannerUpdates?.()
    unSubFromTaskUpdates?.()

    // Resets the unsubscribe functions.
    unSubFromPlannerUpdates = () => {}
    unSubFromTaskUpdates = () => {}

    // Clears the user's view of the planners and tasks.
    planners.all = [];
    tasks.all = [];
}
