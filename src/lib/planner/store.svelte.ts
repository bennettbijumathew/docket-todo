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

    // This returns a list of planners based on id. The result can changed based on if
    // caller wants to see the user's hidden planners.
    public getItemsById(plannerIds: string[], showHidden: boolean): Planner[] {
        const ids = new Set(plannerIds)
        let planners: Planner[] = []
        
        for (const planner of this.list) {
            // This adds a planner based on if ids match and if the item is visible.
            if (ids.has(planner.id) && (showHidden == false && planner.visible === true)) {
                planners.push(planner)
                continue; 
            }

            // This adds a planner based on the matching ids.   
            if (ids.has(planner.id) && showHidden == true) {
                planners.push(planner)
            }
        }

        return planners
    }
}

export const plannerStore = new PlannerDataStore()