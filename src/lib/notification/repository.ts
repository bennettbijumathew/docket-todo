import { getLocalTimeZone } from "@internationalized/date";
import { cancel, isPermissionGranted, requestPermission, Schedule, sendNotification } from "@tauri-apps/plugin-notification";
import { NotifWithDate, Notif, RemoveNotif } from "@/lib/notification/type";

// This functions sends a notification using Tauri's notification plugin. 
// On android, the plugin is able to schedule notifications. 
export async function sendAndroidNotif({id, title, body, dueDate}: NotifWithDate): Promise<void> {
    const schedule = Schedule.at(dueDate.toDate(getLocalTimeZone()))
    
    if (await isAndroidPermissionsGranted()) {
        sendNotification({id, title, body, schedule})
    }
}   


// This functions sends a notification using Tauri's notification plugin. 
// On windows, the plugin is not able to schedule notifications. 
export function sendWindowsNotif({id, title, body}: Notif): void {
    sendNotification({id, title, body})
}   


// This function cancels a tauri notification using the notification's number id
export function cancelNotif({id}: RemoveNotif): void {
    cancel([id])
}

// This function checks if user allows access for notification. 
export async function isAndroidPermissionsGranted(): Promise<boolean> {
    if (await isPermissionGranted()) {
        return true;
    }

    const permission = await requestPermission();
    return permission === "granted";
}