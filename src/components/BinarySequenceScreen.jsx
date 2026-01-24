import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Delete, Eye } from 'lucide-react';

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

  const handleBinaryClick = (bit) => {
    setBinaryInput(prev => prev + bit);
  };

  const handleClear = () => {
    setBinaryInput('');
  };

  const handleBackspace = () => {
    setBinaryInput(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (binaryInput.length > 0) {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setBinaryInput('');
    setShowResult(false);
    setShowAnswer(false);
  };

  const isCorrect = binaryInput === question.answer;

  const handleResult = (correct) => {
    if (correct) {
      onCorrect();
    } else {
      onWrong();
    }
    handleReset();
  };

  // Format binary input with spaces every 3 digits for better readability
  const formatBinaryDisplay = (binary) => {
    return binary.replace(/(.{3})/g, '$1 ').trim();
  };

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
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          {/* Mode Title */}
          <div className="bg-primary-600 text-white px-8 py-4">
            <h3 className="text-xl font-bold text-center">
              {(() => {
                const modeMap = {
                  'bin-num': 'Binární → Číslo',
                  'num-bin': 'Číslo → Binární',
                  'seq-pao': 'Sekvence → PAO',
                  'pao-seq': 'PAO → Sekvence',
                  'seq-word': 'Sekvence → Slovo',
                  'word-seq': 'Slovo → Sekvence',
                  'text-utf8': 'Text → UTF-8 Binární'
                };
                return modeMap[mode] || 'Binární trénink';
              })()}
            </h3>
          </div>
          <div className="p-12">
            {/* Question */}
            <div className="text-center mb-12">
              <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-8 leading-tight">
                {mode === 'pao-seq' || mode === 'word-seq' || mode === 'text-utf8' ? question?.question || '' : formatBinaryDisplay(question?.question || '')}
              </div>
            </div>

            {/* Binary Input Display - Only for modes that need input */}
            {mode !== 'seq-pao' && mode !== 'seq-word' && mode !== 'word-seq' && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Vaše odpověď:
                </h3>
                <div className="text-center">
                  <div className="text-2xl font-mono bg-white border border-gray-300 rounded-lg p-4 min-h-[60px] flex items-center justify-center">
                    {binaryInput ? formatBinaryDisplay(binaryInput) : 
                      <span className="text-gray-400">Zadejte binární kód...</span>
                    }
                  </div>
                </div>
              </div>
            )}

            {/* Show Answer Section for seq-pao and pao-seq modes */}
            {(mode === 'seq-pao' || mode === 'seq-word' || mode === 'word-seq' || mode === 'text-utf8') && !showAnswer && (
                <div className="text-center">
                  <button
                    onClick={() => {
                      console.log('Show answer clicked');
                      setShowAnswer(true);
                    }}
                    className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <Eye className="w-6 h-6 mr-3" />
                    {mode === 'text-utf8' ? 'Odkrýt binární kód' : 'Zobrazit odpověď'}
                  </button>
                </div>
            )}

            {/* Answer display for seq-pao and pao-seq modes */}
            {(mode === 'seq-pao' || mode === 'seq-word' || mode === 'word-seq' || mode === 'text-utf8') && showAnswer && (
                <div className="space-y-8">
                  {/* UTF-8 mode special display */}
                  {mode === 'text-utf8' ? (
                    <div className="space-y-6">
                      {/* Binary code */}
                      <div className="bg-success-50 border border-success-200 rounded-2xl p-6">
                        <div className="text-lg font-semibold text-success-600 mb-3 text-center">
                          UTF-8 Binární kód:
                        </div>
                        <div className="text-lg font-mono text-success-700 text-center break-all">
                          {question?.answer}
                        </div>
                      </div>
                      
                      {/* Number sequence */}
                      <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6">
                        <div className="text-lg font-semibold text-primary-600 mb-3 text-center">
                          Číselné sekvence:
                        </div>
                        <div className="text-xl font-bold text-primary-700 text-center">
                          {question?.numberSequence}
                        </div>
                      </div>
                      
                      {/* PAO sequences */}
                      <div className="bg-warning-50 border border-warning-200 rounded-2xl p-6">
                        <div className="text-lg font-semibold text-warning-600 mb-3 text-center">
                          PAO výrazy:
                        </div>
                        <div className="text-lg font-bold text-warning-700 text-center whitespace-pre-line">
                          {question?.paoSequence}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Regular answer display for other modes */
                    <div className="bg-success-50 border border-success-200 rounded-2xl p-8">
                      <div className="text-3xl font-bold text-success-700 text-center">
                        <div className="mb-2 text-lg text-success-600">
                          {mode === 'seq-pao' ? 'PAO odpověď:' : 
                           mode === 'seq-word' ? 'Slovo:' : 
                           mode === 'word-seq' ? 'Binární sekvence:' : 'Odpověď:'}
                        </div>
                        {question?.answer}
                      </div>
                    </div>
                  )}
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-6">
                    <button
                      onClick={() => {
                        onCorrect();
                        handleReset();
                      }}
                      className="flex items-center justify-center bg-success-600 hover:bg-success-700 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <CheckCircle className="w-6 h-6 mr-3" />
                      Správně
                    </button>
                    <button
                      onClick={() => {
                        onWrong();
                        handleReset();
                      }}
                      className="flex items-center justify-center bg-danger-600 hover:bg-danger-700 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <XCircle className="w-6 h-6 mr-3" />
                      Špatně
                    </button>
                  </div>
                </div>
            )}

            {/* Binary input controls for other modes */}
            {mode !== 'seq-pao' && mode !== 'seq-word' && mode !== 'word-seq' && mode !== 'text-utf8' && !showResult && (
                <div className="space-y-6">
                  <div className="flex justify-center flex-wrap gap-4">
                    <button
                      onClick={() => handleBinaryClick('0')}
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-600 hover:bg-gray-700 text-white text-2xl sm:text-3xl font-bold rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      0
                    </button>
                    <button
                      onClick={() => handleBinaryClick('1')}
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-600 hover:bg-primary-700 text-white text-2xl sm:text-3xl font-bold rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      1
                    </button>
                  </div>
                  <div className="flex justify-center flex-wrap gap-3">
                    <button
                      onClick={handleBackspace}
                      className="flex items-center justify-center bg-warning-600 hover:bg-warning-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-colors shadow-lg"
                    >
                      <Delete className="w-5 h-5 mr-2" />
                      Smazat
                    </button>
                    <button
                      onClick={handleClear}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-colors shadow-lg"
                    >
                      Vymazat vše
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={binaryInput.length === 0}
                      className="bg-success-600 hover:bg-success-700 disabled:bg-gray-400 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-colors shadow-lg"
                    >
                      Zkontrolovat
                    </button>
                  </div>
                </div>
            )}

            {/* Result Display for other modes */}
            {mode !== 'seq-pao' && mode !== 'seq-word' && mode !== 'word-seq' && mode !== 'text-utf8' && showResult && (
                <div className="space-y-8">
                  <div className={`text-center p-6 rounded-xl ${isCorrect ? 'bg-success-50 border border-success-200' : 'bg-danger-50 border border-danger-200'}`}>
                    <h3 className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-success-700' : 'text-danger-700'}`}>
                      {isCorrect ? 'Správně!' : 'Špatně!'}
                    </h3>
                    <div className="text-lg mb-4 space-y-2">
                      <div>
                        <strong>Vaše odpověď:</strong> {formatBinaryDisplay(binaryInput)}
                      </div>
                      <div>
                        <strong>Správná odpověď:</strong> {formatBinaryDisplay(question.answer)}
                      </div>
                      {mode === 'pao-seq' && question.paoNumbers && (
                        <div>
                          <strong>PAO čísla:</strong> {question.paoNumbers}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-6">
                    <button
                      onClick={() => handleResult(true)}
                      className="flex items-center justify-center bg-success-600 hover:bg-success-700 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <CheckCircle className="w-6 h-6 mr-3" />
                      Správně
                    </button>
                    <button
                      onClick={() => handleResult(false)}
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

export default BinarySequenceScreen;
