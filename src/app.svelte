<script lang="ts">
    import { signInWithEmailAndPassword } from "firebase/auth";
	import { Router } from "sv-router";
	import "sv-router/generated";
    import { auth } from "./lib/config/firebase";

    const routes = [
        { name: "Home", link: "/" },
        { name: "Login", link: "/login" }
    ]
    
    let currentEmail = ""

    async function handleUserALogin() {
        await signInWithEmailAndPassword(auth, import.meta.env.VITE_ACCOUNT_TEST_A_EMAIL, import.meta.env.VITE_ACCOUNT_TEST_PASSWORD);
        currentEmail = auth.currentUser?.email || ""
    }

    async function handleUserBLogin() {
        await signInWithEmailAndPassword(auth, import.meta.env.VITE_ACCOUNT_TEST_B_EMAIL, import.meta.env.VITE_ACCOUNT_TEST_PASSWORD);
        currentEmail = auth.currentUser?.email || ""
    }

</script>

<main>  
    <nav class="p-4 flex items-center border-b justify-between">
        <div class="gap-x-4 flex">
            {#each routes as route}
                <a href={route.link}>
                    {route.name}
                </a>
            {/each}
        </div>
            
        <div class="gap-x-4 flex">
            <div>
                {currentEmail}
            </div>
            
            <button onclick={handleUserALogin}>
                USER A
            </button>

            <button onclick={handleUserBLogin}>
                USER B
            </button>
        </div>
    </nav>

    <Router />
</main>
