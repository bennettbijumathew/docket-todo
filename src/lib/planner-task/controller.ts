import { listenForPlannerChanges } from "../planner/repository";
import { planners } from "../planner/store.svelte";
import { listenForTaskChanges } from "../task/repository";
import { TaskDataStore, taskStore } from "../task/store.svelte";

export class PlannerTaskController { 
    private unSubFromPlannerUpdates?: () => void
    private unSubFromTaskUpdates?: () => void
    private taskStore: TaskDataStore;

    constructor(taskStore: TaskDataStore) {
        this.taskStore = taskStore;
    }

    public start(userId: string) {
        this.unSubFromPlannerUpdates?.()
        
        this.unSubFromPlannerUpdates = listenForPlannerChanges(userId, (newPlanners) => {
            this.unSubFromTaskUpdates?.()

            planners.all = newPlanners;

            let currentPlanners = planners.visible.map((item) => item.id);

            this.unSubFromTaskUpdates = listenForTaskChanges(currentPlanners, (tasks) => {
                this.taskStore.setList(tasks)
            })
        })
    }

    public stop() {
        this.unSubFromPlannerUpdates?.()
        this.unSubFromTaskUpdates?.()
        planners.all = [];
        this.taskStore.clearList()
    }
}

export const plannerTaskController = new PlannerTaskController(taskStore)