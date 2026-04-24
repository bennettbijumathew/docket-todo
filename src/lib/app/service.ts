import { listenForAuth } from "@/lib/auth/service";
import { PlannerTaskController, plannerTaskController } from "@/lib/planner-task/controller";
import { User } from "firebase/auth";

export class AppController {
    private unSubFromAuth?: () => void
    private plannerTaskController: PlannerTaskController;
    
    constructor(plannerTaskControl: PlannerTaskController) {
        this.plannerTaskController = plannerTaskControl
    }

    // A function that starts the controllers that are used through the application
    public start() {
        this.unSubFromAuth = listenForAuth({
            authenticatedFn: (user: User) => {
                this.plannerTaskController.start(user.uid);
            },
            
            unauthenticatedFn: () => {
                this.plannerTaskController.stop();
            }
        })
    }

    // A function that resets the controllers of the application. 
    public stop() {
        this.plannerTaskController.stop();
        this.unSubFromAuth?.()
    }
}

export const appController = new AppController(plannerTaskController);