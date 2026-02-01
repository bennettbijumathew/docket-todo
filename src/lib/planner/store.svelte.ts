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
}

export const plannerStore = new PlannerDataStore()