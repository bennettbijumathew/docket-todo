import { type Icon, House, DoorOpen, UserPlus, ClipboardCheck, Notebook } from '@lucide/svelte';

// A type for the title for each route
type RouteNames =
    | "Home"
    | "Log In"
    | "Sign Up"
    | "Task"
    | "Planner";

// A type for the path of each route
export type RoutePath = 
    | "/"
    | "/login"
    | "/signup"
    | "/task"
    | "/planner";
    
// An interface representing the metadata of the route
interface RouteDetails {
    link: RoutePath, 
    icon: typeof Icon,
    hasSidebar: boolean
};

// This is a list of routes with their names and metadata.
export const routes: Map<RouteNames, RouteDetails> = new Map();

routes.set("Home", { 
    link: "/", 
    icon: House, 
    hasSidebar: false
});
routes.set("Log In", { 
    link: "/login", 
    icon: DoorOpen,
    hasSidebar: false
});
routes.set("Sign Up", { 
    link: "/signup", 
    icon: UserPlus,
    hasSidebar: false
});
routes.set("Task", { 
    link: "/task", 
    icon: ClipboardCheck,
    hasSidebar: true
});
routes.set("Planner", { 
    link: "/planner", 
    icon: Notebook,
    hasSidebar: true
});


// Search parameter keys for the pages
export const paramKeys = {
    editor: "editor",
    sidebar: "sidebar"
} as const

// Search parameter values for the page
export const paramValues = {
    editor: {
        open: "open",
        closed: null,
    },
    sidebar: {
        expanded: null,
        collapsed: "collapsed",
    }
} as const