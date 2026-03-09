export type routeNames =
    | "Home"
    | "Log In"
    | "Sign Up"
    | "Task"
    | "Planner"

export const routes: Map<routeNames, string> = new Map()

routes.set("Home", "/")
routes.set("Log In", "/login")
routes.set("Sign Up", "/signup")
routes.set("Task", "/task")
routes.set("Planner", "/planner")