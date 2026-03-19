<script lang="ts">
	import { navigate } from "sv-router/generated";
    import { authController } from "@/lib/auth/controller";
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
            
            <p> Log into your account. </p>   
        </div>
        
        <!-- Form for the users to input their email and password to log in. -->
        <form 
            onsubmit={(e) => {
                e.preventDefault();
                handleLogIn();
            }}
            class="flex flex-col gap-y-4 "
        >
            <!-- Place for the user to write their email -->
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
        
            <!-- Place for the user to write their password -->
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
        
            <!-- Place for the log in and sign up -->
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
        </form>
    </section>
</main>