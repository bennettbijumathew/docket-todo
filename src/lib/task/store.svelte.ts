import { type TaskSort, type Task } from "@/lib/task/type";

export class TaskStore {
    #list: Task[] = $state([])
    #sort: TaskSort = $state("completed")

    set all(newList: Task[]) {
        this.#list = newList;
    }

    get all() {
        return this.#list
    }
    set sortType (type: TaskSort) {
        this.#sort = type; 
    }

    get sortType () {
        return this.#sort; 
    }
}

export const tasks = new TaskStore()