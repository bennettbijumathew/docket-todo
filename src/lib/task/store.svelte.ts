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

    get({id}: {id: string}): Task | null {
        return this.#list.find((task: Task) => task.id === id) ?? null
    }

    set sortType (type: TaskSort) {
        this.#sort = type; 
    }

    get sortType () {
        return this.#sort; 
    }
}

export const tasks = new TaskStore()