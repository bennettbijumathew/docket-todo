import { Scheduler } from "@/lib/notification/type";
import { getPlatform, PlatformType } from "@/lib/shared/platform";
import { AndroidScheduler } from "@/lib/notification/schedulers/android.service";
import { WindowsScheduler } from "@/lib/notification/schedulers/windows.service";

class NotificationScheduler { 
    scheduler: Scheduler
    
    constructor (platform: PlatformType) {
        if (platform === "android") {
            this.scheduler = new AndroidScheduler()
        }
        else {
            this.scheduler = new WindowsScheduler()
        }
    }
}

const notifications = new NotificationScheduler(getPlatform())