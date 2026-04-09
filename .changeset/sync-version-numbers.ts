import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

function syncVersion() {
    try {
        const currentVersion = readPackageJsonVersion();
                
        updateCargoToml(currentVersion);
        updateTauriConf(currentVersion)

        console.log("✅ Version sync complete!");
    } 
    catch (error: any) {
        console.error("❌ Error syncing versions:", error.message);
        process.exit(1);
    }
}

function readPackageJsonVersion(): string {
    const packageJsonPath = path.join(__dirname, "../package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    console.log(`📦 Package.json version: ${packageJson.version}`);

    return packageJson.version;
}

function updateCargoToml(newVersion: string): void {
    // Update Cargo.toml
    const cargoTomlPath = path.join(__dirname, "../src-tauri/Cargo.toml");
    let cargoContent = fs.readFileSync(cargoTomlPath, "utf8");

    // Replace version in [package] section (only first occurrence)
    const versionRegex = /^version = ".*"/m;
    const newCargoContent = cargoContent.replace(
        versionRegex,
        `version = "${newVersion}"`
    );

    if (cargoContent !== newCargoContent) {
        fs.writeFileSync(cargoTomlPath, newCargoContent, "utf8");

        console.log(`🦀 Updated Cargo.toml to version: ${newVersion}`);
    } 
    else {
        console.log(`🦀 Cargo.toml already at version: ${newVersion}`);
    }
}

function updateTauriConf(newVersion: string): void {
    // Verify tauri.conf.json points to package.json
    const tauriConfigPath = path.join(
        __dirname,
        "../src-tauri/tauri.conf.json"
    );
    
    const tauriConfig = JSON.parse(fs.readFileSync(tauriConfigPath, "utf8"));

    // Updates the version based on if tauri config differs from the version
    if (tauriConfig.version !== newVersion) {
        tauriConfig.version = newVersion
        const updatedTauriConfig = JSON.stringify(tauriConfig, null, 4)
        fs.writeFileSync(tauriConfigPath, updatedTauriConfig);

        console.log(`⚙️  Updated tauri.conf.json version to version: ${newVersion}`);
    }
    else {
       console.log(`⚙️  tauri.conf.json already at version: ${newVersion}`) 
    }
}

// On running the file in node, this function is called first.
syncVersion()