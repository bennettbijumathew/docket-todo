import { Task } from "./type";

export class TaskDataStore {
    private list: Task[];

    constructor() {
        this.list = $state([]);
    }

    // This function grabs the task list from the state array.
    public getList(): Task[] {
        return this.list;
    }

    // This functions replaces the current array with a new array. 
    public setList(newList: Task[]): void {
        this.list = newList;
    }

    // Clears the list.
    public clearList(): void {
        this.list = [];
    }
}

export const taskStore = new TaskDataStore()