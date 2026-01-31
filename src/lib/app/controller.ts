import { authController, AuthController } from "../auth/controller";
import { PlannerController, plannerController } from "../planner/controller";

export class AppController {
    private authController: AuthController;
    private plannerController: PlannerController;
    
    constructor(authControl: AuthController, plannerControl: PlannerController) {
        this.authController = authControl;
        this.plannerController = plannerControl
    }

    // A function that starts the controllers that are used through the application
    public start() {
        this.authController.start();
        this.plannerController.start("");
    }

    // A function that resets the controllers of the application. 
    public stop() {
        this.authController.stop();
        this.plannerController.stop();
    }
}

export const appController = new AppController(authController, plannerController);