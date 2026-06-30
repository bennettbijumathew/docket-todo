import { SvelteSet } from "svelte/reactivity";
import { plannerSortList, type Planner, type PlannerSort } from "@/lib/planner/type";

class PlannerStore {
    #list: Planner[] = $state([])
    #visiblePlanners: Planner[] = $derived(this.#list.filter((planner) => planner.visible === true))
    #hiddenPlanners: Planner[] = $derived(this.#list.filter((planner) => planner.visible === false))
    #onlyIdPlanners: string[] = $derived(this.#visiblePlanners.map((planner) => planner.id));
    #sort: PlannerSort = $state("visible")

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

    get ids() {
        return this.#onlyIdPlanners; 
    }

    get({id}: {id: string}): Planner | null {
        return this.#list.find((planner: Planner) => planner.id === id) ?? null
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

    get sortType () {
        return this.#sort; 
    }

    toggleSort() {
        let currentIndex = plannerSortList.findIndex((item) => item == this.#sort) 

        // Cycles to the next sort type.
        if (plannerSortList[currentIndex + 1] == null) {
            this.#sort = plannerSortList[0]
        }
        else {
            this.#sort = plannerSortList[currentIndex + 1] 
        }
    }
}

export const planners = new PlannerStore()