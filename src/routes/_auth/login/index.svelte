<script lang="ts">
	import { navigate } from "sv-router/generated";
    import { authController } from "@/lib/auth/controller";
    import { authStore } from "@/lib/auth/store.svelte";
    import { DoorOpen, UserPlus } from "@lucide/svelte";
    import { getPlatform } from "@/components/util/platform";

    // Inputs for logging into the website, changes in the input changes the values.
    let email: string = $state("");
    let password: string = $state("");

    // This function logs in the account using the controller, and if successful, will navigate to a page
    async function handleLogIn() {
        const logInResult = await authController.logInWithEmail(email.trim(), password)

        if (logInResult === true) {
            navigate("/task")
        }
    }
</script>

<main class="
    flex flex-1 flex-col
    *:inset-shadow-b-md
    sm:flex-row-reverse *:sm:inset-shadow-l-md
">     
    <!-- This section shows an image -->
    <section class="
        flex-1
        sm:flex-3
        bg-linear-to-r from-purple-100 to-blue-200
    ">
    </section>

    <!-- The main area  -->
    <section class="
        p-6 flex flex-col
        justify-between
        {(getPlatform() === "android" ) ? "pb-12" : ""}
        sm:flex-1 sm:justify-center sm:h-auto
    ">
        <h1 class="
            font-title text-2xl font-bold text-content-900 hover:text-content-800 pb-4
            text-center
        ">            
                Docket
        </h1>
        
        <!-- Form for the users to input their email and password to log in. -->
        <form 
            onsubmit={(e) => {
                e.preventDefault();
                handleLogIn();
            }}
            class="
                flex flex-col gap-y-4 
                sm:mx-4
            "
        >
            <div>
                <p class="font-bold">Email</p>

                <input 
                    type="text" 
                    bind:value={email} 
                    class="bg-background-50 hover:bg-background-100 focus:bg-background-200 outline-none rounded-lg p-1 px-1.5 w-full shadow-md" 
                    placeholder="Enter your email"
                    autocomplete="email"
                />
            </div>
        
            <div>
                <p class="font-bold">Password</p>

                <input
                    type="password" 
                    bind:value={password} 
                    class="bg-background-50 hover:bg-background-100 focus:bg-background-200 outline-none rounded-lg p-1 px-1.5 w-full shadow-md" 
                    placeholder="Enter your password"
                    autocomplete="current-password"
                />
            </div>
        
            <div class="flex justify-center gap-x-2 pt-2">
                <button 
                    class="flex justify-between items-center gap-x-2 p-2 bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer"
                    type="submit"
                >
                    <DoorOpen class="size-4"/>
                    Log In
                </button>

                <a 
                    class="flex justify-between items-center gap-x-2 px-2 py-1 bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer"
                    href="/signup"
                >
                    <UserPlus class="size-4"/>
                    Sign Up
                </a>
            </div>

            <!-- The auth controller sets the store's error state, so that is reflected here. -->
            {#if authStore.getError() !== null}
                <div class="pb-4">
                    <p class="text-red-600"> {authStore.getError()} </p>
                </div>
            {/if}
        </form>
    </section>
</main>