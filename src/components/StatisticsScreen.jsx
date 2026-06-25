import React from 'react';
import { ArrowLeft, Timer, Clock, Repeat, CalendarDays, TrendingUp, TrendingDown, Minus, Moon } from 'lucide-react';
import { getExerciseGroups, summarizeExercise } from '../utils/stats';

const TREND_STYLES = {
  good: { cls: 'bg-success-50 text-success-700 border-success-200', Icon: TrendingUp },
  bad: { cls: 'bg-danger-50 text-danger-700 border-danger-200', Icon: TrendingDown },
  neutral: { cls: 'bg-gray-50 text-gray-600 border-gray-200', Icon: Minus },
  idle: { cls: 'bg-warning-50 text-warning-700 border-warning-200', Icon: Moon }
};

function Metric({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl py-3 px-2 text-center">
      <Icon className={`w-5 h-5 mb-1 ${accent}`} />
      <div className="text-lg font-bold text-gray-900 leading-none">{value}</div>
      <div className="text-[11px] text-gray-500 mt-1 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function ExerciseCard({ title, stats }) {
  const { best, avg, timesTrained, thisWeekCount, trend, hasData } = stats;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100">
        <h4 className="font-bold text-gray-900">{title}</h4>
      </div>

      {!hasData ? (
        <div className="px-5 py-6 text-center text-gray-400">Zatím necvičeno</div>
      ) : (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-4 gap-2">
            <Metric icon={Timer} label="Rekord" accent="text-purple-500" value={best != null ? `${best.toFixed(1)}s` : '–'} />
            <Metric icon={Clock} label="Průměr" accent="text-blue-500" value={avg != null ? `${avg.toFixed(1)}s` : '–'} />
            <Metric icon={Repeat} label="Cvičeno" accent="text-primary-500" value={`${timesTrained}×`} />
            <Metric icon={CalendarDays} label="Týden" accent="text-green-500" value={`${thisWeekCount}×`} />
          </div>

          {trend && (
            <div className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${TREND_STYLES[trend.tone].cls}`}>
              {React.createElement(TREND_STYLES[trend.tone].Icon, { className: 'w-4 h-4 mt-0.5 shrink-0' })}
              <span>{trend.text}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatisticsScreen({ onBack }) {
  const groups = getExerciseGroups();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-white hover:text-primary-200 transition-colors mb-6 text-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zpět do menu
        </button>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white">Statistiky</h2>
          <p className="text-primary-100 mt-1">Rekordy a pokrok jednotlivých cvičení</p>
        </div>

        <div className="space-y-8 pb-8">
          {groups.map(group => (
            <div key={group.system}>
              <h3 className="text-white/90 font-bold text-lg mb-3 px-1">{group.title}</h3>
              <div className="space-y-3">
                {group.modes.map(mode => (
                  <ExerciseCard
                    key={mode.mode}
                    title={mode.title}
                    stats={summarizeExercise(group.system, mode.mode)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatisticsScreen;
