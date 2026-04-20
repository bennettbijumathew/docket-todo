import { listenForPlannerChanges } from "../planner/repository";
import { PlannerDataStore, plannerStore } from "../planner/store.svelte";
import { taskRepo, TaskRepository } from "../task/repository";
import { TaskDataStore, taskStore } from "../task/store.svelte";

export class PlannerTaskController { 
    private unSubFromPlannerUpdates?: () => void
    private unSubFromTaskUpdates?: () => void
    private taskRepo: TaskRepository;
    private taskStore: TaskDataStore;
    private plannerStore: PlannerDataStore;

    constructor(plannerStore: PlannerDataStore, taskRepo: TaskRepository, taskStore: TaskDataStore) {
        this.plannerStore = plannerStore;
        this.taskRepo = taskRepo;
        this.taskStore = taskStore;
    }

    public start(userId: string) {
        this.unSubFromPlannerUpdates?.()
        
        this.unSubFromPlannerUpdates = listenForPlannerChanges(userId, (planners) => {
            this.unSubFromTaskUpdates?.()

            this.plannerStore.setList(planners)
            let currentPlanners = planners.filter((item) => item.users[userId] === true).map((item) => item.id)

            this.unSubFromTaskUpdates = this.taskRepo.onChange(currentPlanners, (tasks) => {
                this.taskStore.setList(tasks)
            })
        })
    }

    public stop() {
        this.unSubFromPlannerUpdates?.()
        this.unSubFromTaskUpdates?.()

        this.plannerStore.clearList()
        this.taskStore.clearList()
    }
}

export const plannerTaskController = new PlannerTaskController(plannerStore, taskRepo, taskStore)