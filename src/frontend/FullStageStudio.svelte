<script lang="ts">
    import { get } from "svelte/store"
    import FullStageCanvas from "./FullStageCanvas.svelte"
    import FullStageMediaLibrary from "./FullStageMediaLibrary.svelte"
    import { activePage, media, outLocked, outputs, scenes, styles } from "./stores"
    import { startScene, setOutput } from "./components/helpers/output"

    let tab: "scenes" | "media" = "scenes"
    let selectedSceneId = ""
    let filter = ""
    let draftName = ""
    let draftStyle = ""
    let draftBindings: string[] = []
    let draftOverlays = ""
    let notice = ""
    $: sceneList = Object.entries($scenes)
    $: mediaList = Object.entries($media).filter(([id, asset]) => (asset?.name || asset?.name || id).toLowerCase().includes(filter.toLowerCase()))
    $: outputList = Object.entries($outputs).filter(([, output]) => output.enabled)
    $: if (selectedSceneId && !$scenes[selectedSceneId]) selectedSceneId = ""

    function selectScene(id: string) {
        const scene = get(scenes)[id]
        if (!scene) return
        selectedSceneId = id
        draftName = scene.name
        draftStyle = scene.content?.style || ""
        draftBindings = [...(scene.bindings || [])]
        draftOverlays = (scene.content?.overlays || []).join(", ")
    }
    function createScene() {
        const id = "fullstage_" + Date.now().toString(36)
        scenes.update((existing) => ({ ...existing, [id]: { name: "New FullStage Scene", modified: Date.now(), bindings: [], content: { overlays: [], hiddenOverlays: [] } } }))
        selectScene(id)
    }
    function toggleBinding(id: string) {
        draftBindings = draftBindings.includes(id) ? draftBindings.filter((entry) => entry !== id) : [...draftBindings, id]
    }
    function saveScene() {
        if (!selectedSceneId || $outLocked) { notice = "Unlock outputs before saving."; return }
        scenes.update((existing) => {
            const original = existing[selectedSceneId]
            if (!original) return existing
            return {
                ...existing,
                [selectedSceneId]: {
                    ...original, name: draftName.trim() || original.name, modified: Date.now(),
                    bindings: [...draftBindings],
                    content: { ...(original.content || {}), style: draftStyle || undefined,
                        overlays: draftOverlays.split(",").map((a) => a.trim()).filter(Boolean) }
                }
            }
        })
        notice = "Scene updated in native store. Verify persistence using FreeShow's normal save/reload flow."
    }
    function playScene() {
        if ($outLocked || !selectedSceneId) return
        startScene(selectedSceneId)
    }
    function showMedia(id: string, asset: any) {
        if ($outLocked || !asset?.name) return
        setOutput("background", { id, path: asset.path, type: asset.type })
    }
</script>

<section class="studio">
    <header><h2>FullStage Production Studio</h2><p>FreeShow-native scene configuration and media selection</p></header>
    <nav><button class:active={tab === "scenes"} on:click={() => tab = "scenes"}>Scene Designer</button><button class:active={tab === "media"} on:click={() => tab = "media"}>Media Studio</button></nav>
    {#if tab === "scenes"}
        <div class="columns">
            <aside><button on:click={createScene} disabled={$outLocked}>+ New scene</button>
                {#each sceneList as [id, scene]}
                    <button class:active={selectedSceneId === id} on:click={() => selectScene(id)}>{scene.name || id}</button>
                {/each}
            </aside>
            <div class="inspector">
                {#if selectedSceneId}
                    <label>Scene name<input bind:value={draftName}/></label>
                    <label>Visual style<select bind:value={draftStyle}><option value="">Use default style</option>{#each Object.entries($styles) as [id, style]}<option value={id}>{style.name || id}</option>{/each}</select></label>
                    <fieldset><legend>Output bindings</legend>{#each outputList as [id, output]}<label class="check"><input type="checkbox" checked={draftBindings.includes(id)} on:change={() => toggleBinding(id)}/>{output.name || id}</label>{/each}</fieldset>
                    <label>Overlay IDs (comma separated)<input bind:value={draftOverlays}/></label>
                    <div class="actions"><button disabled={$outLocked} on:click={saveScene}>Save native scene</button><button disabled={$outLocked} on:click={playScene}>Take scene live</button></div>
                    <FullStageCanvas sceneId={selectedSceneId} />
                    <p>Scene edits map to FreeShow's existing style, overlay and output-binding model. Freeform draggable layers require a separate versioned renderer adapter.</p>
                {:else}<p>Select or create a scene.</p>{/if}
            </div>
        </div>
    {:else}
        <FullStageMediaLibrary />
        <label>Search imported media<input aria-label="Search media" bind:value={filter} placeholder="Name or path" /></label>
        <div class="media-grid">
            {#each mediaList as [id, asset]}
                <article><strong>{asset.name || id}</strong><small>{"Library entry"}</small><code>{"Use FreeShow drawer for playback"}</code><button disabled={$outLocked || true} on:click={() => notice = "Playback remains in the native FreeShow media drawer."}>Send to background</button></article>
            {/each}
        </div>
        <p>Importing, file management and playlist persistence currently use FreeShow's existing drawer and media subsystems.</p>
    {/if}
    {#if notice}<p role="status">{notice}</p>{/if}
    <footer><button on:click={() => activePage.set("show")}>Return to service</button><span>Pre-alpha native studio · no independent layer rendering yet</span></footer>
</section>
<style>
.studio{background:#101827;color:#f5f7fa;height:100%;overflow:auto;padding:20px;font-family:Inter,system-ui,sans-serif}
header h2{margin:0;color:#f5f7fa}header p,p,small,footer span{color:#b6c4d7}nav{display:flex;gap:8px;margin:15px 0 24px}
button{background:#172338;color:#f5f7fa;border:1px solid #354862;border-radius:8px;padding:10px;cursor:pointer}button.active{border-color:#438dff;background:#1f3e61}button:disabled{opacity:.45}
.columns{display:grid;grid-template-columns:minmax(155px,28%) 1fr;gap:15px}aside{display:flex;flex-direction:column;gap:8px}.inspector{background:#172338;border-radius:12px;padding:18px;max-width:730px}
label{display:flex;flex-direction:column;gap:7px;margin-bottom:14px}label.check{flex-direction:row;align-items:center}input,select{background:#101827;color:white;border:1px solid #354862;padding:9px;border-radius:6px}
fieldset{border:1px solid #354862;margin-bottom:15px}.actions{display:flex;gap:9px}.media-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(185px,1fr));gap:12px}
article{display:flex;flex-direction:column;gap:8px;background:#172338;padding:16px;border-radius:10px}article code{overflow-wrap:anywhere;font-size:10px;color:#97a7c5}
footer{display:flex;align-items:center;gap:15px;margin-top:24px}
</style>
