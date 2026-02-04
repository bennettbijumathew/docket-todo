export interface Planner { 
    id: string, 
    name: string,
    users: Record<string, boolean>,
    color: string
}