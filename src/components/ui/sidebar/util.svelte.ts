import { searchParams } from "sv-router";

const KEY = 'sidebar';

/** This is an interface to access the sidebar's state and functions */
export const sidebar = {
    /** This function gets the value of the sidebar's search parameter value */
    get value(): string | null {
        const paramValue = searchParams.get(KEY) as string | null

        return paramValue
    },

    /** This function gets the sidebar's open state */
    get isOpen(): boolean {
        return searchParams.has(KEY);
    },

    /** This function opens the sidebar through setting a search parameter */
    open(): void {
        searchParams.set(KEY, true);
    },

    /** This function closes the sidebar through removing a search parameter */
    close(): void {
        searchParams.delete(KEY);
    },

    /** This function toggles the sidebar to be open / closed */
    toggle(): void { 
        if (sidebar.isOpen) {
            sidebar.open();
        }
        else {
            sidebar.close();
        }
    }
};