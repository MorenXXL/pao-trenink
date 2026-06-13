import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, ThumbsUp, Delete, ArrowRight } from 'lucide-react';
import { KARTY_SYSTEM } from '../data/constants';

function CardSelectionScreen({
  question,
  stats,
  wrongCount,
  onBack,
  onShowAnswer,
  onCorrect,
  onWrong
}) {
  const [selectedCards, setSelectedCards] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  const isCorrect = userAnswer === question.answer;

  // Group cards by suit
  const suits = {
    '♥': { name: 'Srdce', color: 'text-red-500', cards: [] },
    '♠': { name: 'Listy', color: 'text-gray-900', cards: [] },
    '♣': { name: 'Kříže', color: 'text-gray-900', cards: [] },
    '♦': { name: 'Káry', color: 'text-red-500', cards: [] }
  };

  Object.keys(KARTY_SYSTEM).forEach(card => {
    const suit = card.slice(-1);
    if (suits[suit]) suits[suit].cards.push(card);
  });

  Object.keys(suits).forEach(suit => {
    suits[suit].cards.sort((a, b) => {
      const getValue = (card) => {
        const value = card.slice(0, -1);
        if (value === 'A') return 1;
        if (value === 'J') return 11;
        if (value === 'Q') return 12;
        if (value === 'K') return 13;
        return parseInt(value);
      };
      return getValue(a) - getValue(b);
    });
  });

  const handleReset = () => {
    setSelectedCards([]);
    setShowResult(false);
    setUserAnswer('');
  };

  const handleCardClick = (card) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter(c => c !== card));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleSubmit = () => {
    if (selectedCards.length === 3) {
      onShowAnswer?.(); // record recall time at the moment the answer is checked
      setUserAnswer(selectedCards.join(' '));
      setShowResult(true);
    }
  };

  // Auto-advance on a correct answer (the app can verify it itself).
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
      <div className="max-w-5xl mx-auto">
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
            PAO → 3 karty
          </span>
          <div className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            {question.question}
          </div>
        </div>

        {/* Selection / Result panel */}
        <div className="relative bg-white rounded-3xl shadow-2xl p-6 mb-6 overflow-hidden">
          {/* Correct overlay (thumbs up across the display) */}
          {showResult && isCorrect && (
            <div className="absolute inset-0 z-20 bg-success-500/95 flex flex-col items-center justify-center animate-in fade-in duration-200">
              <ThumbsUp className="w-24 h-24 text-white mb-4 animate-bounce" />
              <div className="text-4xl font-extrabold text-white">Správně!</div>
            </div>
          )}

          {/* Selected card slots */}
          <div className="flex items-center justify-center space-x-4 mb-5">
            {[0, 1, 2].map(index => (
              <div
                key={index}
                onClick={() => !showResult && selectedCards[index] && handleCardClick(selectedCards[index])}
                className={`w-20 h-28 rounded-xl flex items-center justify-center text-3xl font-bold transition-all ${
                  selectedCards[index]
                    ? 'bg-primary-50 border-2 border-primary-400 text-gray-900 cursor-pointer'
                    : 'bg-gray-50 border-2 border-dashed border-gray-300 text-gray-300'
                } ${(selectedCards[index]?.endsWith('♥') || selectedCards[index]?.endsWith('♦')) ? 'text-red-500' : ''}`}
              >
                {selectedCards[index] || index + 1}
              </div>
            ))}
          </div>

          {!showResult ? (
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setSelectedCards(prev => prev.slice(0, -1))}
                disabled={selectedCards.length === 0}
                className="flex items-center bg-warning-500 hover:bg-warning-600 disabled:bg-gray-300 text-white px-5 py-3 rounded-xl font-semibold transition-colors"
              >
                <Delete className="w-5 h-5 mr-2" />
                Smazat
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedCards.length !== 3}
                className="flex items-center bg-success-600 hover:bg-success-700 disabled:bg-gray-300 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Zkontrolovat
              </button>
            </div>
          ) : (
            /* Wrong result: show correct answer + Next */
            <div className="text-center">
              <div className="text-2xl font-bold text-danger-700 mb-3">Špatně</div>
              <div className="space-y-1 mb-5 text-lg">
                <div className="text-gray-500">
                  Vaše odpověď: <span className="font-semibold text-gray-700">{userAnswer}</span>
                </div>
                <div className="text-gray-500">
                  Správně: <span className="font-bold text-success-700">{question.answer}</span>
                </div>
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

        {/* Card grid by suit */}
        {!showResult && (
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {Object.entries(suits).map(([suitSymbol, suitData]) => (
                <div key={suitSymbol}>
                  <h4 className={`text-base font-bold mb-2 ${suitData.color}`}>
                    {suitData.name} {suitSymbol}
                  </h4>
                  <div className="grid grid-cols-7 gap-1.5">
                    {suitData.cards.map(card => {
                      const selected = selectedCards.includes(card);
                      const blocked = selectedCards.length >= 3 && !selected;
                      return (
                        <button
                          key={card}
                          onClick={() => handleCardClick(card)}
                          disabled={blocked}
                          className={`h-12 rounded-lg font-bold text-sm border-2 transition-all ${suitData.color} ${
                            selected
                              ? 'border-primary-500 bg-primary-100 ring-2 ring-primary-300'
                              : blocked
                              ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                              : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50'
                          }`}
                        >
                          {card}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardSelectionScreen;
