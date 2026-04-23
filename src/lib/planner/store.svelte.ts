import { SvelteSet } from "svelte/reactivity";
import { Planner } from "./type";

class PlannerStore {
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

export const planners = new PlannerStore()