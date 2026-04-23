import { listenForAuthChanges } from "@/lib/auth/repository";
import { startAuthSession, endAuthSession } from "@/lib/auth/service";
import { PlannerTaskController, plannerTaskController } from "@/lib/planner-task/controller";

export class AppController {
    private unSubFromAuth?: () => void
    private plannerTaskController: PlannerTaskController;
    
    constructor(plannerTaskControl: PlannerTaskController) {
        this.plannerTaskController = plannerTaskControl
    }

    // A function that starts the controllers that are used through the application
    public start() {
        this.unSubFromAuth = listenForAuthChanges((user) => {  
            if (user) {
                startAuthSession({ 
                    user: user
                });

                this.plannerTaskController.start(user.uid);
            }

            else {
                this.plannerTaskController.stop();
            }
        });
    }

    // A function that resets the controllers of the application. 
    public stop() {
        endAuthSession(); 
        this.plannerTaskController.stop();
        this.unSubFromAuth?.()
    }
}

export const appController = new AppController(plannerTaskController);