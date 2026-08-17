# CLAUDE.md — jak se pracuje v tomto repu

Kontext pro Code agenta (Claude Code apod.) pracujícího na **pao-trenink**.
Přečti v tomto pořadí: **CLAUDE → KAREL → COLONY → docs/architecture → docs/decisions**.

## Co to je

React SPA pro trénink paměti (PAO / malý / binární / karetní systém + sekvence).
Osobní interní nástroj jednoho uživatele (Karel). Detaily viz [README.md](README.md).

## Stack a příkazy

- React 18 + Vite 4 + Tailwind 3, `lucide-react`.
- `npm run dev` (dev server), `npm run build` (build), `npm run preview`.
- **Nasazení = push do `main`** → Vercel staví a nasazuje automaticky. Není žádný ruční deploy.

## Mapa kódu

- `src/App.jsx` — kořen. Jednoduchý stavový automat obrazovek (`screen`) + stav
  tréninkové session (`sessionStats`, `reviewQueue`, `phase` = training/review).
  Obrazovky jsou lazy-loaded.
- `src/data/constants.js` — **jediný zdroj pravdy pro data**: `DEFAULT_VELKY`
  (0–99), `DEFAULT_MALY` (0–99), `DEFAULT_BINARNI` (8 map), `KARTY_SYSTEM`,
  `MODES`, `SAVED_SEQUENCES`. Data jsou **napevno** — mění se jen zde v kódu.
- `src/utils/questionGenerator.js` — generování otázek podle systému/režimu.
- `src/utils/stats.js` — statistiky a výběr cvičení v `localStorage` (kalendářní týden Po–Ne).
- `src/components/*` — jedna obrazovka = jedna komponenta.

## Datová vrstva (bez DB)

- **Žádný backend ani databáze.** Firebase byl odstraněn (viz decisions).
- `localStorage` klíče:
  - `record_<system>_<mode>` — nejlepší čas.
  - `stats_<system>_<mode>` — historie sezení (pole `{t,n,best,avg}`) pro statistiky.
  - `savedSequences` — lokální import, který přebíjí `SAVED_SEQUENCES` z kódu.
- Protože repo nemá datový kontrakt sdílený zvenčí, **nemá `docs/db-changes.md`**.

## Konvence

- Commit zprávy odkazují D-číslo z [docs/decisions.md](docs/decisions.md), kam se
  zapisuje každá netriviální změna (`D-NNN · datum · co · proč · dopad`).
- Po strukturální změně aktualizuj [docs/architecture.md](docs/architecture.md).
- Změny od Colony/Daxtera poznáš podle větví `colony/*` a podpisu „Daxter (Colony)"
  v commitech — viz [COLONY.md](COLONY.md).

## Na co pozor (tabu / pasti)

- **Tailwind paleta:** vlastní barvy `primary/success/danger/warning` mají v
  `tailwind.config.js` plné škály 50–900. Nezužuj je zpět na 500/600 — dřív
  chyběly odstíny a barevné třídy tiše nefungovaly (D-001).
- **Data needituj za běhu** — žádná in-app editace systémů; změna = úprava
  `constants.js` a nový build.
- Ověřuj vizuální změny v prohlížeči (mobil 375px je hlavní cíl), ne jen buildem.
