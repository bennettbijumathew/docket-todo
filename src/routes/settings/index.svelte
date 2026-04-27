<!-- CODE -->
<script lang="ts">
    import Main from "@/components/ui/layout/_user/main.svelte";
    import { Check, DownloadIcon, Hourglass, type Icon, LoaderCircle, RefreshCcw } from "@lucide/svelte";
    import { check, Update } from '@tauri-apps/plugin-updater';
    import { relaunch } from '@tauri-apps/plugin-process';
    import { app } from "@/lib/app/main";

    // This represents the loading state of the page.
    let loading: boolean = $state(false);

    // This represents the upcoming update of the application.
    let update: Update | null = $state(null);
    type UpdateStatus = "Idle" | "Started" | "Progress" | "Finished" ;
    let updateStatus: UpdateStatus = $state("Idle");

    // This changes the update variable to the latest update.
    async function checkForUpdates(): Promise<void> {
        loading = true;
        update = await check();
        loading = false;
    }

    // This downloads and installs the updates.
    async function installUpdate(): Promise<void> {
        if (update == null) {
            return; 
        }

        // Status is updated as the download and install progress.
        await update.downloadAndInstall((event) => {
            switch (event.event) {
                case 'Started':
                    updateStatus = "Started";
                    break;
                case 'Progress':
                    updateStatus = "Progress";
                    break;
                case 'Finished':
                    updateStatus = "Finished";
                    break;
                }
        });

        // This relaunches the application on installation of the app.
        await relaunch();
    }

    // On running the page, this is called to see if there are updates
    checkForUpdates();
</script>

<!-- COMPONENTS -->
{#snippet statusSymbol(name: string, color: string, icon: typeof Icon)}
    {@const StatusIcon = icon}

    <div class="flex items-center justify-center rounded-lg {color} size-4">
        <StatusIcon class="size-2"/>
    </div>
    
    {name}
{/snippet}

<!-- VIEW -->
<Main>
    <h2 class="
        font-title font-semibold text-lg
        text-center
        sm:text-left
    "> 
        Settings 
    </h2>
        
    {#if loading == true}
        <section class="flex justify-center items-center h-full">
            <LoaderCircle class="animate-spin"/>
        </section>
    {:else if loading == false && app.platform !== "windows"}
        <section class="flex flex-col justify-center items-center h-full">
            <h3 class="font-title text-md font-medium mb-2"> Settings are unavailable </h3>
            <p> This platform does not have any settings at the current moment. </p>
        </section>
    {:else}
        <section class="gap-y-4 my-6">
            <h3 class="font-title text-md font-medium mb-2"> Updates </h3>

            <div class="
                flex items-center justify-between gap-x-3 text-left bg-background-50 p-3 rounded-lg
            ">
                <div class="flex items-center">
                    <RefreshCcw class="size-7"/>
                    
                    <div class="pl-3">
                        <!-- If there is no updates released or existing, a fully updated status is shown -->
                        {#if update == null}
                            <h4 class="font-bold"> You're up to date. </h4>
                        {:else}
                            <h4 class="font-bold"> You're not up to date. </h4>
                        {/if}

                        <a 
                            class="flex items-center text-sm hover:cursor-pointer hover:underline"
                            href="https://github.com/bennettbijumathew/docket-todo/releases/latest/"
                            target="_blank"
                        > 
                            <!-- If there is no updates released or existing, a fully updated status is shown -->
                            {#if update == null}
                                View Current Release Notes
                            {:else}
                                View Newest Release Notes 
                            {/if}
                        </a>
                    </div>
                </div>
                
                {#if update !== null}
                    <button 
                        class="flex justify-between items-center gap-x-3 rounded-lg p-1.5 px-3 bg-background-200 hover:bg-background-300 hover:cursor-pointer"
                        onclick={installUpdate}
                    >
                        <!-- Shows different icons for different moments of the install and download -->
                        {#if updateStatus == "Idle"}
                            {@render statusSymbol("Install Update", "bg-yellow-400", DownloadIcon)}
                        {:else if updateStatus == "Started"}
                            {@render statusSymbol("Downloading Update", "bg-yellow-500", Hourglass)}
                        {:else if updateStatus == "Progress"}
                            {@render statusSymbol("Installing Update", "bg-yellow-500", Hourglass)}
                        {:else if updateStatus == "Finished"}
                            {@render statusSymbol("Finished Update", "bg-green-500", Check)}
                        {/if}
                    </button>
                {:else}
                    <button 
                        class="rounded-lg p-1.5 px-3 bg-background-200 hover:bg-background-300 hover:cursor-pointer"
                        onclick={checkForUpdates}
                    >
                        Check for updates
                    </button>
                {/if}
            </div>
        </section>
    {/if}
</Main>
