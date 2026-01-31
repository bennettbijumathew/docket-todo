import { authController, AuthController } from "../auth/controller";

export class AppController {
    private authController: AuthController;
    
    constructor(authControl: AuthController) {
        this.authController = authControl;
    }

    // A function that starts the controllers that are used through the application
    public start() {
        this.authController.start();
    }

    // A function that resets the controllers of the application. 
    public stop() {
        this.authController.stop();
    }
}

export const appController = new AppController(authController);