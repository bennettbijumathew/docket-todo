<script lang="ts">
    import { getPlatform } from "@/lib/shared/platform";
    import { authController } from "@/lib/auth/controller";
    import { Eye, EyeOff, UserPlus } from "@lucide/svelte";
    import { navigate } from "sv-router/generated";

    // Inputs for creating a new account, changes in the input changes the values.
    let username: string = $state("");
    let email: string = $state("");
    let password: string = $state("");
    
    // This function creates a new account using the controller, and if successful, will navigate to a page
    async function handleSignUp(): Promise<void> {
        const isAccountCreated = await authController.createEmailAccount(username, email, password)

        if (isAccountCreated === true) {
            navigate("/login")
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
        bg-linear-to-r from-purple-100 to-blue-200
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
            
            <p> Create a new account. </p>   
        </div>

        <form 
            class="flex flex-col gap-y-4"
            onsubmit={(e) => {
                e.preventDefault();
                handleSignUp();
            }}

        >
            <!-- Input to add a username -->
            <div>
                <label 
                    for="username" 
                    class="text-sm"
                > 
                    Username 
                </label>

                <input 
                    id="username"
                    type="text"
                    bind:value={username} 
                    class="bg-background-50 hover:bg-background-100 focus:bg-background-200 outline-none rounded-lg p-1 px-1.5 w-full shadow-md" 
                    placeholder="Enter your username"
                    autocomplete="username"
                />
            </div>

            <!-- Input to add an email -->
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
        
            <!-- Input to add a password, includes a button to toggle revealed state of the input. -->
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
            
            <!-- Button to sign up to the website -->
            <div class="pt-2 flex justify-center">
                <button
                    type="submit"
                    class="min-w-26 flex justify-between items-center gap-x-2 p-2 bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer"
                >
                    <UserPlus class="size-4"/>
                    Sign Up
                </button>
            </div>
        </form>
    </section>
</main>