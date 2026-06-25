import React from 'react';
import { ArrowLeft, Play, CheckCircle2, Dumbbell, Shuffle, AlertTriangle } from 'lucide-react';

function PracticeLaunchScreen({ pick, onStart, onAnother, onBack }) {
  // Vše procvičeno
  if (!pick) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 p-6 flex flex-col">
        <button
          onClick={onBack}
          className="flex items-center text-white hover:text-primary-200 transition-colors mb-6 text-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zpět do menu
        </button>

        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-100 text-success-600 mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Tento týden máš vše procvičeno!</h2>
            <p className="text-gray-500 mb-8">Vyber si další cvičení podle chuti z nabídky menu.</p>
            <button
              onClick={onBack}
              className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-colors shadow-lg"
            >
              Zpět do menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Nabídka konkrétního cvičení
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 p-6 flex flex-col">
      <button
        onClick={onBack}
        className="flex items-center text-white hover:text-primary-200 transition-colors mb-6 text-lg"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Zpět do menu
      </button>

      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-lg w-full text-center">
          <div className="flex items-center justify-center text-primary-500 mb-6">
            <Dumbbell className="w-7 h-7 mr-2" />
            <span className="text-sm font-semibold uppercase tracking-widest">Doporučené cvičení</span>
          </div>

          <div className="mb-6">
            <div className="text-lg font-semibold text-gray-400 mb-2">{pick.systemTitle}</div>
            <div className="text-4xl font-extrabold text-gray-900 leading-tight">{pick.modeTitle}</div>
          </div>

          {pick.reason && (
            <div className="inline-flex items-start gap-2 bg-warning-50 text-warning-700 border border-warning-200 rounded-xl px-4 py-2 text-sm font-medium mb-8">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{pick.reason}</span>
            </div>
          )}

          {/* Dominantní akce */}
          <button
            onClick={() => onStart(pick.system, pick.mode)}
            className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-5 rounded-2xl text-2xl font-extrabold transition-colors shadow-xl mb-4"
          >
            <Play className="w-7 h-7 mr-3" />
            Spustit
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Zpět
            </button>
            <button
              onClick={onAnother}
              className="flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              <Shuffle className="w-5 h-5 mr-2" />
              Vyber jiné
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PracticeLaunchScreen;
