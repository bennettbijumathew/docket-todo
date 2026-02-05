import { ColorKey } from "../helpers/color";

export interface Planner { 
    id: string, 
    name: string,
    users: Record<string, boolean>,
    visible: boolean,
    color: ColorKey
}