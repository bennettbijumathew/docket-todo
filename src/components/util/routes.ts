import { Home, Library, Cog, type Icon, House, DoorOpen, UserPlus, ClipboardCheck, Notebook } from '@lucide/svelte';

type RouteNames =
    | "Home"
    | "Log In"
    | "Sign Up"
    | "Task"
    | "Planner"

interface RouteDetails {
    link: string, 
    icon: typeof Icon
}

export const routes: Map<RouteNames, RouteDetails> = new Map()

routes.set("Home", { link: "/", icon: House })
routes.set("Log In", { link: "/login", icon: DoorOpen })
routes.set("Sign Up", { link: "/signup", icon: UserPlus })
routes.set("Task", { link: "/task", icon: ClipboardCheck })
routes.set("Planner", { link: "/planner", icon: Notebook })