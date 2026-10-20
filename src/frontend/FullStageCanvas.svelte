<script lang="ts">
    import { onMount } from "svelte"
    import { scenes, outLocked } from "./stores"
    import { startScene } from "./components/helpers/output"

    type Layer = { id: string; type: "text" | "block"; label: string; text: string; x: number; y: number; w: number; h: number; color: string; hidden: boolean }
    type Composition = { version: 1; durationMs: number; transition: "cut" | "fade" | "slide"; layers: Layer[] }
    export let sceneId: string
    let model: Composition = { version: 1, durationMs: 450, transition: "fade", layers: [] }
    let focused = ""
    let drag: { id: string; x: number; y: number; startX: number; startY: number } | null = null
    let host: HTMLDivElement
    let notice = ""
    let preview = false
    let lastSceneId = ""

    // Versioned FullStage metadata lives in the native scenes store, but the
    // existing FreeShow output renderer does not yet interpret these layers.
    $: if (sceneId !== lastSceneId) {
        lastSceneId = sceneId
        const scene = $scenes[sceneId] as any
        const saved = scene?.fullstageComposition
        model = saved?.version === 1 && Array.isArray(saved.layers)
            ? JSON.parse(JSON.stringify(saved))
            : { version: 1, durationMs: 450, transition: "fade", layers: [] }
        focused = ""
    }
    $: active = model.layers.find((layer) => layer.id === focused)
    function insert(type: "text" | "block") {
        const id = "fs_" + Math.random().toString(36).slice(2, 11)
        model = { ...model, layers: [...model.layers, { id, type, label: type === "text" ? "Text" : "Rectangle", text: type === "text" ? "New title" : "", x: 24, y: 24, w: 38, h: 22, color: type === "text" ? "#F5F7FA" : "#438DFF", hidden: false }] }
        focused = id
    }
    function patch(key: keyof Layer, value: any) {
        model = { ...model, layers: model.layers.map((l) => l.id === focused ? { ...l, [key]: value } : l) }
    }
    function move(index: number, by: number) {
        const target = index + by
        if (target < 0 || target >= model.layers.length) return
        const layers = [...model.layers]
        ;[layers[index], layers[target]] = [layers[target], layers[index]]
        model = { ...model, layers }
    }
    function pointerStart(e: PointerEvent, layer: Layer) {
        if (!host || $outLocked) return
        focused = layer.id
        const bounds = host.getBoundingClientRect()
        drag = { id: layer.id, x: e.clientX / bounds.width * 100, y: e.clientY / bounds.height * 100, startX: layer.x, startY: layer.y }
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }
    function pointerMove(e: PointerEvent) {
        if (!drag || !host) return
        const rect = host.getBoundingClientRect()
        const dx = e.clientX / rect.width * 100 - drag.x
        const dy = e.clientY / rect.height * 100 - drag.y
        const original = model.layers.find((l) => l.id === drag?.id)
        if (!original) return
        model = { ...model, layers: model.layers.map((l) => l.id === drag?.id ? { ...l,
            x: Math.max(0, Math.min(100-l.w, drag!.startX+dx)),
            y: Math.max(0, Math.min(100-l.h, drag!.startY+dy)) } : l) }
    }
    function save() {
        if ($outLocked) { notice = "Outputs locked"; return }
        if (!$scenes[sceneId]) { notice = "Select a saved scene"; return }
        const draft = JSON.parse(JSON.stringify(model))
        scenes.update((all) => ({ ...all, [sceneId]: { ...all[sceneId], modified: Date.now(), fullstageComposition: draft } as any }))
        notice = "Composition saved to native scenes store. Live compositor adapter is not installed."
    }
    function triggerPreview() { preview = false; requestAnimationFrame(() => { preview = true }) }
</script>
<div class="composer">
    <div class="bar"><button disabled={$outLocked} on:click={() => insert("text")}>+ Text</button><button disabled={$outLocked} on:click={() => insert("block")}>+ Block</button>
        <label>Transition <select bind:value={model.transition}><option>cut</option><option>fade</option><option>slide</option></select></label>
        <label>Duration (ms) <input type="number" min="0" max="4000" bind:value={model.durationMs}/></label>
        <button on:click={triggerPreview}>Preview animation</button><button disabled={$outLocked} on:click={save}>Save composition</button>
    </div>
    <div class="stage-frame"><div class:preview class:fade={model.transition === "fade"} class:slide={model.transition === "slide"} class="stage" bind:this={host}>
        {#each model.layers as layer (layer.id)}
            {#if !layer.hidden}<div role="button" tabindex="0" class:selected={focused===layer.id} class="layer"
                style:left={layer.x+"%"} style:top={layer.y+"%"} style:width={layer.w+"%"} style:height={layer.h+"%"}
                style:color={layer.color} style:background={layer.type === "block" ? layer.color : "transparent"}
                on:pointerdown={(e) => pointerStart(e, layer)} on:pointermove={pointerMove} on:pointerup={() => drag=null}
                on:keydown={(e) => { if (e.key === "Enter") focused = layer.id }}>
                {layer.type==="text" ? layer.text : ""}
            </div>{/if}
        {/each}
    </div></div>
    <div class="bottom"><aside><h3>Layers</h3>{#each model.layers as layer,i}<div class:chosen={focused===layer.id}>
        <button on:click={() => focused=layer.id}>{layer.label}</button><button aria-label="Layer up" on:click={() => move(i,-1)}>↑</button><button aria-label="Layer down" on:click={() => move(i,1)}>↓</button>
    </div>{/each}</aside>
    {#if active}<section><h3>Properties</h3><label>Label <input value={active.label} on:input={(e) => patch("label", e.currentTarget.value)}/></label>
        {#if active.type==="text"}<label>Text <input value={active.text} on:input={(e) => patch("text", e.currentTarget.value)}/></label>{/if}
        {#each ["x","y","w","h"] as key}<label>{key.toUpperCase()} % <input type="number" min="0" max="100" value={active[key as "x"|"y"|"w"|"h"]} on:input={(e) => patch(key as keyof Layer, Number(e.currentTarget.value))}/></label>{/each}
        <label>Color <input type="color" value={active.color} on:input={(e) => patch("color", e.currentTarget.value)}/></label>
        <label><input type="checkbox" checked={active.hidden} on:change={(e) => patch("hidden", e.currentTarget.checked)}/> Hidden</label>
        <button on:click={() => {model = {...model,layers:model.layers.filter(l=>l.id!==focused)};focused=""}}>Remove layer</button>
    </section>{/if}</div>
    {#if notice}<p role="status">{notice}</p>{/if}
    <p class="caution">Visual preview only. This canvas does not alter audience outputs or add these layers to FreeShow's native compositor.</p>
</div>
<style>
.composer{padding:14px;background:#101827;color:#f5f7fa}.bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:13px}
button,select,input{background:#172338;color:#f5f7fa;border:1px solid #415471;border-radius:6px;padding:7px}.bar label{display:flex;gap:6px;align-items:center}
.stage-frame{width:100%;max-width:840px}.stage{width:100%;aspect-ratio:16/9;background:#060c15;border:2px solid #438dff;position:relative;overflow:hidden}
.layer{position:absolute;cursor:move;touch-action:none;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:clamp(10px,2vw,32px);user-select:none}
.layer.selected{outline:2px dashed #ffbd59}.stage.preview.fade{animation:fsfade .5s ease-out}.stage.preview.slide{animation:fsslide .5s ease-out}
@keyframes fsfade{from{opacity:0}to{opacity:1}}@keyframes fsslide{from{transform:translateX(15%)}to{transform:translateX(0)}}
.bottom{display:flex;gap:20px;flex-wrap:wrap;margin-top:12px}.bottom aside,.bottom section{background:#172338;padding:12px;border-radius:8px}.bottom aside>div{display:flex;gap:5px}.bottom aside>div.chosen{outline:1px solid #438dff}
.bottom section{display:grid;grid-template-columns:repeat(2,minmax(130px,1fr));gap:8px}.bottom h3{grid-column:1/-1}.bottom label{display:flex;flex-direction:column}
.caution{font-size:12px;color:#ffbd59}
</style>
