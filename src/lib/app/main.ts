import { User } from "firebase/auth";
import { listenForAuth } from "../auth/service";
import { startPlannerTasks, stopPlannerTasks } from "../planner-task/service";
import { platform as getPlatform, type Platform as PlatformType } from '@tauri-apps/plugin-os';

type Platform = PlatformType | "website"

class App {
    #unSubFromAuth?: () => void;
    
    // A function that starts the controllers that are used through the application.
    public start() {
        this.#unSubFromAuth = listenForAuth({
            // This sets up the listeners of the planners and tasks to sync with the store. 
            authenticatedFn: (user: User) => {
                startPlannerTasks({
                    userId: user.uid
                });
            },
            
            // Unsubscribes the listeners and removes data from store.
            unauthenticatedFn: () => {
                stopPlannerTasks();
            }
        })
    }

    // A function that resets the controllers of the application. 
    public stop() {
        stopPlannerTasks()
        this.#unSubFromAuth?.()
    }


    // Gets the current platform of the application
    get platform (): Platform  {
        if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window === false) {
            return "website"
        }
        
        return getPlatform()
    }
}

export const app = new App(); 