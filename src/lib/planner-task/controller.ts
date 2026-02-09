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
        this.unSubFromPlannerUpdates?.()
        
        this.unSubFromPlannerUpdates = this.plannerRepo.onChange(userId, (planners) => {
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

    updatePlannerVisibility(uid: string, plannerId: string, newValue: boolean): void {
        this.plannerRepo.editVisibility(uid, plannerId, newValue)
    }

    removePlannerFromTask(taskId: string, plannerId: string): void {
        this.taskRepo.removePlanner(taskId, plannerId)
    }

    addPlannerFromTask(taskId: string, plannerId: string): void {
        this.taskRepo.addPlanner(taskId, plannerId)
    }
}

export const plannerTaskController = new PlannerTaskController(plannerRepo, plannerStore, taskRepo, taskStore)