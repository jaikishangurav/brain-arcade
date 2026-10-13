# Planet Hopper

A space arcade game with a quiz. Pick a planet, answer questions to refuel, then fly through an asteroid field to get there. Visit all 8 planets to finish the Grand Tour, then explore the bonus moons and dwarf planets for the Deep Space Tour.

## Play

Double-click `index.html`, or serve the folder and open it in a browser:

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

## Adding questions

The game has 46 questions: 28 about specific destinations (`PLANETS[].qs`) and 18 general ones (`GENERAL`), all in `index.html`. Each question looks like this:

```js
{ q: "Question text?", a: ["Correct answer", "Wrong 1", "Wrong 2", "Wrong 3"], e: "Explanation shown after answering." }
```

The first entry in `a` is always the correct answer. Answers are shuffled when shown. Refuelling picks up to 2 questions about the destination plus general ones, and avoids repeats until the pool runs out.

## Adding a destination

Append an entry to `PLANETS` (keep the order, since progress is saved by position) with `id`, `color`, `fact` and `qs`. Entries after the first `MAIN_COUNT` (8) appear in the bonus row. Give them a `sub` label and a `pos` number, which is where they sit on the route (Earth is 2, Mars is 3, and so on) and sets flight time.

## Deploying to GitHub Pages

The game is a static site, so it can be hosted on GitHub Pages with a GitHub Actions workflow.

1. In the repo, go to Settings → Pages and set **Source** to **GitHub Actions**. Pages on private repos needs a paid GitHub plan, otherwise make the repo public.
2. Add `.github/workflows/deploy.yml` that checks out the repo, runs `actions/configure-pages`, `actions/upload-pages-artifact` (with `path: .`) and `actions/deploy-pages`, triggered on pushes to `main`. It needs `pages: write` and `id-token: write` permissions.
3. Push to `main`. The site is published at `https://<your-username>.github.io/planet-hopper/`.

## Ideas for next steps

- More bonus worlds (Io, Ganymede, Triton, Charon)
- Sound effects
- Difficulty tiers by age
- Let him write his own questions
