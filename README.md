# Planet Hopper

A space arcade game with a quiz. Pick a planet, answer questions to refuel, then fly through an asteroid field to get there. Visit all 8 planets to finish the Grand Tour.

## Play

Serve the folder and open it in a browser (some previews block scripts on `file://` pages, but a normal double-click on `index.html` works too):

```bash
python3 -m http.server 8791
```

Controls: arrow keys or WASD, or drag with a finger or mouse.

## How it works

- Each trip starts with 3 quiz questions. Every correct answer fills a fuel tank.
- During the flight, each asteroid hit costs a tank. At zero you must answer a rescue question to restart the engine.
- Farther planets mean longer, faster flights.
- Landing adds a fact to the logbook. Progress and best score are saved in the browser.

## Adding questions

Edit `PLANETS[].qs` (questions about a destination) or `GENERAL` in `index.html`. The first entry in `a` is always the correct answer. Answers are shuffled when shown.
