import { type Icon, House, DoorOpen, UserPlus, ClipboardCheck, Notebook } from '@lucide/svelte';

type RouteNames =
    | "Home"
    | "Log In"
    | "Sign Up"
    | "Task"
    | "Planner"

export type RoutePath = 
    | "/"
    | "/login"
    | "/signup"
    | "/task"
    | "/planner"
    

interface RouteDetails {
    link: RoutePath, 
    icon: typeof Icon
}

export const routes: Map<RouteNames, RouteDetails> = new Map()

routes.set("Home", { link: "/", icon: House })
routes.set("Log In", { link: "/login", icon: DoorOpen })
routes.set("Sign Up", { link: "/signup", icon: UserPlus })
routes.set("Task", { link: "/task", icon: ClipboardCheck })
routes.set("Planner", { link: "/planner", icon: Notebook })