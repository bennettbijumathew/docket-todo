<script lang="ts">
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { auth } from "@/lib/config/firebase.ts";
	import { navigate } from "sv-router/generated";

    let email: string = $state(import.meta.env.VITE_ACCOUNT_TEST_B_EMAIL ?? "");
    let password: string = $state(import.meta.env.VITE_ACCOUNT_TEST_PASSWORD ?? "");

    async function handleLogIn() {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/planner");
    }

    async function handleLogOut() {
        await auth.signOut()
    }
</script>

<main class="p-4">
    <h1 class="font-bold text-lg pb-4"> login </h1>

    <section>
        <div class="pb-4">
            <p>email</p>
            <input type="text" bind:value={email} class="border-b" placeholder="enter your email"/>
        </div>
    
        <div class="pb-4">
            <p>password</p>
            <input type="text" bind:value={password} class="border-b" placeholder="enter your password"/>
        </div>
    
        <div class="pb-4">
            <button class="border p-1" onclick={handleLogIn}>log in</button>
            <button class="border p-1" onclick={handleLogOut}>signout</button>
        </div>
    </section>
</main>