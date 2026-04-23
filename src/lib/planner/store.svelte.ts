import { SvelteSet } from "svelte/reactivity";
import { Planner } from "./type";

export class PlannerStore {
    #list: Planner[] = $state([])
    #visiblePlanners: Planner[] = $derived(this.#list.filter((planner) => planner.visible === true))
    #hiddenPlanners: Planner[] = $derived(this.#list.filter((planner) => planner.visible === false))
    
    set all(newList: Planner[]) {
        this.#list = newList;
    }

    get all() {
        return this.#list
    }

    get visible() {
        return this.#visiblePlanners;
    }

    get hidden() {
        return this.#hiddenPlanners;
    }

    getItemsById({idList, includeHidden}: {idList: SvelteSet<string>, includeHidden: boolean}) {
        // Returns all planners that are a part of the id list. 
        if (includeHidden == true) {            
            return this.all.filter((planner) => idList.has(planner.id))
        }
        // Returns all of the visible planners that are a part of the id list. 
        else {
            return this.visible.filter((planner) => idList.has(planner.id))
        }
    }   
}


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
    public getItemsById(plannerIds: SvelteSet<string>, showHidden: boolean): Planner[] {
        let planners: Planner[] = []
        
        for (const planner of this.list) {
            // This adds a planner based on if ids match and if the item is visible.
            if (plannerIds.has(planner.id) && (showHidden == false && planner.visible === true)) {
                planners.push(planner)
                continue; 
            }

            // This adds a planner based on the matching ids.   
            if (plannerIds.has(planner.id) && showHidden == true) {
                planners.push(planner)
            }
        }

        return planners
    }
}

export const plannerStore = new PlannerDataStore()


export const planners = new PlannerStore()