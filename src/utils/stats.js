// Per-exercise training history, stored in localStorage as `stats_<system>_<mode>`.
// Each entry: { t: timestamp, n: počet měřených správných odpovědí, best: nejlepší čas, avg: průměr sezení }.

import { MODES } from '../data/constants';

const MAX_HISTORY = 500;

// Pondělí 00:00 místního času pro daný okamžik (kalendářní týden Po–Ne).
function startOfWeek(ms) {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  const dow = (d.getDay() + 6) % 7; // Po=0 … Ne=6
  d.setDate(d.getDate() - dow);
  return d.getTime();
}

export const SYSTEM_TITLES = {
  velky: 'Velký systém (PAO)',
  maly: 'Malý systém',
  karty: 'Karetní systém',
  binarni: 'Binární systém'
};

// Režimy, které nejsou měřené cvičení (převodník).
const EXCLUDED_MODES = new Set(['text-utf8']);

export function recordSession(system, mode, session) {
  if (!system || !mode) return;
  const key = `stats_${system}_${mode}`;
  let arr = [];
  try {
    const raw = localStorage.getItem(key);
    arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) arr = [];
  } catch {
    arr = [];
  }
  arr.push({
    t: Date.now(),
    n: session.n || 0,
    best: typeof session.best === 'number' ? session.best : null,
    avg: typeof session.avg === 'number' ? session.avg : null
  });
  if (arr.length > MAX_HISTORY) arr = arr.slice(-MAX_HISTORY);
  try {
    localStorage.setItem(key, JSON.stringify(arr));
  } catch {
    /* localStorage plné / nedostupné – statistiku tiše přeskočíme */
  }
}

function getSessions(system, mode) {
  try {
    const raw = localStorage.getItem(`stats_${system}_${mode}`);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

// Vážený průměr časů (váha = počet měřených odpovědí v sezení).
function weightedAvg(sessions) {
  const timed = sessions.filter(s => s.n > 0 && typeof s.avg === 'number' && s.avg > 0);
  const totalN = timed.reduce((a, s) => a + s.n, 0);
  if (!totalN) return null;
  return timed.reduce((a, s) => a + s.avg * s.n, 0) / totalN;
}

export function summarizeExercise(system, mode, now = Date.now()) {
  const sessions = getSessions(system, mode);
  const timed = sessions.filter(s => s.n > 0 && typeof s.best === 'number');

  const best = timed.length ? Math.min(...timed.map(s => s.best)) : null;
  const avg = weightedAvg(sessions);
  const timesTrained = sessions.length;

  // Kalendářní týdny Po–Ne (reset v pondělí 00:00).
  const thisWeekStart = startOfWeek(now);
  const lastWeekStart = startOfWeek(thisWeekStart - 1);
  const inRange = (lo, hi) => sessions.filter(s => s.t >= lo && (hi == null || s.t < hi));

  const thisWeekCount = inRange(thisWeekStart, null).length;
  const lastWeekCount = inRange(lastWeekStart, thisWeekStart).length;
  const avgThis = weightedAvg(inRange(thisWeekStart, null));
  const avgLast = weightedAvg(inRange(lastWeekStart, thisWeekStart));

  let trend = null;
  if (avgThis != null && avgLast != null) {
    const d = avgLast - avgThis; // kladné = zrychlení (zlepšení)
    if (d >= 0.3) {
      trend = { tone: 'good', text: `Zlepšení o ${d.toFixed(1)} s oproti minulému týdnu – dobrá práce, pokračuj!` };
    } else if (d <= -0.3) {
      trend = { tone: 'bad', text: `Zhoršení o ${Math.abs(d).toFixed(1)} s oproti minulému týdnu – zkus přidat.` };
    } else {
      trend = { tone: 'neutral', text: 'Stagnace – výsledek se drží, piluj dál.' };
    }
  } else if (avgThis != null) {
    trend = { tone: 'neutral', text: 'Tento týden rozjeto – jen tak dál!' };
  } else if (timed.length) {
    trend = { tone: 'idle', text: 'Tento týden jsi to necvičil – zkus to oprášit.' };
  }

  return { best, avg, timesTrained, thisWeekCount, lastWeekCount, trend, hasData: timesTrained > 0 };
}

// Skupiny cvičení (systém + jeho měřené režimy) pro výpis statistik.
export function getExerciseGroups() {
  return Object.entries(MODES)
    .map(([system, modes]) => ({
      system,
      title: SYSTEM_TITLES[system] || system,
      modes: modes.filter(m => !EXCLUDED_MODES.has(m.mode))
    }))
    .filter(g => g.modes.length > 0);
}

export function clearStats(system) {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(`stats_${system}_`)) localStorage.removeItem(key);
  });
}

// Vybere náhodné cvičení, které tento týden ještě neproběhlo.
// Přednost mají cvičení nestihnutá minulý týden a ta, kde se výsledek zhoršil.
// `excludeKey` umožní „Vyber jiné" – vyloučí aktuálně nabízené, pokud to jde.
// Vrací { system, systemTitle, mode, modeTitle, key, reason } nebo null (vše procvičeno).
// Zhoršení: poslední odtrénované sezení bylo o ≥0,3 s pomalejší než to předchozí.
// (Týdenní trend tu nelze použít – v nabídce jsou cvičení bez dat za tento týden.)
function isRecentlyWorse(system, mode) {
  const timed = getSessions(system, mode).filter(s => s.n > 0 && typeof s.avg === 'number' && s.avg > 0);
  if (timed.length < 2) return false;
  return timed[timed.length - 1].avg - timed[timed.length - 2].avg >= 0.3;
}

export function pickPracticeExercise(excludeKey = null) {
  const pool = [];
  for (const group of getExerciseGroups()) {
    for (const m of group.modes) {
      const s = summarizeExercise(group.system, m.mode);
      if (s.thisWeekCount !== 0) continue;
      const worsened = isRecentlyWorse(group.system, m.mode);
      const carriedOver = s.lastWeekCount === 0;
      pool.push({
        system: group.system,
        systemTitle: group.title,
        mode: m.mode,
        modeTitle: m.title,
        key: `${group.system}_${m.mode}`,
        priority: worsened || carriedOver,
        reason: worsened
          ? 'Naposledy ses zhoršil – zkus to vylepšit.'
          : (carriedOver && s.hasData ? 'Nestihnuto z minulého týdne.' : null)
      });
    }
  }
  if (!pool.length) return null;

  // Pro „Vyber jiné" vynech aktuální, pokud zůstane z čeho vybírat.
  let candidates = pool;
  if (excludeKey && pool.some(p => p.key !== excludeKey)) {
    candidates = pool.filter(p => p.key !== excludeKey);
  }

  // Přednostní (nestihnuté minulý týden / zhoršené) mají při losování přednost.
  const priority = candidates.filter(p => p.priority);
  const chosen = priority.length ? priority : candidates;
  return chosen[Math.floor(Math.random() * chosen.length)];
}
