<script lang="ts">
    import { routes } from "@/components/util/routes";
</script>

<div class="flex items-center justify-center">
    {#each routes as [name, link]}
        <a href={link} class="text-2xl pl-2 select-none">
            {name}
        </a>
    {/each}
</div>
