import { type TaskSort, type Task, taskSortList } from "@/lib/task/type";

export class TaskStore {
    #list: Task[] = $state([])
    #sort: TaskSort = $state("completed")

    set all(newList: Task[]) {
        this.#list = newList;
    }

    get all() {
        return this.#list
    }

    get({id}: {id: string}): Task | null {
        return this.#list.find((task: Task) => task.id === id) ?? null
    }

    set sortType(type: TaskSort) {
        this.#sort = type; 
    }

    get sortType() {
        return this.#sort; 
    }

    toggleSort() {
        let currentIndex = taskSortList.findIndex((item) => item == this.#sort) 

        // Cycles to the next sort type.
        if (taskSortList[currentIndex + 1] == null) {
            this.#sort = taskSortList[0]
        }
        else {
            this.#sort = taskSortList[currentIndex + 1] 
        }
    }
}

export const tasks = new TaskStore()