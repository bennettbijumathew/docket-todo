import { platform, type Platform as PlatformType } from '@tauri-apps/plugin-os';

type Platform = PlatformType | "website"

// This function returns the current platform of the application. 
export function getPlatform(): Platform {
    // Returns "website" based on if the platform is not Tauri related (such as a website)
    if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window === false) {
        return "website"
    }
    
    return platform()
}
