import { cancel, Channel, createChannel, Importance, isPermissionGranted, requestPermission, Schedule, sendNotification, Visibility } from "@choochmeque/tauri-plugin-notifications-api";
import { Notif, RemoveNotif } from "@/lib/notification/android/type";
import { getLocalTimeZone } from "@internationalized/date";
import { getPlatform } from "@/lib/shared/platform";

// Creates a channel to group android notifications.
const channel: Channel = {
    id: 'task-notifications',
    name: 'Task Notifications',
    description: 'Notification for new tasks',
    importance: Importance.High,
    visibility: Visibility.Public,
    sound: 'message_sound',
    vibration: true,
    lights: true,
    lightColor: '#FF0000'
}

if (getPlatform() === "android") {    
    await createChannel(channel);
}


// This function checks if user has allowed access for notification sending. 
export async function isPermissionAllowed(): Promise<boolean> {
    if (await isPermissionGranted()) {
        return true;
    }

    const permission = await requestPermission();
    return permission === "granted";
}


// This functions sends a notification using Tauri's notification plugin. 
export async function sendNotif({id, title, body, dueDate}: Notif): Promise<void> {
    const schedule = Schedule.at(dueDate.toDate(getLocalTimeZone()))
    
    if (await isPermissionAllowed()) {
        sendNotification({
            id: id,
            title: title,
            body: body,
            schedule: schedule,
            channelId: channel.id 
        })
    }
}   

// This function cancels a tauri notification using the notification's number id
export function cancelNotif({id}: RemoveNotif): void {
    cancel([id])
}