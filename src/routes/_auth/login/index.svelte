<script lang="ts">
	import { navigate } from "sv-router/generated";
    import { authController } from "@/lib/auth/controller";
    import { authStore } from "@/lib/auth/store.svelte";

    let email: string = $state(import.meta.env.VITE_ACCOUNT_TEST_B_EMAIL ?? "");
    let password: string = $state(import.meta.env.VITE_ACCOUNT_TEST_PASSWORD ?? "");

    async function handleLogIn() {
        const logInResult = await authController.logInWithEmail(email, password)

        if (logInResult === true) {
            navigate("/task")
        }
    }
</script>

<main class="flex-1 flex flex-col p-4 rounded-xl gap-x-4 min-h-0 bg-background border border-background-300 m-4 mt-0">
    <h2 class="font-default font-semibold text-xl text-center pb-4"> Login </h2>

    <section>
        <div class="pb-4">
            <p>email</p>
            <input type="text" bind:value={email} class="border-b min-w-50" placeholder="enter your email"/>
        </div>
    
        <div class="pb-4">
            <p>password</p>
            <input type="password" bind:value={password} class="border-b min-w-50" placeholder="enter your password"/>
        </div>
    
        <div class="pb-4">
            <button class="border p-1" onclick={handleLogIn}>log in</button>
            <button class="border p-1" onclick={() => navigate("/signup")}>sign up</button>
        </div>

        {#if authStore.getError() !== null}
            <div class="pb-4">
                <p class="text-red-600"> {authStore.getError()} </p>
            </div>
        {/if}
    </section>
</main>
