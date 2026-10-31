import { listenPlanners } from "@/lib/planner/repository";
import { planners } from "@/lib/planner/store.svelte"
import { listenTasks } from "@/lib/task/repository";
import { tasks } from "@/lib/task/store.svelte"

let unSubFromPlannerUpdates: () => void = () => {};
let unSubFromTaskUpdates: () => void = () => {};

type startArgs = {
    userId: string
}

export function startPlannerTasks({userId}: startArgs) {
    unSubFromPlannerUpdates?.()
    unSubFromTaskUpdates?.()
    
    unSubFromPlannerUpdates = listenPlanners(userId, (newPlanners) => {
        planners.all = newPlanners;
        
        unSubFromTaskUpdates?.()

        unSubFromTaskUpdates = listenTasks(planners.ids, (newTasks) => {
            tasks.all = newTasks
        })
    })
}

export function stopPlannerTasks() {
    unSubFromPlannerUpdates?.()
    unSubFromTaskUpdates?.()

    // Clears the user's view of the planners and tasks.
    planners.all = [];
    tasks.all = [];
}
