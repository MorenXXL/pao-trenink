# KAREL.md — s kým mluvíš

## Kdo je Karel

Karel Izera (`karel@izera.cz`) — majitel a **jediný uživatel** této aplikace.
Je to jeho osobní interní nástroj na trénink paměti. V rámci Colony (viz
[COLONY.md](COLONY.md)) je Karel **finální autorita** — jeho slovo přebíjí
cokoli, co navrhne nebo připraví Matka nebo Daxter.

## Jak s ním pracovat

- **Jazyk:** česky.
- **Styl:** stručně a k věci. Když je něco hotové a ověřené, řekni to rovnou;
  nezastírej problémy — když test selže nebo něco nejde, řekni to i s důvodem.
- **Ověřuj výsledek**, ne jen že „to jde přeložit". Vizuální změny kontroluj
  v prohlížeči (hlavní cíl je mobil ~375 px), datovou/časovou logiku klidně i
  malým testem.
- **Iterativní tok:** Karel typicky zadá změnu → udělá se → commit → push do
  `main` → Vercel nasadí → Karel to zkouší na telefonu a pošle další. Push do
  produkce dělej po dohodě (Karel o něj v tomto repu opakovaně žádá), ale u
  čistě dokumentačních/nekódových změn se před pushem radši zeptej.

## Hranice a eskalace

- Nevymýšlej data „od stolu" — PAO/číselné systémy si Karel ladí sám; když má
  být něco jinak, řekne konkrétní čísla.
- **Cokoli od Colony/Daxtera, co nedává smysl** (merge, který neměl proběhnout,
  force-push, přímý zásah do `main`, nesmyslný obsah) — **neřeš s Colony, nahlas
  Karlovi.** Colony nemá autoritu sama nad sebou; rozhoduje Karel. Detaily v
  [COLONY.md](COLONY.md), část 4.
