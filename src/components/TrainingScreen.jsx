import React from 'react';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Zap, Trophy, Brain } from 'lucide-react';

function TrainingScreen({
  question,
  showAnswer,
  stats,
  phase,
  onBack,
  onShowAnswer,
  onCorrect,
  onWrong
}) {
  const isReview = phase === 'review';
  const progressPercent = Math.min(100, Math.round((stats.answeredCount / stats.totalQuestions) * 100));

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isReview ? 'from-orange-500 via-orange-600 to-red-700' : 'from-primary-500 via-primary-600 to-purple-700'} p-6 transition-colors duration-500`}>
      <div className="max-w-4xl mx-auto flex flex-col min-h-[90vh]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-white hover:text-primary-200 transition-colors text-lg mb-4 md:mb-0"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Zpět
          </button>

          {/* Gamification Stats */}
          <div className="flex space-x-6">
            <div className="flex items-center bg-black/20 rounded-full px-4 py-2 text-white">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="font-bold font-mono text-xl">{stats.score.toLocaleString()}</span>
            </div>

            <div className={`flex items-center bg-black/20 rounded-full px-4 py-2 text-white transition-all duration-300 ${stats.combo > 1 ? 'scale-110 shadow-lg bg-yellow-500/20' : ''}`}>
              <Zap className={`w-5 h-5 mr-2 ${stats.combo > 1 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
              <span className="font-bold text-xl">{stats.combo}x</span>
            </div>
          </div>
        </div>

        {/* Progress Bar (Only used in training phase usually, but let's show it) */}
        {!isReview && (
          <div className="w-full bg-black/20 rounded-full h-4 mb-8 overflow-hidden">
            <div
              className="bg-green-400 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {isReview && (
          <div className="bg-orange-500/30 border border-orange-300/50 rounded-xl p-3 mb-6 text-center text-white animate-pulse">
            <span className="font-bold text-lg">⚠️ Oprava chyb</span> – odpověz správně 3x za sebou
          </div>
        )}

        {/* 3D Flip Card Container */}
        <div className="flex-grow flex items-center justify-center perspective-1000 py-8">
          <div
            className={`relative w-full max-w-2xl bg-transparent transition-transform duration-700 transform-style-3d ${showAnswer ? 'rotate-y-180' : ''}`}
            style={{ minHeight: '400px' }}
          >

            {/* Front of Card (Question) */}
            <div
              className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-2xl backface-hidden flex flex-col overflow-hidden cursor-pointer hover:shadow-3xl transition-shadow"
              onClick={!showAnswer ? onShowAnswer : undefined}
            >
              {/* Mode Header */}
              <div className={`${isReview ? 'bg-orange-600' : 'bg-primary-600'} text-white px-8 py-4`}>
                <h3 className="text-xl font-bold text-center flex items-center justify-center">
                  <Brain className="w-6 h-6 mr-2 opacity-80" />
                  {question?.mode || 'Trénink'}
                </h3>
              </div>

              <div className="flex-grow flex flex-col items-center justify-center p-12">
                <div className="text-center">
                  <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-4">Otázka</p>
                  <div className="text-6xl font-bold text-gray-800 leading-tight">
                    {question?.question}
                  </div>
                </div>

                <div className="mt-12 text-primary-500 animate-bounce">
                  Klikni pro otočení
                </div>
              </div>
            </div>

            {/* Back of Card (Answer) */}
            <div className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-2xl backface-hidden rotate-y-180 flex flex-col overflow-hidden">
              <div className="bg-success-600 text-white px-8 py-4">
                <h3 className="text-xl font-bold text-center">Odpověď</h3>
              </div>

              <div className="flex-grow flex flex-col items-center justify-center p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-gray-800 mb-2">
                    {question?.answer}
                  </div>
                  {question?.paoSequence && (
                    <div className="text-lg text-gray-500 mt-2 font-mono">
                      {question.paoSequence}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                  <button
                    onClick={(e) => { e.stopPropagation(); onCorrect(); }}
                    className="flex items-center justify-center flex-col bg-success-100 hover:bg-success-200 text-success-700 p-6 rounded-2xl transition-colors border-2 border-success-200 group"
                  >
                    <CheckCircle className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-bold">Správně</span>
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); onWrong(); }}
                    className="flex items-center justify-center flex-col bg-danger-100 hover:bg-danger-200 text-danger-700 p-6 rounded-2xl transition-colors border-2 border-danger-200 group"
                  >
                    <XCircle className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-bold">Špatně</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainingScreen;
