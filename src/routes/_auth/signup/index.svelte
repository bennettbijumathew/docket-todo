<script lang="ts">
    import { authController } from "@/lib/auth/controller";
    import { authRepo } from "@/lib/auth/repository";
	import { navigate } from "sv-router/generated";

    let email: string = $state(import.meta.env.VITE_ACCOUNT_TEST_B_EMAIL ?? "");
    let password: string = $state(import.meta.env.VITE_ACCOUNT_TEST_PASSWORD ?? "");

    async function handleSignUp() {
        const test = authRepo.createAccount(email, password)
        console.log(test)
    }

</script>

<main class="flex-1 flex flex-col p-4 rounded-xl gap-x-4 min-h-0 bg-background border border-background-300 m-4 mt-0">
    <h2 class="font-default font-semibold text-xl text-center pb-4"> Sign Up </h2>

    <section>
        <div class="pb-4">
            <p>email</p>
            <input type="text" bind:value={email} class="border-b min-w-50" placeholder="enter your email"/>
        </div>
    
        <div class="pb-4">
            <p>password</p>
            <input type="text" bind:value={password} class="border-b min-w-50" placeholder="enter your password"/>
        </div>
    
        <div class="pb-4">
            <button class="border p-1" onclick={handleSignUp}>sign up</button>
        </div>
    </section>
</main>
