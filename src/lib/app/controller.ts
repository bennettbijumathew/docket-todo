import { authController, AuthController } from "../auth/controller";
import { PlannerController, plannerController } from "../planner/controller";

export class AppController {
    private unSubFromAuth?: () => void
    private authController: AuthController;
    private plannerController: PlannerController;
    
    constructor(authControl: AuthController, plannerControl: PlannerController) {
        this.authController = authControl;
        this.plannerController = plannerControl
    }

    // A function that starts the controllers that are used through the application
    public start() {
        this.unSubFromAuth = this.authController.listenForAuth((user) => {  
            if (user) {
                this.authController.start(user)
                this.plannerController.start(user.uid);
            }

            else {
                this.plannerController.stop();
            }
        });
    }

    // A function that resets the controllers of the application. 
    public stop() {
        this.authController.stop();
        this.plannerController.stop();
        this.unSubFromAuth?.()
    }
}

export const appController = new AppController(authController, plannerController);