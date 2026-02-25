import React, { useEffect, useState } from 'react';
import { Trophy, Home, RotateCcw, Zap, Target, Clock, Timer, History } from 'lucide-react';

function SummaryScreen({ stats, system, mode, onHome, onRestart }) {
    const accuracy = Math.round((stats.correct / (stats.correct + stats.wrong)) * 100) || 0;

    const validFastestTime = stats.fastestTime === Infinity ? 0 : stats.fastestTime;
    const averageTime = stats.trainingCorrect > 0 ? (stats.totalCorrectTime / stats.trainingCorrect) : 0;

    const [historicalRecord, setHistoricalRecord] = useState(0);
    const [isNewRecord, setIsNewRecord] = useState(false);

    useEffect(() => {
        if (!system || !mode) return;

        const recordKey = `record_${system}_${mode}`;
        const previousRecord = parseFloat(localStorage.getItem(recordKey)) || Infinity;

        if (validFastestTime > 0 && validFastestTime < previousRecord) {
            setIsNewRecord(true);
            localStorage.setItem(recordKey, validFastestTime.toString());
            setHistoricalRecord(validFastestTime);
        } else {
            setHistoricalRecord(previousRecord === Infinity ? 0 : previousRecord);
        }
    }, [system, mode, validFastestTime]);

    const displayRecord = isNewRecord ? validFastestTime : historicalRecord;

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 to-purple-800 p-6 flex flex-col items-center py-12 overflow-y-auto w-full">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl transform hover:scale-105 transition-transform duration-500">

                <div className="flex justify-center mb-8">
                    <div className="bg-yellow-100 p-6 rounded-full shadow-inner animate-bounce">
                        <Trophy className="w-16 h-16 text-yellow-500" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Trénink dokončen!</h2>
                    <p className="text-gray-500">Skvělá práce, jen tak dál!</p>
                </div>

                {isNewRecord && (
                    <div className="bg-yellow-400 text-yellow-900 rounded-2xl p-4 mb-8 text-center font-bold text-xl uppercase tracking-wider animate-pulse flex items-center justify-center shadow-lg">
                        <Trophy className="w-8 h-8 mr-3" />
                        Překonal jsi rekord!
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-2xl p-4 text-center">
                        <div className="flex items-center justify-center text-primary-500 mb-2">
                            <Zap className="w-5 h-5 mr-1" />
                            <span className="font-semibold text-sm">Skóre</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">{stats.score.toLocaleString()}</div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 text-center">
                        <div className="flex items-center justify-center text-primary-500 mb-2">
                            <Target className="w-5 h-5 mr-1" />
                            <span className="font-semibold text-sm">Přesnost</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">{accuracy}%</div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 text-center">
                        <div className="flex items-center justify-center text-orange-500 mb-2">
                            <Zap className="w-5 h-5 mr-1" />
                            <span className="font-semibold text-sm">Max Combo</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">{stats.maxCombo}x</div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 text-center">
                        <div className="flex items-center justify-center text-green-500 mb-2">
                            <Trophy className="w-5 h-5 mr-1" />
                            <span className="font-semibold text-sm">Celkem</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">{stats.correct}</div>
                    </div>
                </div>

                {/* Speed Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 text-center shadow-sm">
                        <div className="flex items-center justify-center text-purple-600 mb-2">
                            <Timer className="w-5 h-5 mr-2" />
                            <span className="font-semibold text-sm">Nejrychlejší čas</span>
                        </div>
                        <div className="text-3xl font-bold text-purple-900">
                            {validFastestTime > 0 ? `${validFastestTime.toFixed(1)}s` : '-'}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center shadow-sm">
                        <div className="flex items-center justify-center text-blue-600 mb-2">
                            <Clock className="w-5 h-5 mr-2" />
                            <span className="font-semibold text-sm">Průměrný čas</span>
                        </div>
                        <div className="text-3xl font-bold text-blue-900">
                            {averageTime > 0 ? `${averageTime.toFixed(1)}s` : '-'}
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 text-center shadow-sm">
                        <div className="flex items-center justify-center text-yellow-600 mb-2">
                            <History className="w-5 h-5 mr-2" />
                            <span className="font-semibold text-sm">Historický rekord</span>
                        </div>
                        <div className="text-3xl font-bold text-yellow-900">
                            {displayRecord > 0 ? `${displayRecord.toFixed(1)}s` : '-'}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={onRestart}
                        className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-colors shadow-lg"
                    >
                        <RotateCcw className="w-6 h-6 mr-2" />
                        Trénovat znovu
                    </button>

                    <button
                        onClick={onHome}
                        className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 px-8 py-4 rounded-xl text-lg font-bold transition-colors"
                    >
                        <Home className="w-6 h-6 mr-2" />
                        Zpět do menu
                    </button>
                </div>

            </div>
        </div>
    );
}

export default SummaryScreen;
