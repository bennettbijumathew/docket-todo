import { searchParams } from "sv-router";

const KEY = 'editor';

/** This is an interface to access the editor's state and functions */
export const editor = {
    /** This function gets the value of the editor's search parameter value */
    get value(): string | null {
        const paramValue = searchParams.get(KEY) as string | null

        return paramValue
    },

    /** This function gets the editor's open state */
    get isOpen(): boolean {
        return searchParams.has(KEY);
    },

    /** This function opens the editor through setting a search parameter */
    open(id: string): void {
        searchParams.set(KEY, id);
    },

    /** This function closes the editor through removing a search parameter */
    close(): void {
        searchParams.delete(KEY);
    }
};