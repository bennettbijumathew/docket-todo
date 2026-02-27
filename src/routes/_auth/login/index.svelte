<script lang="ts">
	import { navigate } from "sv-router/generated";
    import { authController } from "@/lib/auth/controller";
    import { authStore } from "@/lib/auth/store.svelte";

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

<main class="flex-1 flex flex-col p-4 rounded-xl gap-x-4 min-h-0 bg-background border border-background-300 m-4 mt-0">
    <h2 class="font-default font-semibold text-xl text-center pb-4"> Login </h2>

    <!-- Form for the users to input their email and password to log in. -->
    <form 
        onsubmit={(e) => {
            e.preventDefault();
            handleLogIn();
        }}
    >
        <div class="pb-4">
            <p>email</p>

            <input 
                type="text" 
                bind:value={email} 
                class="border-b min-w-50" 
                placeholder="enter your email"
                autocomplete="email"
            />
        </div>
    
        <div class="pb-4">
            <p>password</p>

            <input
                type="password" 
                bind:value={password} 
                class="border-b min-w-50" 
                placeholder="enter your password"
                autocomplete="current-password"
            />
        </div>
    
        <div class="pb-4 flex gap-x-2">
            <button 
                class="border p-1" 
                type="submit"
            >
                log in
            </button>

            <a 
                class="border p-1" 
                href="/signup"
            >
                sign up
            </a>
        </div>

        <!-- The auth controller sets the store's error state, so that is reflected here. -->
        {#if authStore.getError() !== null}
            <div class="pb-4">
                <p class="text-red-600"> {authStore.getError()} </p>
            </div>
        {/if}
    </form>
</main>
