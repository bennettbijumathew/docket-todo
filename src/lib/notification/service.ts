import { Scheduler } from "@/lib/notification/type";
import { getPlatform, PlatformType } from "@/lib/shared/platform";
import { AndroidScheduler } from "@/lib/notification/schedulers/android.service";
import { WindowsScheduler } from "@/lib/notification/schedulers/windows.service";
import { CalendarDateTime, getLocalTimeZone, now, toCalendarDateTime, today } from "@internationalized/date";
import { Task } from "@/lib//task/type";
import { formatLongDate } from "@/lib/shared/date";

// A hash function to create a hash id from a given string. Used to identify notifications by number. 
function createNotifId(id: string): number {
    let hash = 0;

    for (let i = 0; i < id.length; i++) {
        const char = id.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }

    return hash;
}

// This class schedules notifications and defers the responsibility to a platform schedule (i.e. Android).
// This approach was taken due to tauri-plugin-notifications' limitation in scheduling tasks in Windows
class NotificationScheduler { 
    scheduler: Scheduler
    idList: Map<string, number> = new Map<string, number>();

    constructor(platform: PlatformType) {
        if (platform === "android") {
            this.scheduler = new AndroidScheduler()
        }
        else {
            this.scheduler = new WindowsScheduler()
        }
    }

    send({ index, title, body, dueDate }: {index: string, title: string, body: string, dueDate: CalendarDateTime}) {
        // If string index doesn't exist, a new entry is added to ensure that the correct notification is being edited.
        if (!this.idList.has(index)) {
            this.idList.set(index, createNotifId(index))
        }
        
        // Notification is created or replaced using the same id that was used in a previous sendNotification() call.  
        this.scheduler.push({
            id: this.idList.get(index)!,
            title: title,
            body: body,
            dueDate: dueDate
        })
    }

    // Removes a notification from the list of notifications. 
    remove({ index }: { index: string }) {
        if (!this.idList.has(index)) {
            return;     
        }

        // If notification id persists, it is deleted. 
        let notifId = this.idList.get(index)

        if (notifId != undefined) {
            this.scheduler.pop({
                id: notifId
            })
        }
    }

    // This functions pushes the task's due date as notifications.
    syncTasks(newTasks: Task[]): void {
        const currentDay = toCalendarDateTime(today(getLocalTimeZone()), now(getLocalTimeZone()))
        
        // Pushes notifications based on if it is due within the next day from today.
        newTasks.map((task: Task) => {
            if (task.dueDate >= currentDay && task.dueDate <= currentDay.add({days: 1})) {
                this.send({
                    index: task.id, 
                    title: `DUE: ${task.name}`, 
                    body: `The task is due on the ${formatLongDate(task.dueDate)}.`,
                    dueDate: task.dueDate
                })
            }
            else {
                this.remove({
                    index: task.id
                })
            }
        })
    }

}

// Creates notification object based on platform type (i.e. Android or Windows). 
export const notifications = new NotificationScheduler(getPlatform())