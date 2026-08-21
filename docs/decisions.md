# Kniha změn a rozhodnutí — pao-trenink

Jediný běžící deník repa. Každý záznam: **D-NNN · datum · co · proč · dopad**.
Řada je per repo a navazuje (nikdy nepřečíslovávat). Commit zprávy odkazují D-číslo.
Změny od Colony zapisuje Daxter sem s vlastním D-číslem a podpisem „Daxter (Colony)".

---

## D-001 · 2026-08-17 · Založení knihy — stav repa ke sjednocení

**Co:** Úvodní záznam (kniha nesmí začínat prázdná). Zachycuje stav aplikace k datu
zavedení standardu dokumentace.

**Stav aplikace:**
- React 18 + Vite 4 + Tailwind 3 SPA, ikony `lucide-react`. **Bez backendu** —
  referenční data napevno v `src/data/constants.js`, běhový stav v `localStorage`
  (`record_*`, `stats_*`, `savedSequences`). Hosting Vercel, auto-deploy z `main`.
- Systémy/režimy: velký (PAO), malý, karetní, binární (vč. převodníku Text→UTF-8),
  uložené sekvence.
- Zavedené chování: tréninkové kolo o 10 otázkách + jednoprůchodové opakování chyb;
  auto-potvrzení správné odpovědi u karet a binárního vstupu; statistiky s rekordy,
  průměry a mezitýdenním trendem po **kalendářním týdnu Po–Ne**; tlačítko **CVIČIT**
  (nabídne cvičení neprocvičené tento týden, priorita nestihnutým z minula a
  zhoršeným); přehledné porovnání chybné binární odpovědi po dvojčíslích.
- **Barvy:** `tailwind.config.js` má vlastní palety `primary/success/danger/warning`
  s plnými škálami 50–900. Dříve chyběly odstíny (jen 500/600), takže třídy jako
  `text-danger-700`/`bg-success-50` tiše nefungovaly; doplnění škál to napravilo —
  škály **nezužovat zpět**.

**Proč:** Standard dokumentace (`docs/standard-dokumentace.md`) vyžaduje neprázdnou
knihu popisující aktuální stav.

**Dopad:** Referenční bod pro budoucí záznamy; žádná změna kódu.

---

## D-002 · 2026-08-17 · Sjednocení dokumentace dle standardu

**Co:** Zavedena povinná kostra dokumentace dle
[`docs/standard-dokumentace.md`](standard-dokumentace.md).
- **Stěhováno (`git mv`):** nic — v repu neexistovaly žádné starší doc soubory
  (ARCHITECTURE/DECISIONS/CHANGELOG/CONTEXT ani README). Historie se nepřepisovala.
- **Nově založeno:** `README.md`, `CLAUDE.md`, `KAREL.md` (kořen) a
  `docs/architecture.md`, `docs/decisions.md` (tento soubor) — s úvodními záznamy
  popisujícími aktuální stav.
- **Ponecháno:** `COLONY.md` (dodala Colony), `docs/standard-dokumentace.md`
  (referenční standard) — beze změny.
- **Vynecháno:** `docs/db-changes.md` — repo nemá databázi ani datový kontrakt
  sdílený zvenčí (jen `localStorage`); `adr/`, `assumptions.md`, `tech-debt.md`
  jsou volitelné a zatím nezakládány.

**Proč:** Jednotná struktura napříč Karlovými repy — čitelná stejně pro Code agenta,
Matku (monitoring) i Daxtera (opravy).

**Dopad:** Přidány dokumentační soubory; žádná změna aplikačního kódu ani chování.

---

## D-003 · 2026-08-21 · Karetní systém: „Karta → Číslo" nahrazeno „Karta → PAO"

**Co:** Režim `card-num` přejmenován na `card-pao` (`MODES.karty`,
`questionGenerator.js`). Otázkou zůstává karta, odpovědí je nově **osoba** (první
část PAO) a za ní číslo v závorce — např. `4♣ → Indiana Jones (44)`.

**Proč:** Trénink karet má vybavovat rovnou PAO postavu, ne jen holé číslo.

**Dopad:** Změna klíče režimu znamená nový klíč v `localStorage`
(`record_karty_card-pao`, `stats_karty_card-pao`); historie a rekordy původního
`card-num` se v přehledech už nezobrazují.
