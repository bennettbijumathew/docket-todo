<script lang="ts">
    import { routes } from "@/components/util/routes";

    const pageRoutes = new Map(
        [...routes].filter(([name]) => ["Home", "Log In", "Sign Up"].includes(name))
    );
</script>

<main class="
    flex flex-col flex-1
    sm:min-h-0
">
    <nav class="
        flex p-6 items-center
        flex-col
        sm:flex-row sm:justify-between 
    ">
        <h1 class="
            font-title text-lg font-bold
        ">
            Docket.
        </h1>

        <div class="
            flex gap-x-2
        ">
            {#each pageRoutes as [name, {link}]}
                <a href={link} class="text-md select-none hover:bg-background-100 px-2 py-1 rounded-lg">
                    {name}
                </a>
            {/each}
        </div>
    </nav>

    <section class="flex flex-col flex-1 justify-center bg-linear-to-r from-purple-100 to-blue-200 px-6">
        <div class="">
            <h2 class="text-2xl font-title font-bold"> Welcome to Docket! </h2>
            <p> This is a task management application </p>
        </div>
    </section>

    <section class="bg-linear-to-r from-purple-100 to-blue-200 p-6">
        <h3 class="text-center font-bold text-lg pb-4"> Features </h3>

        <div class="flex flex-row gap-x-4 overflow-y-auto">
            <div class="bg-background size-40 rounded-lg">
                <p>Item Placeholder</p>
            </div>
        </div>
    </section>

    <section class="flex-1 bg-background p-6">
        <p> Designed by: </p>
    </section>
</main>
