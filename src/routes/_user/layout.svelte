<script lang="ts">
    import { onAuthStateChanged } from "firebase/auth";
    import { auth } from "../../lib/config/firebase.ts"
	import type { Snippet } from 'svelte';

    let uid = $state("");
    let loading = $state(false);
    let ready = $state(false);
	let { children }: { children: Snippet } = $props();

    onAuthStateChanged(auth, (user) => {
        loading = true
        ready = false

        if (user) {
            uid = user.uid
            loading = false
            ready = true
        }

        else {
            uid = ""
            loading = false
            ready = true
        }
    })
</script>

<main>
    {#if loading === false && ready === true}
        {@render children()}
    {:else if loading === true && ready === false}
        <p> loading </p>
    {/if}
</main>