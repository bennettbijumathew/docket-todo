import { ColorKey } from "../../components/util/color";

export interface Planner { 
    id: string, 
    name: string,
    users: Record<string, boolean>,
    visible: boolean,
    color: ColorKey
}

export interface UserPlanner extends Planner { 
    selected: boolean
}