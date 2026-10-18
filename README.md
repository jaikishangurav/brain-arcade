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

Locally, serve the folder. Most games also work when `index.html` is opened straight from disk, but Word Wizard loads `words.json`, which browsers block on `file://` pages, so use a server:

```bash
python3 -m http.server 8800
```

Then open http://localhost:8800.

## Structure

```
index.html            hub page listing every game
shared.css            shared colours, buttons and animations
games/<game-name>/    one folder per game, each with an index.html
```

## Game data

Word Wizard keeps its words in a JSON file so you can add more without touching the code.

| File | Contents |
| --- | --- |
| `games/word-wizard/words.json` | A list of `{ "word", "category", "clue" }` entries (138 words today) |

To add a word, append an entry such as:

```json
{ "word": "NEBULA", "category": "Space", "clue": "A giant cloud of gas and dust where stars are born" }
```

Rules: the word is 3 to 12 capital letters, it appears only once, and the clue must not contain the word. Words are grouped by length into easy (up to 5 letters), medium (6) and hard (7 or more), and a game starts easy and gets harder. Problems with an entry are reported in the browser console.

### Writing your own words

Click **✏️ My words** on the Word Wizard start screen to add words in the browser. They are saved in this browser and mixed in with the built-in ones. Once there are 10 or more, an option appears to play with only your own words. **Download as JSON** exports them in the same format as `words.json`, ready to be pasted into the file.

## Adding a game

1. Create `games/<name>/index.html` and link `../../shared.css`.
2. Add a "← Arcade" link back to `../../`.
3. Add a card to `index.html`. Replace a "Coming soon" card if there is one.

Best scores are saved in the browser's local storage, with a separate key per game.

## Deploying to GitHub Pages

Use the same Actions workflow as Planet Hopper: Settings → Pages → Source: GitHub Actions, then a workflow that uploads the repo root (`path: .`) and deploys on pushes to `main`.
