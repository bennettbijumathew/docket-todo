import { CalendarDateTime, DateFormatter, getLocalTimeZone } from "@internationalized/date";
import { Timestamp } from "firebase/firestore";

/** This function takes a 'CalendarDateTime' object and formats it into a format like 'Saturday, November 6, 2026 at 7:00 PM'*/
export function formatLongDate(date: CalendarDateTime): string {
    const formatter = new DateFormatter("en-US", {
        dateStyle: "full",
        timeStyle: "short",
    })

    return formatter.format(date.toDate(getLocalTimeZone()))
}

/** This function takes a 'CalendarDateTime' object and formats it into a format like 'November 6, 2026'*/
export function formatDay(date: CalendarDateTime): string {
    const formatter = new DateFormatter("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return formatter.format(date.toDate(getLocalTimeZone()))
}

/** This transform Firestore 'Timestamp' object into a 'CalendarDateTime' object */
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

/** This transform the 'CalendarDateTime' object into the Firestore 'Timestamp' object */
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
