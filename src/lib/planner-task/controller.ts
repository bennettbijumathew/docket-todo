import { plannerRepo, PlannerRepository } from "../planner/repository";
import { PlannerDataStore, plannerStore } from "../planner/store.svelte";
import { taskRepo, TaskRepository } from "../task/repository";
import { TaskDataStore, taskStore } from "../task/store.svelte";

export class PlannerTaskController { 
    private unSubFromPlannerUpdates?: () => void
    private unSubFromTaskUpdates?: () => void
    private taskRepo: TaskRepository;
    private taskStore: TaskDataStore;
    private plannerRepo: PlannerRepository;
    private plannerStore: PlannerDataStore;

    constructor(plannerRepo: PlannerRepository, plannerStore: PlannerDataStore, taskRepo: TaskRepository, taskStore: TaskDataStore) {
        this.plannerRepo = plannerRepo;
        this.plannerStore = plannerStore;
        this.taskRepo = taskRepo;
        this.taskStore = taskStore;
    }

    public start(userId: string) {
        var currentPlanners: string[] = [];

        this.unSubFromPlannerUpdates = this.plannerRepo.onChange(userId, (planner) => {
            this.plannerStore.setList(planner)
            currentPlanners = planner.map((item) => item.id)

            this.unSubFromTaskUpdates = this.taskRepo.onChange(currentPlanners, (tasks) => {
                this.taskStore.setList(tasks)
            })
        })
    }

    public stop() {
        this.unSubFromPlannerUpdates?.()
        this.unSubFromTaskUpdates?.()
        this.plannerStore.clearList()
    }
}

export const plannerTaskController = new PlannerTaskController(plannerRepo, plannerStore, taskRepo, taskStore)