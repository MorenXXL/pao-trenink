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
  onShowAnswer,
  data
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

  const fmtNum = (n) => (n == null ? '?' : String(n).padStart(2, '0'));

  // Rozdělí správnou i zadanou odpověď na dvojice trojic (= jedno PAO číslo)
  // a spočítá zadané i správné číslo pro tabulku porovnání.
  const buildComparison = () => {
    const correctTriples = (question.answer.match(/.{1,3}/g)) || [];
    const userTriples = (binaryInput.match(/.{1,3}/g)) || [];
    const digit = (t) =>
      t && data && data.binarni && data.binarni[t] !== undefined ? data.binarni[t] : null;
    const numOf = (a, b) => {
      const x = digit(a);
      const y = digit(b);
      return x == null || y == null ? null : x * 10 + y;
    };
    const pairs = [];
    for (let i = 0; i < correctTriples.length; i += 2) {
      const c = [correctTriples[i], correctTriples[i + 1]];
      const u = [userTriples[i], userTriples[i + 1]];
      pairs.push({
        c,
        u,
        correctNum: numOf(c[0], c[1]),
        userNum: numOf(u[0], u[1]),
        ok: c[0] === u[0] && c[1] === u[1]
      });
    }
    return pairs;
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

            {/* Answer display — fixed height so the block never shifts while typing */}
            {!showResult && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl px-3 mb-5 h-24 flex items-center justify-center overflow-hidden">
                {binaryInput
                  ? <span className="text-2xl sm:text-3xl font-mono tracking-wider text-gray-900 break-all text-center leading-snug">{formatBinary(binaryInput)}</span>
                  : <span className="text-gray-400 text-lg">Zadejte binární kód…</span>}
              </div>
            )}

            {!showResult ? (
              <div className="space-y-3 select-none">
                {/* 0 / 1 keypad */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setBinaryInput(prev => prev + '0')}
                    className="h-20 bg-gray-700 hover:bg-gray-800 active:bg-gray-900 text-white text-4xl font-bold rounded-2xl transition-colors shadow-lg touch-manipulation"
                  >
                    0
                  </button>
                  <button
                    onClick={() => setBinaryInput(prev => prev + '1')}
                    className="h-20 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-4xl font-bold rounded-2xl transition-colors shadow-lg touch-manipulation"
                  >
                    1
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBinaryInput(prev => prev.slice(0, -1))}
                    disabled={binaryInput.length === 0}
                    className="flex items-center justify-center bg-warning-500 hover:bg-warning-600 active:bg-warning-700 disabled:bg-gray-300 text-white px-4 py-3 rounded-xl font-semibold transition-colors touch-manipulation"
                  >
                    <Delete className="w-5 h-5 mr-2" />
                    Smazat
                  </button>
                  <button
                    onClick={() => setBinaryInput('')}
                    disabled={binaryInput.length === 0}
                    className="bg-gray-400 hover:bg-gray-500 active:bg-gray-600 disabled:bg-gray-200 text-white px-4 py-3 rounded-xl font-semibold transition-colors touch-manipulation"
                  >
                    Vymazat vše
                  </button>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={binaryInput.length === 0}
                  className="w-full flex items-center justify-center bg-success-600 hover:bg-success-700 active:bg-success-800 disabled:bg-gray-300 text-white px-5 py-4 rounded-xl text-lg font-bold transition-colors shadow-lg touch-manipulation"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Zkontrolovat
                </button>
              </div>
            ) : (
              /* Wrong result — porovnání po dvojčíslích se zvýrazněnou chybnou trojicí */
              <div>
                <div className="text-2xl font-bold text-danger-700 mb-4 text-center">Špatně</div>

                <div className="space-y-2 mb-5">
                  {buildComparison().map((p, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-3 ${p.ok ? 'bg-success-50 border-success-200' : 'bg-danger-50 border-danger-200'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">{i + 1}. číslo</span>
                        {p.ok ? (
                          <span className="text-sm font-bold text-success-700">{fmtNum(p.correctNum)} ✓</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-sm font-bold">
                            <span className="text-danger-700">{fmtNum(p.userNum)}</span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <span className="text-success-700">{fmtNum(p.correctNum)}</span>
                          </span>
                        )}
                      </div>

                      <div
                        className="grid gap-x-2 gap-y-1 justify-center items-center font-mono text-xl"
                        style={{ gridTemplateColumns: `auto repeat(${p.c.length}, minmax(2.75rem, auto))` }}
                      >
                        <div className="text-[10px] uppercase text-gray-400 font-sans font-semibold text-right pr-1">Správně</div>
                        {p.c.map((c, j) => {
                          const bad = p.u[j] !== c;
                          return (
                            <div key={`c${j}`} className={`text-center rounded px-2 py-0.5 ${bad ? 'bg-success-200 text-success-800 font-bold' : 'text-gray-500'}`}>{c}</div>
                          );
                        })}
                        <div className="text-[10px] uppercase text-gray-400 font-sans font-semibold text-right pr-1">Vaše</div>
                        {p.c.map((c, j) => {
                          const u = p.u[j];
                          const bad = u !== c;
                          return (
                            <div key={`u${j}`} className={`text-center rounded px-2 py-0.5 ${bad ? 'bg-danger-200 text-danger-800 font-bold' : 'text-gray-500'}`}>{u || '—'}</div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={handleNextAfterWrong}
                    className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg"
                  >
                    Další karta
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
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
