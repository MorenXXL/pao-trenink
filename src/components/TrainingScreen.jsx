import React from 'react';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Eye } from 'lucide-react';

function TrainingScreen({ 
  question, 
  showAnswer, 
  stats, 
  wrongCount,
  onBack, 
  onShowAnswer, 
  onCorrect, 
  onWrong 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-white hover:text-primary-200 transition-colors mb-8 text-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zpět na režimy
        </button>

        {/* Stats */}
        <div className="flex justify-center space-x-8 mb-8">
          <div className="flex items-center text-white text-xl font-bold">
            <CheckCircle className="w-6 h-6 mr-2 text-success-400" />
            <span>{stats.correct}</span>
          </div>
          <div className="flex items-center text-white text-xl font-bold">
            <XCircle className="w-6 h-6 mr-2 text-danger-400" />
            <span>{stats.wrong}</span>
          </div>
          {wrongCount > 0 && (
            <div className="flex items-center text-white text-xl font-bold">
              <RotateCcw className="w-6 h-6 mr-2 text-warning-400" />
              <span>{wrongCount}</span>
            </div>
          )}
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Mode Title */}
          <div className="bg-primary-600 text-white px-8 py-4">
            <h3 className="text-xl font-bold text-center">
              {(() => {
                const modeMap = {
                  'num-pao': 'Číslo → PAO',
                  'pao-num': 'PAO → Číslo',
                  'num-word': 'Číslo → Slovo',
                  'word-num': 'Slovo → Číslo',
                  'card-num': 'Karta → Číslo',
                  'cards-pao': '3 karty → PAO'
                };
                return modeMap[question?.mode] || 'Trénink';
              })()}
            </h3>
          </div>
          <div className="p-12">
            {/* Question */}
            <div className="text-center mb-12">
              <div className="text-5xl font-bold text-primary-600 mb-8 leading-tight">
                {question?.question}
              </div>
            </div>

            {/* Answer Section */}
            {!showAnswer ? (
              <div className="text-center">
                <button
                  onClick={onShowAnswer}
                  className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Eye className="w-6 h-6 mr-3" />
                  Ukázat odpověď
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Answer */}
                <div className="bg-success-50 border border-success-200 rounded-2xl p-8">
                  <div className="text-3xl font-bold text-success-700 text-center">
                    {question?.answer}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={onCorrect}
                    className="flex items-center justify-center bg-success-600 hover:bg-success-700 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <CheckCircle className="w-6 h-6 mr-3" />
                    Správně
                  </button>
                  <button
                    onClick={onWrong}
                    className="flex items-center justify-center bg-danger-600 hover:bg-danger-700 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <XCircle className="w-6 h-6 mr-3" />
                    Špatně
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainingScreen;
