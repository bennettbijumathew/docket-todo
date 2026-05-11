import { authentication } from "@/lib/auth/store.svelte";
import { notifications } from "@/lib/notification/service";
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
    
    authentication.status = "loading"

    unSubFromPlannerUpdates = listenPlanners(userId, (newPlanners) => {
        planners.all = newPlanners;
        
        unSubFromTaskUpdates?.()

        unSubFromTaskUpdates = listenTasks(planners.ids, (newTasks) => {
            tasks.all = newTasks
            notifications.syncTasks(newTasks)
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
