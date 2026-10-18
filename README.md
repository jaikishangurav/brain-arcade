# Brain Arcade

A collection of small educational browser games for kids. Each game is a single HTML file with no build step.

| Game | What it teaches |
| --- | --- |
| Planet Hopper (separate repo, linked) | Space facts |
| Dungeon Math Quest | Addition, subtraction, times tables, division |
| Word Wizard | Spelling and vocabulary |
| Typing Racer | Typing speed and accuracy |
| Number Bridge Builder | Missing-number equations, including two-step puzzles |
| Hangman Heroes | Vocabulary and spelling (monster-chase style, no gallows) |
| Pattern Detective | Spotting rules in shape and number sequences |

## Play

Double-click `index.html`, or serve the folder:

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

## Adding a game

1. Create `games/<name>/index.html` and link `../../shared.css`.
2. Add a "← Arcade" link back to `../../`.
3. Add a card to `index.html`. Replace a "Coming soon" card if there is one.

Best scores are saved in the browser's local storage, with a separate key per game.

## Deploying to GitHub Pages

Use the same Actions workflow as Planet Hopper: Settings → Pages → Source: GitHub Actions, then a workflow that uploads the repo root (`path: .`) and deploys on pushes to `main`.
