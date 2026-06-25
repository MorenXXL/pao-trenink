// Per-exercise training history, stored in localStorage as `stats_<system>_<mode>`.
// Each entry: { t: timestamp, n: počet měřených správných odpovědí, best: nejlepší čas, avg: průměr sezení }.

import { MODES } from '../data/constants';

const WEEK = 7 * 24 * 60 * 60 * 1000;
const MAX_HISTORY = 500;

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
  const thisWeekCount = sessions.filter(s => now - s.t <= WEEK).length;

  const inWindow = (loAgeExcl, hiAgeIncl) =>
    sessions.filter(s => {
      const age = now - s.t;
      return age > loAgeExcl && age <= hiAgeIncl;
    });
  const avgThis = weightedAvg(inWindow(-1, WEEK));
  const avgLast = weightedAvg(inWindow(WEEK, 2 * WEEK));

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

  return { best, avg, timesTrained, thisWeekCount, trend, hasData: timesTrained > 0 };
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
// Vrací { system, systemTitle, mode, modeTitle } nebo null, pokud je vše procvičeno.
export function pickUntrainedThisWeek() {
  const candidates = [];
  for (const group of getExerciseGroups()) {
    for (const m of group.modes) {
      if (summarizeExercise(group.system, m.mode).thisWeekCount === 0) {
        candidates.push({
          system: group.system,
          systemTitle: group.title,
          mode: m.mode,
          modeTitle: m.title
        });
      }
    }
  }
  if (!candidates.length) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
