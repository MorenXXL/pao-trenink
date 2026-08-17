<!--
  UNIVERZÁLNÍ varianta pro všechny Karlovy repozitáře (mimo Iter, který má
  vlastní soubor iter.md). Jediný placeholder: pao-trenink.
-->

# COLONY.md — kdo je Colony a co dělá v tomto repozitáři

*Tento soubor sem vložil Karel ručně. Není součástí žádného Colony procesu
a Colony si ho sama needituje — pokud potřebuje aktualizaci, provede ji
zase jen Karel. Cílový čtenář je Code agent (např. Claude Code), který
pracuje na repozitáři **pao-trenink**.*

## 1. Kdo je Colony a kdo je Matka

Colony je organizace AI agentů, kterou Karel staví jako samostatný projekt
vedle svých ostatních produktů. V jejím čele stojí **Matka** — není to
programátorka ani technická expertka, je to organizátorka. Přebírá cíle,
rozděluje je na úkoly, spouští specializované agenty (stavitele, revizory,
analytiky...), kteří odbornou práci skutečně dělají, a vyhodnocuje
výsledky. Pokud se v tomto repozitáři něco od Colony objeví, stálo za tím
rozhodnutí Matky — nejčastěji provedené jedním konkrétním agentem jménem
Daxter (viz část 2).

Colony žije ve svém vlastním, privátním repozitáři (`colony-os`),
odděleném od tohoto i od jakéhokoli jiného Karlova projektu. Všechno, co
Colony dělá — rozhodnutí, zkušenosti, denní reporty — se zapisuje tam do
gitu, ne sem. Tento soubor je jediná stopa Colony, kterou uvidíš přímo
v tomto repozitáři; pokud chceš dohledat, proč a na čí pokyn ke změně
došlo, zdroj pravdy jsou reporty v `colony-os` (adresář `reports/`), ne
komentáře v kódu.

## 2. Co tady Colony dělá

**Hlášení bugů chodí přes sběrače** — dnes je prvním sběračem Iter
(úkoly ve formátu „report chyby"); další sběrače budou postupně přibývat
do dalších produktů. Dokud tento repozitář vlastní sběrač nemá, chodí
hlášení o něm přes Karla. Colony hlášení čte dávkově a teprve po ověření
a zařazení do repozitáře, ve kterém chyba skutečně je, se pustí do opravy
přímo tady.

**Přístup ke kódu** tohoto repozitáře je fine-grained GitHub token, per
repozitář (ne jeden sdílený přístup pro všechna repa) — vydává ho výhradně
Karel. Práva se zavádí postupně, podle toho, jak dlouho proces běží:
nejdřív jen čtení, pak možnost navrhnout opravu na vlastní větvi (pull
request), a teprve po „zaběhnutí" procesu (viz část 3) i právo mergovat
drobné opravy. Pokud v tomto repozitáři zatím nevidíš žádnou stopu
Daxtera, znamená to jen, že se přístup ještě nezavedl nebo je zatím
jen čtecí — ne že tahle dohoda neplatí.

Opravy chyb dělá agent s přezdívkou **Daxter — The Bug Sweeper**.
Aktivitu Colony v tomto repozitáři uvidíš prakticky vždy jako aktivitu
Daxtera.

Daxter dodržuje vždy, bez výjimky:

- **Konvence commitů:** podpis „Daxter (Colony)" + odkaz na hlášení/task
  v Iteru, ze kterého oprava vzešla.
- **Konvence větví:** `colony/daxter-fix-NNN`.
- **Nikdy force-push.**
- **Nikdy přímý zásah do `main`** bez procesu popsaného v části 3.
- **Změnové logy psané tak, aby se v nich vyznal Code agent** — Karel to
  zadal výslovně: změnové logy jsou rozhraní mezi Colony a jeho vývojem,
  čitelnost pro tebe je požadavek, ne nice-to-have.

## 3. Třídy změn a kdo schvaluje

Playbook Daxtera rozlišuje dvě třídy oprav:

| | Textová / drobná | Systémová |
|---|---|---|
| Definice | neovlivňuje strukturu (text, formátování, jedna hodnota, drobná validace) | mění strukturu/chování (datový model, API kontrakt, autentizace, platby, build/deploy, závislosti) |
| Postup | oprava na vlastní větvi → test → merge | oprava na vlastní větvi → test → **návrh + odůvodnění Karlovi, merge dělá on nebo výslovně schvaluje — nikdy automaticky** |
| Kdo mergne | Colony sama, ale jen poté, co proces „zaběhl" (5 po sobě schválených drobných oprav bez vrácení + aspoň týden reálného provozu) | vždy Karel |

U nejednoznačných případů (malý rozsah, ale zásah do logiky) platí
konzervativní výchozí zařazení: systémová.

Merge práva na drobné opravy se navíc zavádí **repozitář po repozitáři**
podle toho, kde se proces skutečně osvědčil — ne plošně. To, že Daxter už
smí mergovat drobné opravy v jiném repozitáři, samo o sobě neznamená totéž
pro tenhle.

**Dvojitá kontrola je vždy stejná:** Daxter si opravu sám ověří a otestuje
na vlastní větvi (první kontrola), a teprve pak jde na merge, buď přes
Karlovo schválení, nebo — u drobných oprav po zaběhnutí procesu — přes
branch protection nastavené na straně GitHubu tak, aby merge drobných
oprav Colony vůbec technicky umožnilo (druhá kontrola). Karel je ve
všech případech finální autorita — jeho slovo přebíjí cokoli, co Daxter
navrhl nebo připravil.

## 4. Kde je audit a jak eskalovat

- **`mcp_access_log`** — audit log Iter MCP serveru, přes který Colony
  čte a zapisuje hlášení chyb (i ta, která se týkají tohoto repozitáře).
  Zaznamenává, kdo/jaká role, který nástroj, kdy, kolik řádků vrátil.
- **Historie větví a PR v tomto repozitáři na GitHubu** — každá oprava
  Daxtera je vidět přímo tady, ve vlastní historii repozitáře, se
  standardní konvencí commitů a větví z části 2.
- **Změnové logy** — Daxter je píše u každé opravy.
- **Denní reporty Colony** (`colony-os/reports/`) — zachycují každé
  rozhodnutí, i to, proč k němu došlo.

Pokud se ti něco od Colony/Daxtera nezdá — merge, který neměl proběhnout,
force-push, přímý zásah do `main`, nebo obsah, který nedává smysl —
**neřeš to přímo s Colony**. Colony nemá autoritu sama nad sebou; jedinou
autoritou je Karel. Nahlas mu to — on rozhodne, jestli Colony zastavit,
vrátit změnu, nebo požádat o vysvětlení.

## 5. Co Colony prosí od Code agenta

- **Hlas strukturální změny datových kontraktů.** Pokud tenhle repozitář
  má vlastní datový model/schéma/API, na kterém závisí i něco mimo něj,
  osvědčil se v Iteru vzor souboru `docs/db-changes.md` — dopředu
  varuje každého čtenáře (včetně Daxtera), že se mění kontrakt. Pokud
  pro tento repozitář takový soubor ještě nemáš, klidně ho založ, ať má
  Daxter i Karel kam se podívat, než se pustí do opravy.
- **Udržuj si vlastní changelog** svých změn — pomůže to i Daxterovi,
  kdyby někdy potřeboval pochopit historii souboru, který zrovna opravuje.
- **Respektuj větve `colony/*`.** Nepřepisuj je ani nemaž bez koordinace —
  pokud se s tvou prací kříží, řeš to přes Karla, ne přímým zásahem.

---
*Vyplněno pro: pao-trenink (univerzální varianta) · datum: 2026-08-17 ·
vyplnila: Colony (Matka) a vložila do repozitáře na výslovný pokyn Karla
(chat 17. 8. 2026, dohledatelně v colony-os) — aktualizace zase jen na
pokyn Karla.*
