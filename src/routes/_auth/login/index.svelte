<script lang="ts">
	import { navigate } from "sv-router/generated";
    import { signInWithEmail } from "@/lib/auth/service";
    import { Eye, EyeOff, LogIn, UserPlus } from "@lucide/svelte";
    import { authentication } from "@/lib/auth/store.svelte";
    import { app } from "@/lib/app/main";

    // Inputs for logging into the website, changes in the input changes the values.
    let email: string = $state("");
    let password: string = $state("");

    // This function logs in the account using the controller, and if successful, will navigate to a page
    async function handleLogIn() {
        const logInResult = await signInWithEmail({ 
            email: email, 
            password: password 
        })

        if (logInResult === true && authentication.status === "authenticated") {
            navigate("/task")
        }
    }

    // This is used for the password input.
    let isPasswordRevealed: boolean = $state(false)
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
        {(app.platform === "android" ) ? "pb-12" : ""}
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
                <label 
                    for="email" 
                    class="text-sm"
                > 
                    Email 
                </label>

                <input 
                    id="email"
                    type="text" 
                    bind:value={email} 
                    class="bg-background-50 hover:bg-background-100 focus:bg-background-200 outline-none rounded-lg p-1 px-1.5 w-full shadow-md" 
                    placeholder="Enter your email"
                    autocomplete="email" 
                />
            </div>
        
            <!-- Place for the user to write their password -->
            <div class="relative flex bg-background-50 hover:bg-background-100 focus:bg-background-200 rounded-lg shadow-md">
                <input 
                    id="password"
                    type={isPasswordRevealed == true ? "text": "password"}
                    bind:value={password} 
                    class="w-full outline-none p-1 px-1.5 rounded-lg pr-6" 
                    placeholder="Enter your password"
                    autocomplete="current-password"
                />

                <!-- Button to reveal / hide the password -->
                <button 
                    onclick={(e) => {
                        e.preventDefault();
                        isPasswordRevealed = !isPasswordRevealed
                    }}
                    class="absolute top-0 bottom-0 right-0 cursor-pointer m-1 p-1 hover:bg-background-300 rounded-lg"
                >
                    {#if isPasswordRevealed == true}
                        <Eye class="size-4"/>
                    {:else}
                        <EyeOff class="size-4"/>
                    {/if}
                </button>
            </div>
        
            <!-- Place for the log in and sign up -->
            <div class="
                flex gap-x-2 pt-3
                justify-center flex-row-reverse
                sm:justify-start sm:flex-row
            ">
                <button 
                    class="min-w-26 flex justify-between items-center gap-x-2 p-2 bg-background-100 hover:bg-background-200 shadow-md rounded-lg cursor-pointer"
                    type="submit"
                >
                    <LogIn class="size-4"/>
                    Log In
                </button>
                
                <a 
                    class="min-w-26 flex justify-between items-center gap-x-2 px-2 py-1 bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer"
                    href="/signup"
                >
                    <UserPlus class="size-4"/>
                    Sign Up
                </a>
            </div>
        </form>
    </section>
</main>