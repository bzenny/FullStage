<script lang="ts">
    // FullStage opt-in operator panel for FreeShow v1.6.6.
    // Integrate through MainLayout.svelte only after the upstream build baseline passes.
    import { get } from "svelte/store"
    import FullStageStudio from "./FullStageStudio.svelte"
    import { activePage, activeShow, outLocked, outputs, scenes, media, activeStage } from "./stores"
    import { getLayoutRef } from "./components/helpers/show"
    import { updateOut } from "./components/helpers/showActions"
    import { setOutput, startScene, toggleOutput } from "./components/helpers/output"
    import { clearSlide, clearAll, restoreOutput } from "./components/output/clear"
    import { _show } from "./components/helpers/shows"

    let chosenIndex = 0
    let search = ""
    let tab: "slides" | "scenes" | "media" | "outputs" | "studio" = "slides"
    let notice = ""

    $: ref = $activeShow?.id ? getLayoutRef() : []
    $: enabledOutputs = Object.entries($outputs).filter(([, output]) => output.enabled)
    $: sceneItems = Object.entries($scenes)
    $: mediaItems = Object.entries($media).filter(([id, asset]) => (asset?.name || asset?.path || id).toLowerCase().includes(search.toLowerCase()))
    $: locked = $outLocked

    function guard(action: () => void) {
        if (get(outLocked)) { notice = "Outputs locked"; return }
        try { action(); notice = "" } catch (error) { notice = String(error) }
    }
    function take() {
        guard(() => {
            if (!$activeShow?.id || !ref[chosenIndex]) return
            const layout = _show().get("settings.activeLayout")
            updateOut("active", chosenIndex, ref)
            setOutput("slide", { id: $activeShow.id, layout, index: chosenIndex, line: 0 })
        })
    }
</script>

<section class="fullstage" aria-label="FullStage operator workspace">
    <header><strong>Full<span>Stage</span></strong><small> OPEN PRESENTER SOFTWARE · NATIVE CONTROL ALPHA</small></header>
    <nav aria-label="Workspace sections">
        {#each ["slides", "scenes", "media", "outputs", "studio"] as key}
            <button class:active={tab === key} on:click={() => tab = key as typeof tab}>{key}</button>
        {/each}
    </nav>
    {#if tab === "studio"}
        <FullStageStudio />
    {:else if tab === "slides"}
        <h2>Service cue selection</h2>
        {#if !$activeShow?.id}<p>Select a show using the existing FreeShow project browser.</p>{/if}
        <div class="cards">
            {#each ref as slide, i}
                <button class:active={chosenIndex === i} on:click={() => chosenIndex = i}>Cue {i + 1} · {slide?.id || "Slide"}</button>
            {/each}
        </div>
    {:else if tab === "scenes"}
        <h2>Scene presets</h2>
        <div class="cards">
            {#each sceneItems as [id, scene]}
                <button disabled={locked} on:click={() => guard(() => startScene(id))}>{scene.name || id}</button>
            {/each}
        </div>
    {:else if tab === "media"}
        <h2>Media library</h2>
        <input aria-label="Search media" placeholder="Search imported media" bind:value={search} />
        <div class="cards">
            {#each mediaItems as [id, asset]}
                <button disabled={locked} title={asset?.path || ""} on:click={() => guard(() => setOutput("background", { id, path: asset.path, type: asset.type }))}>{asset?.name || asset?.path || id}</button>
            {/each}
        </div>
    {:else}
        <h2>Output windows</h2>
        <div class="cards">
            {#each enabledOutputs as [id, output]}
                <button disabled={locked} on:click={() => guard(() => toggleOutput(id))}>{output.name || id} · Toggle window</button>
            {/each}
        </div>
        <p>Advanced geometry and stage-layout editing remain in FreeShow Settings.</p>
    {/if}
    <footer>
        <button disabled={locked || !$activeShow?.id || !ref[chosenIndex]} on:click={take}>TAKE LIVE</button>
        <button disabled={locked} on:click={() => guard(clearSlide)}>CLEAR SLIDE</button>
        <button disabled={locked} on:click={() => guard(() => clearAll(true))}>CLEAR ALL</button>
        <button disabled={locked} on:click={() => guard(restoreOutput)}>RESTORE</button>
    </footer>
    {#if notice}<p role="alert">{notice}</p>{/if}
    <p class="warning">PRE-ALPHA: Clear All is not true hardware blackout. Output switching requires physical validation.</p>
</section>

<style>
    .fullstage{box-sizing:border-box;height:100%;overflow:auto;background:#101827;color:#f5f7fa;padding:18px;font-family:Inter,system-ui,sans-serif}
    header{display:flex;gap:16px;align-items:center;margin-bottom:20px}header strong{font-size:25px}header span{color:#438dff}small{color:#93a4c1}
    nav{display:flex;gap:8px;margin-bottom:25px}button{background:#172338;border:1px solid #344159;color:#f5f7fa;border-radius:8px;padding:12px;cursor:pointer}
    button.active{border-color:#438dff;background:#223e69}button:disabled{opacity:.4;cursor:not-allowed}
    h2{font-size:18px;margin-bottom:15px}.cards{display:flex;gap:8px;flex-wrap:wrap;max-height:65vh;overflow:auto}
    input{padding:12px;background:#172338;color:white;border:1px solid #466189;border-radius:8px;width:350px;margin-bottom:18px}
    footer{display:flex;gap:10px;margin-top:25px;position:sticky;bottom:0;background:#101827;padding:15px 0}
    footer button:first-child{background:#438dff;color:#101827;font-weight:bold}
    .warning{color:#ffbd59;font-size:12px}
</style>
