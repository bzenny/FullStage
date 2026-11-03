<script lang="ts">
    import { onMount } from "svelte"
    import { media, outLocked } from "./stores"
    import { setOutput } from "./components/helpers/output"
    type Entry = { id: string; name: string; path: string; type: string; folder: string; sourceUrl?: string; license?: string; creator?: string; licenseUrl?: string }
    type Collection = { version: 1; entries: Entry[]; playlists: Record<string,string[]> }
    let catalog: Collection = {version:1,entries:[],playlists:{}}
    let query = ""
    let folder = "All"
    let playlist = "Service Media"
    let notice = ""
    onMount(() => {
        try { const old = JSON.parse(localStorage.getItem("fullstage-media-v1") || "null"); if (old?.version===1 && Array.isArray(old.entries)) catalog = old } catch { notice="Stored media index could not be read." }
    })
    $: incoming = Object.entries($media).map(([id, asset]): Entry => ({
        id, name: asset.name || id, path: "", type: "", folder: "FreeShow Library"
    }))
    $: combined = [...incoming, ...catalog.entries.filter((a) => !incoming.some((b) => b.id === a.id))]
    $: folders = ["All", ...new Set(combined.map((a) => a.folder))]
    $: shown = combined.filter((a) => (folder==="All"||folder===a.folder) && (a.name+" "+a.path).toLowerCase().includes(query.toLowerCase()))
    function persist() {
        try { localStorage.setItem("fullstage-media-v1",JSON.stringify(catalog));notice="Media metadata saved on this computer. Keep your actual media files separately." }
        catch { notice="Could not persist local catalog (storage unavailable)." }
    }
    function addFiles(event: Event) {
        const files = Array.from((event.currentTarget as HTMLInputElement).files || [])
        const entries = files.map(file => ({id:"fs-"+Date.now()+"-"+Math.random().toString(36).slice(2,8),name:file.name,path:"",type:file.type,folder:"Local imports"}))
        catalog={...catalog, entries:[...catalog.entries,...entries]}
        persist()
        notice="Imported metadata only: browser selection cannot give FreeShow a durable native file path. Use FreeShow's media importer for playback."
    }
    function assign(id: string) {
        catalog={...catalog,playlists:{...catalog.playlists,[playlist]:[...new Set([...(catalog.playlists[playlist]||[]),id])]}}
        persist()
    }
    function show(entry: Entry) {
        if ($outLocked) {notice="Outputs locked";return}
        if (!entry.path) {notice="Import this file through FreeShow to establish a native path.";return}
        setOutput("background",{id:entry.id,path:entry.path,type:entry.type})
    }
    function addCC() {
        const sourceUrl=prompt("Original item URL from Openverse or Wikimedia Commons:")?.trim()
        if (!sourceUrl || !/^https:\/\//.test(sourceUrl))return
        const creator=prompt("Creator or author (required):")?.trim()
        const license=prompt("License identifier (e.g. CC BY 4.0):")?.trim()
        const licenseUrl=prompt("License URL (required):")?.trim()
        if (!creator || !license || !licenseUrl || !/^https:\/\//.test(licenseUrl)) {notice="Creator and verifiable license URL are required.";return}
        const name=prompt("Asset display name:")?.trim() || "External licensed asset"
        catalog={...catalog,entries:[...catalog.entries,{id:"cc-"+Date.now(),name,path:"",type:"external",folder:"Creative Commons",sourceUrl,license,creator,licenseUrl}]}
        persist()
        notice="Licensed reference saved. No asset downloaded; review rights before importing."
    }
</script>
<div class="library">
    <header><h3>Media Library</h3><span>FreeShow sources + local metadata index</span></header>
    <div class="tools"><input aria-label="Search media" placeholder="Search media" bind:value={query}/>
        <select aria-label="Folder" bind:value={folder}>{#each folders as f}<option>{f}</option>{/each}</select>
        <label class="picker">Select files (metadata only)<input type="file" multiple accept="image/*,video/*,audio/*" on:change={addFiles}/></label>
        <button on:click={addCC}>Add licensed media reference</button>
        <a href="https://openverse.org/" target="_blank" rel="noreferrer">Search Openverse ↗</a>
    </div>
    <div class="playlist"><label>Playlist <input bind:value={playlist}/></label><span>{(catalog.playlists[playlist]||[]).length} items</span></div>
    <div class="items">{#each shown as entry (entry.id)}<article>
        <strong>{entry.name}</strong><small>{entry.folder} · {entry.type || "Unknown"}</small>
        {#if entry.sourceUrl}<a href={entry.sourceUrl} target="_blank" rel="noreferrer">Original source</a>
            <small>{entry.creator} · {entry.license}</small><a href={entry.licenseUrl} target="_blank" rel="noreferrer">License terms</a>{/if}
        {#if entry.path && /\.(png|jpe?g|gif|webp)$/i.test(entry.path)}<small>Local image: {entry.path}</small>{/if}
        <div class="buttons"><button disabled={!entry.path || $outLocked} on:click={()=>show(entry)}>Send background</button><button on:click={()=>assign(entry.id)}>+ Playlist</button></div>
    </article>{/each}</div>
    {#if notice}<p role="status">{notice}</p>{/if}
    <p class="footnote">Metadata and playlists persist in this renderer's localStorage. Native file copying, video previews, thumbnails, and Openverse API ingestion are not yet implemented. External references are not automatically licensed for redistribution.</p>
</div>
<style>
.library{padding:16px;background:#101827;color:#f5f7fa}.library header{display:flex;align-items:center;gap:16px}.library span,.library small,.footnote{color:#9bacbf}.tools{display:flex;flex-wrap:wrap;gap:9px;align-items:center;margin:18px 0}
input,select,button,.picker{padding:9px;border-radius:7px;background:#172338;color:white;border:1px solid #3a506f}button:disabled{opacity:.4}.picker input{max-width:185px}.items{display:grid;grid-template-columns:repeat(auto-fit,minmax(195px,1fr));gap:12px}
article{background:#172338;border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:9px}a{color:#66d6d0}.buttons{display:flex;gap:6px}.playlist{display:flex;gap:15px;align-items:center;margin-bottom:10px}
</style>
