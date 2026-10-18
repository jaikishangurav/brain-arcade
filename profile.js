"use strict";
// Brain Arcade profile: one name, star total, badges and daily streak shared by every game.
// Everything lives in localStorage under "arc-profile", so it needs no accounts or server.
//
// In a game:  <script src="../../profile.js"></script>
//   Profile.play("word-wizard")                         a round started (counts for the daily streak)
//   Profile.award("word-wizard", 5, "Spelled 5 words")  give stars (shows a toast, updates the top bar)
//   Profile.unlock("ww-perfect")                        give a badge (only once)
// A top bar with his name, stars and streak is added to every page automatically
// (the hub opts out with <body data-no-bar>).
const Profile = (() => {
  const KEY = "arc-profile";
  const BASE = (() => { try { return new URL("./", document.currentScript.src).href; } catch (e) { return "./"; } })();

  const GAMES = {
    "planet-hopper":        { name: "Planet Hopper",         icon: "🚀" },
    "dungeon-math-quest":   { name: "Dungeon Math Quest",    icon: "⚔️" },
    "word-wizard":          { name: "Word Wizard",           icon: "🧙" },
    "typing-racer":         { name: "Typing Racer",          icon: "🏎️" },
    "number-bridge-builder":{ name: "Number Bridge Builder", icon: "🌉" },
    "hangman-heroes":       { name: "Hangman Heroes",        icon: "🦸" },
    "pattern-detective":    { name: "Pattern Detective",     icon: "🔍" },
    "story-mixer":          { name: "Story Mixer",           icon: "📖" },
  };

  const BADGES = [
    { id: "first-star", icon: "🌟", name: "First Star",         desc: "Earn your very first star" },
    { id: "stars-25",   icon: "⭐", name: "Star Collector",     desc: "Collect 25 stars" },
    { id: "stars-100",  icon: "🌠", name: "Star Hoarder",       desc: "Collect 100 stars" },
    { id: "stars-250",  icon: "💫", name: "Superstar",          desc: "Collect 250 stars" },
    { id: "stars-500",  icon: "🌌", name: "Galaxy Brain",       desc: "Collect 500 stars" },
    { id: "streak-3",   icon: "🔥", name: "On a Roll",          desc: "Play 3 days in a row" },
    { id: "streak-7",   icon: "📅", name: "Week Warrior",       desc: "Play 7 days in a row" },
    { id: "streak-14",  icon: "🏅", name: "Two-Week Hero",      desc: "Play 14 days in a row" },
    { id: "streak-30",  icon: "👑", name: "Arcade Legend",      desc: "Play 30 days in a row" },
    { id: "explorer",   icon: "🧭", name: "Arcade Explorer",    desc: "Try 4 different games" },
    { id: "all-games",  icon: "🎮", name: "Arcade Master",      desc: "Try all 8 games" },
    { id: "wordsmith",  icon: "🔤", name: "Word Smith",         desc: "Add your own words to a game" },
    { id: "ph-grand-tour",    icon: "🪐", name: "Grand Tourist",      desc: "Visit all 8 planets in Planet Hopper", game: "planet-hopper" },
    { id: "ph-deep-space",    icon: "🛸", name: "Deep Space Voyager", desc: "Visit every moon and dwarf planet", game: "planet-hopper" },
    { id: "ph-pluto",         icon: "❄️", name: "Pluto Pioneer",      desc: "Fly all the way to Pluto", game: "planet-hopper" },
    { id: "ph-question-maker",icon: "✏️", name: "Question Maker",     desc: "Write your own question in Planet Hopper", game: "planet-hopper" },
    { id: "dmq-dragon",       icon: "🐉", name: "Dragon Slayer",      desc: "Clear the dungeon and defeat the dragon", game: "dungeon-math-quest" },
    { id: "dmq-flawless",     icon: "🛡️", name: "Untouchable",        desc: "Clear the dungeon without losing a heart", game: "dungeon-math-quest" },
    { id: "ww-perfect",       icon: "✨", name: "Perfect Spell",      desc: "Spell all 10 words in Word Wizard", game: "word-wizard" },
    { id: "ww-archmage",      icon: "🧙", name: "Archmage",           desc: "Score 700 or more in Word Wizard", game: "word-wizard" },
    { id: "tr-winner",        icon: "🏁", name: "Racing Champion",    desc: "Win a Typing Racer race", game: "typing-racer" },
    { id: "tr-fast",          icon: "⚡", name: "Fast Fingers",       desc: "Type 20+ words per minute with 95% accuracy", game: "typing-racer" },
    { id: "nbb-master",       icon: "🌉", name: "Master Builder",     desc: "Cross a river without a single splash", game: "number-bridge-builder" },
    { id: "nbb-ocean",        icon: "🌊", name: "Ocean Crosser",      desc: "Cross the Ocean in Number Bridge Builder", game: "number-bridge-builder" },
    { id: "hh-hero",          icon: "🦸", name: "Village Hero",       desc: "Save 5 heroes in a row in Hangman Heroes", game: "hangman-heroes" },
    { id: "pd-perfect",       icon: "🔎", name: "Perfect Detective",  desc: "Close a case without a wrong guess", game: "pattern-detective" },
    { id: "pd-chief",         icon: "🧠", name: "Chief Inspector",    desc: "Close the Chief Inspector case", game: "pattern-detective" },
    { id: "sm-author",        icon: "📖", name: "Story Author",       desc: "Write 3 parts of one story", game: "story-mixer" },
    { id: "sm-hero-maker",    icon: "🦊", name: "Hero Maker",         desc: "Create your own hero in Story Mixer", game: "story-mixer" },
    { id: "sm-storyteller",   icon: "💾", name: "Storyteller",        desc: "Save a story in Story Mixer", game: "story-mixer" },
  ];
  const BADGE_BY_ID = Object.fromEntries(BADGES.map(b => [b.id, b]));

  const RANKS = [
    { min: 0,   icon: "🔰", name: "Cadet" },
    { min: 25,  icon: "🛩️", name: "Pilot" },
    { min: 75,  icon: "🧭", name: "Navigator" },
    { min: 150, icon: "🎖️", name: "Captain" },
    { min: 300, icon: "🚀", name: "Commander" },
    { min: 500, icon: "👑", name: "Admiral" },
  ];
  const STAR_BADGES = [[1, "first-star"], [25, "stars-25"], [100, "stars-100"], [250, "stars-250"], [500, "stars-500"]];
  const STREAK_BADGES = [[3, "streak-3"], [7, "streak-7"], [14, "streak-14"], [30, "streak-30"]];
  const BACKUP_KEYS = /^(arc|ph|ww|hh|tr|sm|nbb|pd|dmq)-/;

  // ---------- dates (local time, YYYY-MM-DD) ----------
  const fmt = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  let clock = () => new Date();                       // tests can replace this through Profile._setClock
  const today = () => fmt(clock());
  const addDays = (s, n) => { const [y, m, d] = s.split("-").map(Number); return fmt(new Date(y, m - 1, d + n)); };

  // ---------- storage ----------
  const blank = () => ({ v: 1, name: "", avatar: "🧑‍🚀", created: null, stars: 0, games: {}, badges: {},
                         streak: { count: 0, best: 0, last: null }, days: [], todayStars: { date: null, n: 0 } });
  function load() {
    let p = blank();
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && typeof s === "object") p = { ...p, ...s, streak: { ...p.streak, ...(s.streak || {}) }, todayStars: { ...p.todayStars, ...(s.todayStars || {}) } }; } catch (e) {}
    if (typeof p.stars !== "number" || !isFinite(p.stars)) p.stars = 0;
    if (!p.games || typeof p.games !== "object") p.games = {};
    if (!p.badges || typeof p.badges !== "object") p.badges = {};
    if (!Array.isArray(p.days)) p.days = [];
    return p;
  }
  function save(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); return true; } catch (e) { return false; } }

  // ---------- derived info ----------
  function rank(stars) {
    let i = 0; RANKS.forEach((r, k) => { if (stars >= r.min) i = k; });
    const next = RANKS[i + 1] || null;
    return { ...RANKS[i], next, toNext: next ? next.min - stars : 0, progress: next ? (stars - RANKS[i].min) / (next.min - RANKS[i].min) : 1 };
  }
  function streakInfo(p = load()) {
    const t = today(), y = addDays(t, -1), s = p.streak;
    const playedToday = s.last === t;
    const alive = s.last === t || s.last === y;
    const week = Array.from({ length: 7 }, (_, i) => { const d = addDays(t, i - 6); return { date: d, played: p.days.includes(d), isToday: d === t }; });
    return { current: alive ? s.count : 0, best: s.best, playedToday, atRisk: alive && !playedToday && s.count > 0, week,
             todayStars: p.todayStars.date === t ? p.todayStars.n : 0 };
  }
  const isGame = g => Object.prototype.hasOwnProperty.call(GAMES, g);
  const gameStats = (p, g) => p.games[g] || (p.games[g] = { stars: 0, plays: 0 });

  // ---------- core updates (all take a loaded profile and a list to collect toasts) ----------
  function touchDay(p, notes) {
    const t = today();
    if (p.streak.last === t) return;
    const was = p.streak.last;
    p.streak.count = was === addDays(t, -1) ? p.streak.count + 1 : 1;
    p.streak.best = Math.max(p.streak.best, p.streak.count);
    p.streak.last = t;
    if (!p.days.includes(t)) p.days.push(t);
    p.days = p.days.slice(-90);
    if (p.streak.count >= 2) notes.push({ kind: "streak", html: `🔥 <b>${p.streak.count} days in a row!</b>` });
    else if (was) notes.push({ kind: "streak", html: "🔥 New streak started. Keep it going tomorrow!" });
  }
  function grant(p, id, notes) {
    if (!BADGE_BY_ID[id] || p.badges[id]) return;
    p.badges[id] = { at: clock().getTime() };
    const b = BADGE_BY_ID[id];
    notes.push({ kind: "badge", html: `${b.icon} <b>New badge: ${b.name}!</b><br><small>${b.desc}</small>` });
  }
  function autoBadges(p, notes) {
    STAR_BADGES.forEach(([n, id]) => { if (p.stars >= n) grant(p, id, notes); });
    STREAK_BADGES.forEach(([n, id]) => { if (p.streak.count >= n) grant(p, id, notes); });
    const tried = Object.keys(p.games).filter(g => isGame(g) && (p.games[g].plays > 0 || p.games[g].stars > 0)).length;
    if (tried >= 4) grant(p, "explorer", notes);
    if (tried >= Object.keys(GAMES).length) grant(p, "all-games", notes);
  }
  function commit(p, notes) {
    save(p); updateBar(); changed();
    notes.forEach(n => toast(n.html, n.kind));
  }

  // ---------- public actions ----------
  function play(game) {
    const p = load(), notes = [];
    if (!p.created) p.created = today();
    if (isGame(game)) gameStats(p, game).plays++;
    touchDay(p, notes); autoBadges(p, notes); commit(p, notes);
  }
  function award(game, n, why) {
    n = Math.max(0, Math.floor(n || 0));
    const p = load(), notes = [];
    if (!p.created) p.created = today();
    if (n > 0) {
      p.stars += n;
      if (isGame(game)) gameStats(p, game).stars += n;
      if (p.todayStars.date !== today()) p.todayStars = { date: today(), n: 0 };
      p.todayStars.n += n;
      notes.push({ kind: "stars", html: `⭐ <b>+${n}</b>${why ? ` <small>${why}</small>` : ""}` });
    }
    touchDay(p, notes); autoBadges(p, notes); commit(p, notes);
    pulseBar();
  }
  function unlock(id) {
    const p = load(), notes = [];
    grant(p, id, notes);
    if (notes.length) commit(p, notes);
  }
  function setIdentity({ name, avatar }) {
    const p = load();
    if (typeof name === "string") p.name = name.trim().slice(0, 20);
    if (typeof avatar === "string" && avatar) p.avatar = avatar;
    if (!p.created) p.created = today();
    save(p); updateBar(); changed();
  }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) {} updateBar(); changed(); }

  // ---------- backup / restore of everything the arcade keeps in this browser ----------
  function exportAll() {
    const data = {};
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (BACKUP_KEYS.test(k)) data[k] = localStorage.getItem(k); } } catch (e) {}
    return { app: "brain-arcade", version: 1, exported: new Date().toISOString(), data };
  }
  function importAll(obj) {
    if (!obj || obj.app !== "brain-arcade" || !obj.data || typeof obj.data !== "object") throw new Error("That file isn't a Brain Arcade backup.");
    let n = 0;
    Object.entries(obj.data).forEach(([k, v]) => { if (BACKUP_KEYS.test(k) && typeof v === "string") { try { localStorage.setItem(k, v); n++; } catch (e) {} } });
    updateBar(); changed();
    return n;
  }

  // ---------- change listeners (the hub re-renders when the profile changes) ----------
  const listeners = [];
  const onChange = cb => listeners.push(cb);
  function changed() { listeners.forEach(cb => { try { cb(); } catch (e) {} }); }

  // ---------- UI: styles, top bar, toasts ----------
  function injectStyle() {
    if (document.getElementById("arc-style")) return;
    const s = document.createElement("style"); s.id = "arc-style";
    s.textContent = `
      .arc-bar { display:flex; justify-content:center; align-items:center; gap:6px 14px; flex-wrap:wrap; background:#0e1535; border-bottom:1px solid #2a3260; padding:6px 12px; font:14px "Trebuchet MS", system-ui, sans-serif; color:#eef1ff; text-decoration:none; }
      .arc-bar:hover { background:#141d4a; }
      .arc-bar b { color:#ffd54a; }
      .arc-bar .muted { color:#9aa5d6; }
      @keyframes arc-pulse { 0% { transform:scale(1); } 40% { transform:scale(1.18); } 100% { transform:scale(1); } }
      .arc-bar.pulse b.stars { display:inline-block; animation:arc-pulse .5s; }
      #arc-toasts { position:fixed; right:12px; bottom:12px; z-index:9999; display:flex; flex-direction:column; gap:8px; align-items:flex-end; pointer-events:none; max-width:calc(100vw - 24px); }
      .arc-toast { background:#1c2556; border:2px solid #3a47a0; color:#eef1ff; border-radius:12px; padding:8px 14px; font:15px "Trebuchet MS", system-ui, sans-serif; box-shadow:0 6px 18px #0008; animation:arc-in .25s; }
      .arc-toast small { color:#c9d1ff; font-size:12px; }
      .arc-toast.k-badge { border-color:#ffd54a; background:#2b2a5a; }
      .arc-toast.k-streak { border-color:#ff9f43; }
      @keyframes arc-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }`;
    document.head.appendChild(s);
  }
  function toast(html, kind) {
    injectStyle();
    let box = document.getElementById("arc-toasts");
    if (!box) { box = document.createElement("div"); box.id = "arc-toasts"; box.setAttribute("aria-live", "polite"); document.body.appendChild(box); }
    const t = document.createElement("div"); t.className = "arc-toast " + (kind ? "k-" + kind : ""); t.innerHTML = html;
    box.appendChild(t);
    while (box.children.length > 4) box.firstChild.remove();    // a big finish shouldn't flood the screen
    setTimeout(() => t.remove(), kind === "badge" ? 4800 : 3000);
  }
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function barHtml() {
    const p = load(), r = rank(p.stars), s = streakInfo(p);
    return `${esc(p.avatar)} <b>${esc(p.name || "Explorer")}</b> <span class="muted">${r.icon} ${r.name}</span>
      <span>⭐ <b class="stars">${p.stars}</b></span><span>🔥 <b>${s.current}</b><span class="muted"> day${s.current === 1 ? "" : "s"}</span></span>`;
  }
  function mountBar() {
    if (document.body.hasAttribute("data-no-bar") || document.getElementById("arc-bar")) return;
    injectStyle();
    const a = document.createElement("a"); a.id = "arc-bar"; a.className = "arc-bar"; a.href = BASE + "#profile"; a.title = "Open my profile";
    a.innerHTML = barHtml();
    document.body.insertBefore(a, document.body.firstChild);
  }
  function updateBar() { const a = document.getElementById("arc-bar"); if (a) a.innerHTML = barHtml(); }
  function pulseBar() { const a = document.getElementById("arc-bar"); if (!a) return; a.classList.remove("pulse"); void a.offsetWidth; a.classList.add("pulse"); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountBar); else mountBar();

  return {
    GAMES, BADGES, RANKS, get: load, rank, streakInfo, play, award, unlock, setIdentity, reset, exportAll, importAll, onChange,
    toast, today, base: BASE,
    _setClock(fn) { clock = fn || (() => new Date()); },     // for tests
  };
})();
