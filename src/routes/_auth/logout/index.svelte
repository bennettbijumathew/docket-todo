<script lang="ts">
	import { navigate } from "sv-router/generated";
    import { signOut } from "@/lib/auth/service";
    import { DoorOpen } from "@lucide/svelte";
    import { getPlatform } from "@/lib/shared/platform";

    // This function logs out the account using the controller, and navigates to the home page
    function handleLogOut() {
        signOut();
        navigate("/");
    }
</script>

<main class="
    flex flex-1 flex-col
    *:inset-shadow-b-md
    sm:flex-row-reverse *:sm:inset-shadow-l-md
">     
    <!-- This section shows a wallpaper -->
    <section class="
        flex-1
        sm:flex-3
        bg-linear-to-r from-blue-200 to-purple-100
    ">
    </section>

    <!-- The main area -->
    <section class="
        p-6 flex flex-col
        justify-between
        {(getPlatform() === "android" ) ? "pb-12" : ""}
        sm:flex-1 sm:justify-center sm:h-auto
    ">
        <div class="
            pb-4 
            text-center
            sm:text-left
        ">
            <h1 class="font-title text-2xl font-bold text-content-900 hover:text-content-800">            
                Docket
            </h1>
            
            <p> Log out of your account. </p>   
        </div>
        
        <!-- Form for the users to input their email and password to log in. -->
        <div class="flex flex-col gap-y-4">   
            <h2 class="text-lg font-semibold"> Thank you for your time. We will see you later! </h2>
        
            <!-- Place for the log in and sign up -->
            <div class="                
                flex gap-x-2
                justify-center
                sm:justify-start
            ">
                <button 
                    class="min-w-26 flex justify-between items-center gap-x-2 p-2 bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer"
                    onclick={handleLogOut}
                >
                    <DoorOpen class="size-4"/>
                    Log Out
                </button>
            </div>
        </div>
    </section>
</main>