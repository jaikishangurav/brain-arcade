"use strict";
// Small helpers shared by the games that load their content from JSON.
// Usage in a game:  <script src="../../shared.js"></script>  then  const { esc, shuffle, pick, store } = ARC;
const ARC = (() => {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // localStorage that never throws (private windows, blocked storage)
  const store = {
    get(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key)); return v === null || v === undefined ? fallback : v; } catch (e) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; } },
  };

  async function fetchJSON(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(url + " (" + r.status + ")");
    return r.json();
  }

  // Saves a JS value as a .json file the person can keep or paste into the repo
  function download(filename, value) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }));
    a.download = filename; a.click(); URL.revokeObjectURL(a.href);
  }

  // Friendly message for when a data file can't be loaded (usually a page opened straight from disk)
  function loadErrorHtml(err, what) {
    return `<div class="center"><h2>😕 Couldn't load ${esc(what)}</h2><p>${esc(err.message)}</p>
      <p class="muted">If you opened this page by double-clicking the file, browsers block loading data files. Start a local server in the arcade folder:</p>
      <pre style="background:#0b1030;padding:8px;border-radius:8px;display:inline-block">python3 -m http.server 8800</pre>
      <p class="muted">Then open http://localhost:8800 or play the online version.</p></div>`;
  }

  // A small screen for kids to add their own words (e.g. a spelling list). Used by Hangman Heroes and Typing Racer.
  //   el: container element   key: localStorage key (an array of strings)   normalize: e.g. w => w.toUpperCase()
  //   min/max: letters per word   minToPlay: how many words are needed before the game uses them
  function wordEditor({ el, key, intro, example, min, max, normalize, minToPlay, exportName, onBack, onChange }) {
    const valid = new RegExp("^[A-Za-z]{" + min + "," + max + "}$");
    const render = msg => {
      const list = store.get(key, []);
      el.innerHTML = `<h2 style="margin-top:0">✏️ My words</h2>
        <p class="muted">${intro} Separate words with commas, spaces or new lines. Letters only, ${min} to ${max} per word.</p>
        <textarea class="fld" id="we-text" rows="3" placeholder="${esc(example)}"></textarea>
        <div class="msg" id="we-msg">${msg || ""}</div>
        <div class="row" style="justify-content:flex-start"><button class="btn" id="we-add">Add words</button><button class="btn alt" id="we-back">⬅️ Back</button></div>
        ${list.length ? `<h3>My ${list.length} word${list.length > 1 ? "s" : ""}${list.length < minToPlay ? ` <span class="muted">(add ${minToPlay - list.length} more to play with them)</span>` : ""}</h3>
          <div class="wchips">${list.map((w, i) => `<span class="wchip">${esc(w)}<button data-del="${i}" aria-label="Delete ${esc(w)}">✕</button></span>`).join("")}</div>
          <button class="btn alt" id="we-exp" style="font-size:14px;padding:6px 12px;margin-top:10px">⬇️ Download as JSON</button>` : ""}`;
      el.querySelector("#we-back").onclick = onBack;
      el.querySelector("#we-add").onclick = () => {
        const words = el.querySelector("#we-text").value.split(/[\s,;]+/).map(w => w.trim()).filter(Boolean);
        if (!words.length) return render("Type a word first!");
        const cur = store.get(key, []), added = [], skipped = [];
        words.forEach(w => { const n = normalize(w); if (!valid.test(w)) skipped.push(w); else if (!cur.includes(n) && !added.includes(n)) added.push(n); });
        const ok = store.set(key, cur.concat(added));
        if (onChange) onChange();
        render((added.length ? `<span class="good">✅ Added ${added.length} word${added.length > 1 ? "s" : ""}!</span> ` : "") +
               (skipped.length ? `<span class="bad">Skipped: ${skipped.map(esc).join(", ")} (letters only, ${min} to ${max})</span>` : "") +
               (!ok ? "Couldn't save in this browser." : ""));
      };
      el.querySelectorAll("[data-del]").forEach(b => b.onclick = () => { const cur = store.get(key, []); cur.splice(+b.dataset.del, 1); store.set(key, cur); if (onChange) onChange(); render(); });
      const exp = el.querySelector("#we-exp");
      if (exp) exp.onclick = () => download(exportName, store.get(key, []));
    };
    render();
  }

  return { esc, rnd, pick, shuffle, store, fetchJSON, download, loadErrorHtml, wordEditor };
})();
