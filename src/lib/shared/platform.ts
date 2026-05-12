import { platform, Platform } from "@tauri-apps/plugin-os"

// Grabs the platform of the tauri application / website. 
export type PlatformType = Platform | "website"

export function getPlatform(): PlatformType  {
    if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window === false) {
        return "website"
    }
    
    return platform()
}