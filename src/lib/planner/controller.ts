import { plannerRepo, PlannerRepository } from "./repository";
import { PlannerDataStore, plannerStore } from "./store.svelte";

export class PlannerController { 
    private unSubFromUpdates?: () => void
    private plannerRepo: PlannerRepository;
    private plannerStore: PlannerDataStore;

    constructor(repository: PlannerRepository, store: PlannerDataStore) {
        this.plannerRepo = repository;
        this.plannerStore = store;
    }

    public start(userId: string) {
        this.unSubFromUpdates = this.plannerRepo.onChange(userId, (planner) => {
            this.plannerStore.setList(planner)
        })
    }

    public stop() {
        this.unSubFromUpdates?.()
    }
}

export const plannerController = new PlannerController(plannerRepo, plannerStore)