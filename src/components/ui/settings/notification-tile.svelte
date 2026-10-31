<!-- CODE -->
<script lang="ts">
    import { isPermissionAllowed } from "@/lib/notification/android/repository";
    import { getPlatform } from "@/lib/shared/platform";
    import { Bell } from "@lucide/svelte";
    import { onMount } from "svelte";
    
    let permissionGranted: boolean | null = $state(null);

    onMount(async () => {
        permissionGranted =  await isPermissionAllowed();
    })
</script>


{#if getPlatform() == "android"}
    <div class="
        flex justify-between gap-x-3 text-left bg-background-50 p-3 rounded-lg
        min-h-24 px-2 gap-2 flex-col
        sm:min-h-22 sm:px-3 sm:gap-3 sm:flex-row sm:items-center
        lg:min-h-16
    ">
        <div class="
            flex items-center
            flex-1
            sm:flex-2
        ">
            <div>
                <Bell class="size-7"/>
            </div>

            <div class="pl-3">
                <h4 class="font-bold"> Notification is {permissionGranted == true ? "enabled" : "disabled" } </h4>

                <p class="pt-1 text-xs font-semibold"> To {permissionGranted == true ? "disable" : "enable" } notifications, follow these instructions: </p>
                <p class="text-xs"> Settings &gt; Apps &gt; Docket &gt; Notifications &gt; Set 'Allow Notifications' setting to '{permissionGranted == true ? "False" : "True" }' </p>
            </div>
        </div>
    </div>
{/if}