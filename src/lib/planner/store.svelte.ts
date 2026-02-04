import { Planner } from "./type";

export class PlannerDataStore {
    private list: Planner[];

    constructor() {
        this.list = $state([]);
    }

    // This function grabs the planner list from the state array.
    public getList(): Planner[] {
        return this.list;
    }

    // This functions replaces the current array with a new array. 
    public setList(newList: Planner[]): void {
        this.list = newList;
    }

    // Clears the list.
    public clearList(): void {
        this.list = [];
    }

    public getSpecific(plannerIds: string[]) {
        const ids = new Set(plannerIds)
        let planners: Planner[] = []

        for (const planner of this.list) {
            if (ids.has(planner.id) && planner.visible === true) {
                planners.push(planner)
            }
        }

        return planners
    }
}

export const plannerStore = new PlannerDataStore()