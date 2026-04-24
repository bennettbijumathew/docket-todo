import { Task } from "./type";

export class TaskStore {
    #list: Task[] = $state([])
    #completeTasks: Task[] = $derived(this.#list.filter((item) => item.completed === true))
    #incompleteTasks: Task[] = $derived(this.#list.filter((item) => item.completed === false))

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
}

export const tasks = new TaskStore()