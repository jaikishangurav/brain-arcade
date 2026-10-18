# Planet Hopper

A space arcade game with a quiz. Pick a planet, answer questions to refuel, then fly through an asteroid field to get there. Visit all 8 planets to finish the Grand Tour, then explore the bonus moons and dwarf planets for the Deep Space Tour.

## Play

Online (GitHub Pages): https://jaikishangurav.github.io/planet-hopper/

Locally, serve the folder and open it in a browser. The game loads its questions from `data/*.json`, and browsers block that when a page is opened straight from disk (`file://`), so double-clicking `index.html` will not work.

```bash
python3 -m http.server 8792
```

Then visit http://localhost:8792. If the port is busy, use any other free port.

Controls: arrow keys or WASD, or drag with a finger or mouse.

## How it works

- Each trip starts with 3 quiz questions. Every correct answer fills a fuel tank (up to 3). If all are wrong, mission control gives a small emergency tank.
- During the flight, each asteroid hit costs a tank. At zero you must answer a rescue question to restart the engine.
- Farther destinations mean longer, faster flights.
- **Bonus worlds:** the Moon, Ceres, Europa, Titan and Pluto sit in a second row on the map, each with its own questions and logbook fact. Visiting all 5 completes the Deep Space Tour.
- Landing adds a fact to the logbook (+100 points). Progress and best score are saved in the browser's local storage.

## Game data

All content lives in two JSON files, so you can add to it without touching the code:

| File | Contents |
| --- | --- |
| `data/planets.json` | The destinations in route order: `id`, `color`, `fact`, and optional `ring`, `sub`, `pos`, `bonus` |
| `data/questions.json` | `general` questions plus `destinations`, a map from a destination `id` to its questions |

The game currently has 70 questions: 29 general and 41 about specific destinations.

### Adding a question

Add an object to `general` (asked on any trip) or to the list for a destination in `destinations` (asked on trips to that place). The first entry in `a` is always the correct answer, and the game shuffles the answers when it shows them.

```json
{ "q": "Question text?", "a": ["Correct answer", "Wrong 1", "Wrong 2", "Wrong 3"], "e": "Explanation shown after answering." }
```

A refuel picks up to 2 questions about the destination plus general ones, and avoids repeats until the pool runs out. Bad entries (missing text, fewer than 2 answers, duplicate answers) are reported in the browser console.

### Adding a destination

Append an entry to `data/planets.json` and add a list for it under `destinations` in `data/questions.json`. Keep the order, because progress is saved by position. Entries from the first one marked `"bonus": true` onwards appear in the bonus row. `sub` is the small label under the name, and `pos` is where it sits on the route (Earth is 2, Mars is 3, and so on), which sets the flight time.

## Writing your own questions

Click **✏️ My questions** at the top of the game to write questions in the browser: the question, the right answer, 1 to 3 wrong answers, an optional fun fact, and whether it appears on any trip or only for one destination. They are saved in this browser and mixed in with the built-in questions.

Use **Download as JSON** to export them in the same format as `data/questions.json`, so they can be pasted into the data file and shared with everyone.

## Deploying to GitHub Pages

The game is a static site, so it is hosted on GitHub Pages with a GitHub Actions workflow (`.github/workflows/`).

1. In the repo, go to Settings → Pages and set **Source** to **GitHub Actions**. Pages on private repos needs a paid GitHub plan, otherwise make the repo public.
2. The workflow checks out the repo, runs `actions/configure-pages`, `actions/upload-pages-artifact` (with `path: .`) and `actions/deploy-pages`, on pushes to `main`. It needs `pages: write` and `id-token: write` permissions.
3. Push to `main`. The site is published at `https://<your-username>.github.io/planet-hopper/`.

## Ideas for next steps

- More bonus worlds (Io, Ganymede, Triton, Charon)
- Sound effects
- Difficulty tiers by age
