import { listenForPlannerChanges } from "../planner/repository";
import { planners } from "../planner/store.svelte";
import { listenForTaskChanges } from "../task/repository";
import { tasks } from "../task/store.svelte";

export class PlannerTaskController { 
    private unSubFromPlannerUpdates?: () => void
    private unSubFromTaskUpdates?: () => void

    public start(userId: string) {
        this.unSubFromPlannerUpdates?.()
        
        this.unSubFromPlannerUpdates = listenForPlannerChanges(userId, (newPlanners) => {
            this.unSubFromTaskUpdates?.()

            planners.all = newPlanners;

            let currentPlanners = planners.visible.map((item) => item.id);

            this.unSubFromTaskUpdates = listenForTaskChanges(currentPlanners, (newTasks) => {
                tasks.all = newTasks
            })
        })
    }

    public stop() {
        this.unSubFromPlannerUpdates?.()
        this.unSubFromTaskUpdates?.()

        // Clears the user's view of the planners and tasks.
        planners.all = [];
        tasks.all = [];
    }
}

export const plannerTaskController = new PlannerTaskController()