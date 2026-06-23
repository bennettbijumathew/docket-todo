import { type TaskSort, type Task } from "@/lib/task/type";

export class TaskStore {
    #list: Task[] = $state([])
    #completeTasks: Task[] = $derived(this.#list.filter((item) => item.completed === true))
    #incompleteTasks: Task[] = $derived(this.#list.filter((item) => item.completed === false))
    #sort: TaskSort = $state("completed")

    set all(newList: Task[]) {
        this.#list = newList;
    }

    get all() {
        return this.#list
    }

    get complete () {
        return this.#completeTasks
    }

    get incomplete () {
        return this.#incompleteTasks
    }

    set sortType (type: TaskSort) {
        this.#sort = type; 
    }

    get sortType () {
        return this.#sort; 
    }
}

export const tasks = new TaskStore()