import React from 'react';
import { Trophy, Home, RotateCcw, Zap, Target } from 'lucide-react';

function SummaryScreen({ stats, onHome, onRestart }) {
    const accuracy = Math.round((stats.correct / (stats.correct + stats.wrong)) * 100) || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 to-purple-800 p-6 flex items-center justify-center">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl text-center transform hover:scale-105 transition-transform duration-500">

                <div className="flex justify-center mb-8">
                    <div className="bg-yellow-100 p-6 rounded-full shadow-inner animate-bounce">
                        <Trophy className="w-16 h-16 text-yellow-500" />
                    </div>
                </div>

                <h2 className="text-4xl font-bold text-gray-900 mb-2">Trénink dokončen!</h2>
                <p className="text-gray-500 mb-10">Skvělá práce, jen tak dál!</p>

                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-gray-50 rounded-2xl p-4">
                        <div className="flex items-center justify-center text-primary-500 mb-2">
                            <Zap className="w-6 h-6 mr-2" />
                            <span className="font-semibold">Skóre</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-800">{stats.score.toLocaleString()}</div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                        <div className="flex items-center justify-center text-primary-500 mb-2">
                            <Target className="w-6 h-6 mr-2" />
                            <span className="font-semibold">Přesnost</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-800">{accuracy}%</div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                        <div className="flex items-center justify-center text-orange-500 mb-2">
                            <Zap className="w-6 h-6 mr-2" />
                            <span className="font-semibold">Max Combo</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-800">{stats.maxCombo}x</div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                        <div className="flex items-center justify-center text-green-500 mb-2">
                            <Trophy className="w-6 h-6 mr-2" />
                            <span className="font-semibold">Celkem</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-800">{stats.correct}</div>
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
