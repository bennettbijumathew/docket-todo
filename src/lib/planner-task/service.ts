import { listenPlanners } from "@/lib/planner/repository";
import { planners } from "@/lib/planner/store.svelte";
import { listenTasks } from "../task/repository";
import { tasks } from "@/lib/task/store.svelte";

let unSubFromPlannerUpdates: () => void = () => {};
let unSubFromTaskUpdates: () => void = () => {};

type startArgs = {
    userId: string
}

export function startPlannerTasks({userId}: startArgs) {
    unSubFromPlannerUpdates()
    
    unSubFromPlannerUpdates = listenPlanners(userId, (loadedPlanners) => {
        let oldPlannerLength = planners.all.length; 

        planners.all = loadedPlanners;
        
        // Only updates tasks if the planners have changed
        if (oldPlannerLength != loadedPlanners.length) {
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

    // Clears the user's view of the planners and tasks.
    planners.all = [];
    tasks.all = [];
}
