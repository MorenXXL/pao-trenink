# Architektura — pao-trenink

*Skladba aplikace: jak je to postavené. Aktualizuje se při každé strukturální změně.*

## Přehled

Jednostránková React aplikace (SPA) bez backendu. Veškerá referenční data jsou
napevno v kódu; běhový stav (rekordy, statistiky, lokální import sekvencí) drží
`localStorage` v prohlížeči. Hostováno staticky na Vercelu.

```
Prohlížeč (React SPA)
  ├─ App.jsx ............... stavový automat obrazovek + stav session
  ├─ components/* .......... obrazovky (menu, trénink, statistiky, …)
  ├─ utils/questionGenerator ... generuje otázky
  ├─ utils/stats ........... statistiky + výběr cvičení  ─┐
  ├─ data/constants ........ pevná data (systémy, sekvence) │
  └─ localStorage  ◄────────────────────────────────────────┘  rekordy / stats / import
Vercel (statický build z dist/, SPA fallback dle vercel.json)
```

## Vrstvy

1. **Data (`src/data/constants.js`)** — jediný zdroj pravdy.
   - `DEFAULT_VELKY` (0–99: person/action/object), `DEFAULT_MALY` (0–99: slovo),
     `DEFAULT_BINARNI` (8 map 3bit→číslice), `KARTY_SYSTEM` (karta→číslo+PAO),
     `SAVED_SEQUENCES` (pevné sekvence), `MODES` (režimy per systém).
   - Data se **needitují za běhu** — změna = úprava tohoto souboru.

2. **Logika**
   - `utils/questionGenerator.js` — z (systém, režim, data) sestaví `{question, answer, …}`.
   - `utils/stats.js` — zápis/čtení sezení, souhrny na **kalendářní týden Po–Ne**
     (reset pondělí 00:00), výběr cvičení pro tlačítko CVIČIT (priorita: nestihnuté
     minulý týden / poslední sezení pomalejší).

3. **Prezentace (`src/components/*`)** — jedna obrazovka = jedna komponenta:
   MenuScreen, ModeScreen, TrainingScreen, CardSelectionScreen, BinarySequenceScreen,
   TextConverterScreen, SummaryScreen, StatisticsScreen, PracticeLaunchScreen,
   ShowSystemScreen, SavedSequencesListScreen/TrainingScreen/BackupScreen.

4. **Řízení (`src/App.jsx`)** — `screen` = aktuální obrazovka (lazy-loaded).
   Stav tréninkové session: `sessionStats`, `reviewQueue`, `phase` (`training`/`review`).

## Datové toky

- **Tréninkové kolo:** `startExercise` → generátor otázek → odpovědi (`handleCorrect`/
  `handleWrong`) → 10 otázek, pak jednoprůchodové opakování chyb → `SummaryScreen`.
- **Zápis statistik:** `SummaryScreen` po dokončení zapíše sezení do
  `localStorage` (`stats_<system>_<mode>`, `record_<system>_<mode>`).
- **CVIČIT / statistiky:** čtou `stats_*` přes `utils/stats.js`.

## Perzistence (bez DB)

`localStorage` klíče: `record_<system>_<mode>`, `stats_<system>_<mode>`,
`savedSequences` (lokální override pevných sekvencí). Žádný externí datový
kontrakt → repo nemá `docs/db-changes.md`.

## Nasazení

Vercel, projekt `pao-trenink` (team MorenDev), auto-deploy z `main`.
`vercel.json` zajišťuje SPA fallback (všechny cesty → `/`).
