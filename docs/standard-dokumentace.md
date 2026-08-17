# Jednotný standard dokumentace repozitářů (pokyn pro Code agenty)

*Vydává Karel na návrh Matky (Colony), 17. 8. 2026. Účel: každé repo čitelné stejným způsobem — pro Code agenty, pro Matku (monitoring) i pro Daxtera (opravy bugů). Standard staví na vzoru, který už ve většině rep existuje — cílem je sjednotit, ne přepisovat.*

---

## Povinná kostra (každé aktivní repo)

**Kořen:**
| Soubor | Účel |
|---|---|
| `README.md` | pro lidi: co to je, jak to spustit |
| `CLAUDE.md` | pro agenta: jak se v tomhle repu pracuje (proces, pravidla, tabu) |
| `KAREL.md` | s kým mluvíš: tón, hranice, co eskalovat |
| `COLONY.md` | *(dodá Colony)* kdo je Matka/Daxter, jak poznáš jejich změny, konvence větví `colony/*` |

**`docs/`:**
| Soubor | Účel | Pravidla |
|---|---|---|
| `architecture.md` | **skladba** — jak je to postavené: vrstvy, moduly, datové toky, závislosti | aktualizuje se při každé strukturální změně |
| `decisions.md` | **kniha změn a rozhodnutí** — jediný běžící deník repa | záznamy **D-NNN** (řada per repo, navazuje na existující čísla!), formát: `D-NNN · datum · co · proč · dopad`; commit zprávy odkazují D-číslo |
| `db-changes.md` | kniha změn databáze | jen repa s DB; **hlavička vyjmenovává datové kontrakty** (kdo tabulku čte zvenčí — např. Colony) a varování, že strukturální změna se hlásí |
| `adr/` | velká architektonická rozhodnutí (jedno = jeden soubor) | volitelné, ale doporučené u produktových rep |
| `assumptions.md`, `tech-debt.md` | předpoklady a dluh | doporučené |

**Malá/hobby repa (Linqa, karels-gym, runecrawl-web…):** stačí `README.md` + `docs/decisions.md`. Zbytek až podle růstu.

## Migrační pokyny (pro agenty — NEPŘEPISOVAT HISTORII)

1. **Existující obsah se stěhuje, nemaže:** kořenové `ARCHITECTURE.md`/`DECISIONS.md`/`CHANGELOG.md` (ordo, runecrawl-game, Maziacs, geosbirka) → `git mv` do `docs/` pod standardní jména; obsah beze změny, číslování pokračuje.
2. **`AGENT_CHANGELOG.md` (xinzuo)** → sloučit do `docs/decisions.md` (starší záznamy jako blok „historie před sjednocením"), `AGENT_CONTEXT.md` → obsah patří do `CLAUDE.md`/`architecture.md`.
3. **Kde soubor chybí, založ ho s úvodním záznamem D-001 (nebo navazujícím číslem)** popisujícím aktuální stav repa („stav ke sjednocení, datum") — kniha nesmí začínat prázdná.
4. **Session-logy / handovery / incidenty** (Iter-report, SM-web) zůstávají jako samostatné soubory v `docs/` — jsou to přílohy, ne náhrada deníku.
5. Speciální dokumenty (GREYBOX.md, master-plan, číselníky, webhook návody) **zůstávají** — standard je minimum, ne strop.
6. Po migraci zapiš do `decisions.md` jeden záznam: „D-NNN · sjednocení dokumentace dle standardu · co se přestěhovalo".

## Co z toho má kdo

- **Code agent:** stejná mentální mapa v každém repu; D-čísla dávají commitům kontext.
- **Matka:** monitoring čte `architecture.md` + `decisions.md` stejně všude; změny kontraktů hlídá přes `db-changes.md` hlavičky.
- **Daxter:** před opravou čte kostru v daném pořadí (CLAUDE → KAREL → COLONY → architecture → decisions → db-changes); **svoje změny zapisuje do `decisions.md` repa** s vlastním D-číslem + podpis „Daxter (Colony)".
