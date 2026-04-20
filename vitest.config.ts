import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from "node:url";

// This config loads the environment variable for testing
export default defineConfig(({ mode }) => ({
    test: {
        env: loadEnv(mode, process.cwd(), ''),
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL("./src", import.meta.url)), 
        },
    }
}))
