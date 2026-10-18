# Brain Arcade

A collection of small educational browser games for kids. Each game is plain HTML, CSS and JavaScript with no build step.

| Game | What it teaches |
| --- | --- |
| Planet Hopper | Space facts and the solar system |
| Dungeon Math Quest | Addition, subtraction, times tables, division |
| Word Wizard | Spelling and vocabulary |
| Typing Racer | Typing speed and accuracy |
| Number Bridge Builder | Missing-number equations, including two-step puzzles |
| Hangman Heroes | Vocabulary and spelling (monster-chase style, no gallows) |
| Pattern Detective | Spotting rules in shape and number sequences |
| Story Mixer | Creative writing, vocabulary "power words", and reading aloud |

## Play

Online (GitHub Pages): https://jaikishangurav.github.io/brain-arcade/

Locally, serve the folder. The hub and the games that have their content inside the page can be opened straight from disk, but Planet Hopper, Word Wizard, Hangman Heroes, Typing Racer and Story Mixer load JSON files, which browsers block on `file://` pages, so use a server:

```bash
python3 -m http.server 8800
```

Then open http://localhost:8800.

## Structure

```
index.html            hub page: profile, games and badges
profile.js            shared profile, stars, badges and daily streak
shared.css            shared colours, buttons and animations
shared.js             helpers shared by the games that load JSON data
games/<game-name>/    one folder per game, each with an index.html (and a data file if it has one)
```

## Profile, stars and streaks

Every game feeds one shared profile, kept in the browser's local storage (no accounts, no server). `profile.js` holds it, and the home page shows it.

- **Name and avatar:** chosen on the home page the first time. A small bar at the top of every game shows his name, rank, stars and streak, and links back to the profile.
- **Stars:** each game awards stars for finished things, shown as a small pop-up.

  | Game | Stars |
  | --- | --- |
  | Planet Hopper | 5 for a new world, 2 for a revisit, +10 for each tour completed |
  | Dungeon Math Quest | 1 per room cleared, +5 for beating the dragon |
  | Word Wizard | 1 per word spelled, +2 to +6 for the rank reached |
  | Typing Racer | 5 / 3 / 2 / 1 for 1st to 4th, +1 for 95% accuracy |
  | Number Bridge Builder | 2 plus lives left for a crossing, 1 for a collapse after 4+ planks |
  | Hangman Heroes | 1 per save (2 if flawless), +3 every 5 in a row |
  | Pattern Detective | 1 per clue, +3 and +1 per magnifying glass left for closing a case |
  | Story Mixer | 2 for each of the first 5 parts he writes, 1 for saving a story |

- **Ranks:** Cadet, Pilot (25 stars), Navigator (75), Captain (150), Commander (300) and Admiral (500).
- **Daily streak:** any day he starts a game or earns a star counts. Playing on consecutive days builds the streak ("3 days in a row!"), and missing a day starts it again from 1 (the best streak is remembered). Days use the device's local date.
- **Badges:** 30 in total. Some are general (star totals, streaks, trying 4 or all 8 games) and some belong to a game (Dragon Slayer, Perfect Spell, Racing Champion, Story Author and more). The home page shows earned badges in colour and locked ones greyed out with what to do to earn them.
- **Backup:** the home page can download a backup file with his profile, scores, custom words, questions, heroes and saved stories, and restore it in another browser. This is the way to move progress between devices, since nothing is stored online.

Because the profile lives in local storage, it belongs to one browser on one device. Clearing the browser's site data erases it, so a backup now and then is a good idea.

### Using the profile in a game

```html
<script src="../../profile.js"></script>
```

```js
Profile.play("my-game");                     // a round started (counts toward the daily streak)
Profile.award("my-game", 3, "Level cleared"); // give stars, with a short reason for the pop-up
Profile.unlock("my-badge-id");               // give a badge once
```

Add the game to `GAMES` and any new badges to `BADGES` in `profile.js` so they show on the home page. A page can opt out of the top bar with `<body data-no-bar>`, as the home page does.

## Game data

Five games keep their content in JSON files, so you can add more without touching the code:

| File | Contents |
| --- | --- |
| `games/planet-hopper/data/` | `planets.json` (13 destinations) and `questions.json` (70 questions). See its own README |
| `games/word-wizard/words.json` | A list of `{ "word", "category", "clue" }` entries (138 words) |
| `games/hangman-heroes/words.json` | Category names mapped to lists of capital-letter words (120 words) |
| `games/typing-racer/words.json` | `easy`, `medium` and `hard` lists of lowercase words (108 words) |
| `games/story-mixer/story.json` | Heroes, places, problems, helpers, power words, silly things, sounds, endings and the sentence templates |

Because the games load these files, open them through a server (see Play above). The `file://` double-click method is blocked by browsers, and the games show a message explaining this.

### Adding content

Word Wizard: append an entry such as

```json
{ "word": "NEBULA", "category": "Space", "clue": "A giant cloud of gas and dust where stars are born" }
```

The word is 3 to 12 capital letters, it appears only once, and the clue must not contain the word. Words are grouped by length into easy (up to 5 letters), medium (6) and hard (7 or more), and a game starts easy and gets harder.

Hangman Heroes: add a word (3 to 14 capital letters) to a category list, or add a new category whose name starts with an emoji.

Typing Racer: add lowercase words (2 to 14 letters) to a level. Medium races mix easy and medium words, and hard races mix medium and hard words.

Story Mixer: add to `heroes`, `places`, `problems` or `helpers` (the picker grows automatically, and new entries should go at the end so saved stories keep working). Templates use placeholders such as `{hero}`, `{desc}`, `{at}`, `{start}`, `{cause}`, `{solve}`, `{helper}`, `{power}`, `{adj}` and `{feel}`. Check each new piece by building a few stories, and avoid writing "a" before `{adj}`, since the adjective might start with a vowel.

Problems with an entry are reported in the browser console.

### Players can add their own

Each of these games has a screen for adding content in the browser. It is saved in that browser only and mixed in with the built-in content, and **Download as JSON** exports it in a format that can be pasted into the data files.

| Game | Where | What he can add |
| --- | --- | --- |
| Planet Hopper | ✏️ My questions | Quiz questions with 2 to 4 answers, for any trip or one destination |
| Word Wizard | ✏️ My words | Words with a category and clue. With 10 or more, he can play with only his own words |
| Hangman Heroes | ✏️ My words | A spelling list. With 3 or more, a "⭐ My words" category appears |
| Typing Racer | ✏️ My words | A spelling list. With 3 or more, a "⭐ My words" race appears |
| Story Mixer | ➕ Add my own hero | Himself, a friend or a pet, with a name, description and emoji |

`shared.js` holds the helpers these games share: safe text escaping, saving to the browser, loading JSON, downloading JSON, and the word-list editor used by Hangman Heroes and Typing Racer.

## Adding a game

1. Create `games/<name>/index.html` and link `../../shared.css`.
2. Add a "← Arcade" link back to `../../`.
3. Add a card to `index.html` with `data-game="<name>"` set to the folder name, so its stars show on the card.
4. Load `profile.js` and call `Profile.play`, `Profile.award` and `Profile.unlock` (see above).

Best scores are saved in the browser's local storage, with a separate key per game.

## Deploying to GitHub Pages

`.github/workflows/main.yml` publishes the whole repo to GitHub Pages on every push to `main`. It needs Settings → Pages → Source set to **GitHub Actions** (already done), and Pages on a private repo needs a paid plan. The site is at https://jaikishangurav.github.io/brain-arcade/.
