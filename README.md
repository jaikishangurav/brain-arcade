# Brain Arcade

A collection of small educational browser games for kids. Each game is plain HTML, CSS and JavaScript with no build step.

| Game | What it teaches |
| --- | --- |
| Planet Hopper (separate repo, linked) | Space facts |
| Dungeon Math Quest | Addition, subtraction, times tables, division |
| Word Wizard | Spelling and vocabulary |
| Typing Racer | Typing speed and accuracy |
| Number Bridge Builder | Missing-number equations, including two-step puzzles |
| Hangman Heroes | Vocabulary and spelling (monster-chase style, no gallows) |
| Pattern Detective | Spotting rules in shape and number sequences |
| Story Mixer | Creative writing, vocabulary "power words", and reading aloud |

## Play

Online (GitHub Pages): https://jaikishangurav.github.io/brain-arcade/

Locally, serve the folder. The hub and the games that have their content inside the page can be opened straight from disk, but Word Wizard, Hangman Heroes, Typing Racer and Story Mixer load JSON files, which browsers block on `file://` pages, so use a server:

```bash
python3 -m http.server 8800
```

Then open http://localhost:8800.

## Structure

```
index.html            hub page listing every game
shared.css            shared colours, buttons and animations
shared.js             helpers shared by the games that load JSON data
games/<game-name>/    one folder per game, each with an index.html (and a data file if it has one)
```

## Game data

Four games keep their content in JSON files, so you can add more without touching the code:

| File | Contents |
| --- | --- |
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
| Word Wizard | ✏️ My words | Words with a category and clue. With 10 or more, he can play with only his own words |
| Hangman Heroes | ✏️ My words | A spelling list. With 3 or more, a "⭐ My words" category appears |
| Typing Racer | ✏️ My words | A spelling list. With 3 or more, a "⭐ My words" race appears |
| Story Mixer | ➕ Add my own hero | Himself, a friend or a pet, with a name, description and emoji |

`shared.js` holds the helpers these games share: safe text escaping, saving to the browser, loading JSON, downloading JSON, and the word-list editor used by Hangman Heroes and Typing Racer.

## Adding a game

1. Create `games/<name>/index.html` and link `../../shared.css`.
2. Add a "← Arcade" link back to `../../`.
3. Add a card to `index.html`. Replace a "Coming soon" card if there is one.

Best scores are saved in the browser's local storage, with a separate key per game.

## Deploying to GitHub Pages

Use the same Actions workflow as Planet Hopper: Settings → Pages → Source: GitHub Actions, then a workflow that uploads the repo root (`path: .`) and deploys on pushes to `main`.
