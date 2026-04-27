import { authentication } from "../auth/store.svelte";
import { listenPlanners } from "../planner/repository";
import { planners } from "../planner/store.svelte"
import { listenTasks } from "../task/repository";
import { tasks } from "../task/store.svelte"

let unSubFromPlannerUpdates: () => void = () => {};
let unSubFromTaskUpdates: () => void = () => {};

type startArgs = {
    userId: string
}

export function startPlannerTasks({userId}: startArgs) {
    unSubFromPlannerUpdates?.()
    unSubFromTaskUpdates?.()
    
    authentication.status = "loading"

    unSubFromPlannerUpdates = listenPlanners(userId, (newPlanners) => {
        planners.all = newPlanners;
        
        unSubFromTaskUpdates?.()

        unSubFromTaskUpdates = listenTasks(planners.ids, (newTasks) => {
            tasks.all = newTasks
        })
    })

    authentication.status = "authenticated"
}

export function stopPlannerTasks() {
    unSubFromPlannerUpdates?.()
    unSubFromTaskUpdates?.()

    // Clears the user's view of the planners and tasks.
    planners.all = [];
    tasks.all = [];
}
