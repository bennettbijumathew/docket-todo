<script lang="ts">
    import { getPlatform } from "@/components/util/platform";
    import { authController } from "@/lib/auth/controller";
    import { UserPlus } from "@lucide/svelte";
    import { navigate } from "sv-router/generated";
    import { Toaster } from "svelte-sonner";

    // Inputs for creating a new account, changes in the input changes the values.
    let username: string = $state("");
    let email: string = $state("");
    let password: string = $state("");
    
    // This function creates a new account using the controller, and if successful, will navigate to a page
    async function handleSignUp() {
        const isAccountCreated = await authController.createEmailAccount(username, email, password)

        if (isAccountCreated === true) {
            navigate("/login")
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

        <div class="flex flex-col gap-y-4">
            <div>
                <p>Username</p>
                <input 
                    type="text"
                    bind:value={username} 
                    class="bg-background-50 hover:bg-background-100 focus:bg-background-200 outline-none rounded-lg p-1 px-1.5 w-full shadow-md" 
                    placeholder="Enter your username"
                />
            </div>

            <div>
                <p>Email</p>
                <input 
                    type="text" 
                    bind:value={email} 
                    class="bg-background-50 hover:bg-background-100 focus:bg-background-200 outline-none rounded-lg p-1 px-1.5 w-full shadow-md" 
                    placeholder="Enter your email"
                />
            </div>
        
            <div>
                <p>Password</p>
                <input 
                    type="text" 
                    bind:value={password} 
                    class="bg-background-50 hover:bg-background-100 focus:bg-background-200 outline-none rounded-lg p-1 px-1.5 w-full shadow-md" 
                    placeholder="Enter your password"
                />
            </div>
            
            <div class="pt-2 flex justify-center">
                <button
                    onclick={handleSignUp}
                    class="flex justify-between items-center gap-x-2 p-2 bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer"
                >
                    <UserPlus class="size-4"/>
                    Sign Up
                </button>
            </div>
        </div>
    </section>

    <!-- The auth controller sends toasts on errors found. A notification is shown within the page -->
    <Toaster 
        richColors={true}
        toastOptions={{
            unstyled: true,
            classes: {
                toast: `border-0 flex justify-between items-center gap-x-6 p-4 py-3 rounded-lg shadow-md ${getPlatform() === "android" ? "mt-8" : ""}`,
                title: 'font-default',
            }
        }}
        offset={getPlatform() === "android" ? "100px" : undefined}
        position={getPlatform() === "android" ? "top-center" : "bottom-right"}
    />
</main>