import { authController, AuthController } from "../auth/controller";
import { PlannerTaskController, plannerTaskController } from "../planner-task/controller";

export class AppController {
    private unSubFromAuth?: () => void
    private authController: AuthController;
    private plannerTaskController: PlannerTaskController;
    
    constructor(authControl: AuthController, plannerTaskControl: PlannerTaskController) {
        this.authController = authControl;
        this.plannerTaskController = plannerTaskControl
    }

    // A function that starts the controllers that are used through the application
    public start() {
        this.unSubFromAuth = this.authController.listenForAuth((user) => {  
            if (user) {
                this.authController.start(user)
                this.plannerTaskController.start(user.uid);
            }

            else {
                this.plannerTaskController.stop();
            }
        });
    }

    // A function that resets the controllers of the application. 
    public stop() {
        this.authController.stop();
        this.plannerTaskController.stop();
        this.unSubFromAuth?.()
    }
}

export const appController = new AppController(authController, plannerTaskController);