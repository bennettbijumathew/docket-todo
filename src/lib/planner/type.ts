export interface Planner { 
    id: string, 
    name: string,
    users: Record<string, boolean>,
    visible: boolean,
    color: string
}