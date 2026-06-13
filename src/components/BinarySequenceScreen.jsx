import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Delete, Eye, ThumbsUp, ArrowRight } from 'lucide-react';

const MODE_TITLES = {
  'bin-num': 'Binární → Číslo',
  'num-bin': 'Číslo → Binární',
  'seq-pao': 'Sekvence → PAO',
  'pao-seq': 'PAO → Sekvence',
  'seq-word': 'Sekvence → Slovo',
  'word-seq': 'Slovo → Sekvence',
  'text-utf8': 'Text → UTF-8 Binární'
};

// Format a binary string with a space every 3 digits for readability.
const formatBinary = (binary) => (binary || '').replace(/(.{3})/g, '$1 ').trim();

function BinarySequenceScreen({
  question,
  stats,
  wrongCount,
  onBack,
  onCorrect,
  onWrong,
  mode,
  onShowAnswer
}) {
  const [binaryInput, setBinaryInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Modes where the answer is a binary string the app can verify itself.
  const isInputMode = mode === 'pao-seq' || mode === 'word-seq';
  const isCorrect = binaryInput === question.answer;

  const handleReset = () => {
    setBinaryInput('');
    setShowResult(false);
    setShowAnswer(false);
  };

  const handleSubmit = () => {
    if (binaryInput.length > 0) {
      onShowAnswer?.(); // record recall time at the moment the answer is checked
      setShowResult(true);
    }
  };

  // Auto-advance on a correct typed answer.
  useEffect(() => {
    if (showResult && isCorrect) {
      const t = setTimeout(() => {
        onCorrect();
        handleReset();
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [showResult, isCorrect]);

  const handleNextAfterWrong = () => {
    onWrong();
    handleReset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Top bar: back + stats */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-white hover:text-primary-200 transition-colors text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Zpět na režimy
          </button>
          <div className="flex items-center space-x-6">
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
        </div>

        {/* Question */}
        <div className="text-center mb-6">
          <span className="inline-block bg-primary-700/60 text-primary-50 text-sm font-semibold uppercase tracking-wider px-4 py-1 rounded-full mb-3">
            {MODE_TITLES[mode] || 'Binární trénink'}
          </span>
          <div className="text-3xl sm:text-4xl font-bold text-white leading-tight font-mono break-words">
            {isInputMode ? question?.question : formatBinary(question?.question)}
          </div>
        </div>

        {/* ===== Input modes (app verifies) ===== */}
        {isInputMode && (
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 overflow-hidden">
            {/* Correct overlay (thumbs up across the display) */}
            {showResult && isCorrect && (
              <div className="absolute inset-0 z-20 bg-success-500/95 flex flex-col items-center justify-center animate-in fade-in duration-200">
                <ThumbsUp className="w-24 h-24 text-white mb-4 animate-bounce" />
                <div className="text-4xl font-extrabold text-white">Správně!</div>
              </div>
            )}

            {/* Answer display */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl py-5 px-4 mb-5 min-h-[70px] flex items-center justify-center">
              {binaryInput
                ? <span className="text-3xl font-mono tracking-widest text-gray-900">{formatBinary(binaryInput)}</span>
                : <span className="text-gray-400 text-lg">Zadejte binární kód…</span>}
            </div>

            {!showResult ? (
              <>
                {/* 0 / 1 keypad */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <button
                    onClick={() => setBinaryInput(prev => prev + '0')}
                    className="h-20 bg-gray-700 hover:bg-gray-800 text-white text-4xl font-bold rounded-2xl transition-colors shadow-lg active:scale-95"
                  >
                    0
                  </button>
                  <button
                    onClick={() => setBinaryInput(prev => prev + '1')}
                    className="h-20 bg-primary-600 hover:bg-primary-700 text-white text-4xl font-bold rounded-2xl transition-colors shadow-lg active:scale-95"
                  >
                    1
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setBinaryInput(prev => prev.slice(0, -1))}
                    disabled={binaryInput.length === 0}
                    className="flex items-center justify-center bg-warning-500 hover:bg-warning-600 disabled:bg-gray-300 text-white px-5 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <Delete className="w-5 h-5 mr-2" />
                    Smazat
                  </button>
                  <button
                    onClick={() => setBinaryInput('')}
                    disabled={binaryInput.length === 0}
                    className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-200 text-white px-5 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Vymazat vše
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={binaryInput.length === 0}
                    className="flex-1 flex items-center justify-center bg-success-600 hover:bg-success-700 disabled:bg-gray-300 text-white px-5 py-3 rounded-xl font-bold transition-colors shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Zkontrolovat
                  </button>
                </div>
              </>
            ) : (
              /* Wrong result */
              <div className="text-center">
                <div className="text-2xl font-bold text-danger-700 mb-3">Špatně</div>
                <div className="space-y-1 mb-5">
                  <div className="text-gray-500">
                    Vaše odpověď: <span className="font-mono font-semibold text-gray-700">{formatBinary(binaryInput)}</span>
                  </div>
                  <div className="text-gray-500">
                    Správně: <span className="font-mono font-bold text-success-700">{formatBinary(question.answer)}</span>
                  </div>
                  {mode === 'pao-seq' && question.paoNumbers && (
                    <div className="text-gray-500">
                      PAO čísla: <span className="font-semibold text-gray-700">{question.paoNumbers}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleNextAfterWrong}
                  className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg"
                >
                  Další karta
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== Reveal modes (self-grade: answer is free text) ===== */}
        {!isInputMode && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {!showAnswer ? (
              <div className="text-center">
                <button
                  onClick={() => { onShowAnswer?.(); setShowAnswer(true); }}
                  className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-colors shadow-lg"
                >
                  <Eye className="w-6 h-6 mr-3" />
                  Zobrazit odpověď
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-success-50 border border-success-200 rounded-2xl p-6 text-center">
                  <div className="text-sm uppercase tracking-wider font-semibold text-success-600 mb-2">
                    {mode === 'seq-pao' ? 'PAO odpověď' : 'Slovo'}
                  </div>
                  <div className="text-3xl font-bold text-success-700 break-words">
                    {question?.answer}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { onCorrect(); handleReset(); }}
                    className="flex items-center justify-center bg-success-600 hover:bg-success-700 text-white px-6 py-4 rounded-xl text-xl font-semibold transition-colors shadow-lg"
                  >
                    <CheckCircle className="w-6 h-6 mr-2" />
                    Správně
                  </button>
                  <button
                    onClick={() => { onWrong(); handleReset(); }}
                    className="flex items-center justify-center bg-danger-600 hover:bg-danger-700 text-white px-6 py-4 rounded-xl text-xl font-semibold transition-colors shadow-lg"
                  >
                    <XCircle className="w-6 h-6 mr-2" />
                    Špatně
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BinarySequenceScreen;
