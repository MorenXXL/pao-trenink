# PAO Trénink

Webová aplikace pro trénink paměti pomocí mnemotechnických systémů (PAO —
Person-Action-Object, malý systém, binární kódování, hrací karty a vlastní
sekvence). Interní osobní nástroj Karla Izery, nasazený na Vercelu.

## Co to umí

- **Velký systém (PAO)** — čísla 00–99 ↔ osoba/akce/objekt.
- **Malý systém** — dvojčíslí ↔ slovo.
- **Karetní systém** — karta → PAO (osoba + číslo), 3 karty ↔ PAO.
- **Binární systém** — 3bitové kódy ↔ číslo, sekvence ↔ PAO/slovo, převodník textu na UTF-8.
- **Uložené sekvence** — pevně dané sekvence k procvičování (rodná čísla, telefon, π…).
- **Statistiky** — rekordy, průměry, počty a mezitýdenní trend (kalendářní týden Po–Ne).
- **CVIČIT** — nabídne cvičení, které tento týden ještě neproběhlo (priorita: nestihnuté z minula, zhoršené).

## Technologie

- **React 18** + **Vite 4** + **Tailwind CSS 3**, ikony `lucide-react`.
- **Bez backendu.** Referenční data jsou napevno v kódu (`src/data/constants.js`);
  rekordy, statistiky a lokální import sekvencí drží `localStorage`.
- Hosting: **Vercel** (statický build + SPA fallback, viz `vercel.json`),
  automatické nasazení z větve `main`.

## Spuštění

```bash
npm install
npm run dev      # dev server (Vite)
npm run build    # produkční build do dist/
npm run preview  # náhled produkčního buildu
```

## Nasazení

Push do `main` → Vercel automaticky sestaví a nasadí. Žádný ruční deploy krok.

## Dokumentace

Viz [`docs/`](docs/): [architecture.md](docs/architecture.md) (skladba),
[decisions.md](docs/decisions.md) (kniha změn a rozhodnutí),
[standard-dokumentace.md](docs/standard-dokumentace.md) (standard napříč repy).
Kontext pro AI agenty: [CLAUDE.md](CLAUDE.md), [KAREL.md](KAREL.md), [COLONY.md](COLONY.md).
