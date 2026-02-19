import { CalendarDateTime, DateFormatter, getLocalTimeZone } from "@internationalized/date";
import { Timestamp } from "firebase/firestore";

export const dateFormatter = new DateFormatter("en-US", {
    dateStyle: "full",
    timeStyle: "short",
})

export function formatLongDate(date: CalendarDateTime) {
    return dateFormatter.format(date.toDate(getLocalTimeZone()))
}

export function timestampToDate(timestamp: Timestamp): CalendarDateTime {
    const date = timestamp.toDate();
    
    return new CalendarDateTime(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    );
}

export function dateToTimestamp(date: CalendarDateTime): Timestamp {
    const newDate = new Date(
        date.year,
        date.month - 1,
        date.day,
        date.hour,
        date.minute,
        date.second,
    );

    return Timestamp.fromDate(newDate)
}
