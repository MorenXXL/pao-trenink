import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, RotateCcw } from 'lucide-react';
import { KARTY_SYSTEM } from '../data/constants';

function CardSelectionScreen({ 
  question, 
  stats, 
  wrongCount,
  onBack, 
  onSubmitSelection,
  onCorrect, 
  onWrong 
}) {
  const [selectedCards, setSelectedCards] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  // Get all available cards grouped by suit
  const suits = {
    '♥': { name: 'Srdce', color: 'text-red-500', cards: [] },
    '♠': { name: 'Listy', color: 'text-black', cards: [] },
    '♣': { name: 'Kříže', color: 'text-black', cards: [] },
    '♦': { name: 'Káry', color: 'text-red-500', cards: [] }
  };

  // Group cards by suit
  Object.keys(KARTY_SYSTEM).forEach(card => {
    const suit = card.slice(-1);
    if (suits[suit]) {
      suits[suit].cards.push(card);
    }
  });

  // Sort cards within each suit
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

  const handleCardClick = (card) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter(c => c !== card));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleSubmit = () => {
    if (selectedCards.length === 3) {
      const answer = `${selectedCards[0]} ${selectedCards[1]} ${selectedCards[2]}`;
      setUserAnswer(answer);
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setSelectedCards([]);
    setShowResult(false);
    setUserAnswer('');
  };

  const isCorrect = userAnswer === question.answer;

  const handleResult = (correct) => {
    if (correct) {
      onCorrect();
    } else {
      onWrong();
    }
    handleReset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 p-6">
      <div className="max-w-6xl mx-auto">
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
            <CheckCircle className="w-6 h-6 mr-2 text-danger-400" />
            <span>{stats.wrong}</span>
          </div>
          {wrongCount > 0 && (
            <div className="flex items-center text-white text-xl font-bold">
              <RotateCcw className="w-6 h-6 mr-2 text-warning-400" />
              <span>{wrongCount}</span>
            </div>
          )}
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          {/* Mode Title */}
          <div className="bg-primary-600 text-white px-8 py-4 rounded-2xl mb-6 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-center">PAO → 3 karty</h3>
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Vyberte 3 karty pro tuto PAO:</h2>
          <div className="text-4xl font-bold text-primary-100">
            {question.question}
          </div>
        </div>

        {/* Selected Cards Display */}
        <div className="bg-white rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Vybrané karty ({selectedCards.length}/3)
          </h3>
          <div className="flex justify-center space-x-4 mb-4">
            {[0, 1, 2].map(index => (
              <div
                key={index}
                className="w-20 h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
              >
                {selectedCards[index] ? (
                  <div className="text-2xl font-bold">
                    {selectedCards[index]}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">Karta {index + 1}</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleSubmit}
              disabled={selectedCards.length !== 3}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Zkontrolovat
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Vymazat
            </button>
          </div>
        </div>

        {/* Result Display */}
        {showResult && (
          <div className="bg-white rounded-2xl p-6 mb-8">
            <div className={`text-center p-6 rounded-xl ${isCorrect ? 'bg-success-50 border border-success-200' : 'bg-danger-50 border border-danger-200'}`}>
              <h3 className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-success-700' : 'text-danger-700'}`}>
                {isCorrect ? 'Správně!' : 'Špatně!'}
              </h3>
              <div className="text-lg mb-4">
                <div className="mb-2">
                  <strong>Vaše odpověď:</strong> {userAnswer}
                </div>
                <div>
                  <strong>Správná odpověď:</strong> {question.answer}
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleResult(true)}
                  className="bg-success-600 hover:bg-success-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Správně
                </button>
                <button
                  onClick={() => handleResult(false)}
                  className="bg-danger-600 hover:bg-danger-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Špatně
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Card Selection Grid */}
        {!showResult && (
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Vyberte karty</h3>
            
            {Object.entries(suits).map(([suitSymbol, suitData]) => (
              <div key={suitSymbol} className="mb-6">
                <h4 className={`text-lg font-semibold mb-3 ${suitData.color}`}>
                  {suitData.name} {suitSymbol}
                </h4>
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-13 gap-2">
                  {suitData.cards.map(card => (
                    <button
                      key={card}
                      onClick={() => handleCardClick(card)}
                      disabled={selectedCards.length >= 3 && !selectedCards.includes(card)}
                      className={`
                        w-12 h-16 border-2 rounded-lg font-bold text-sm transition-all
                        ${selectedCards.includes(card)
                          ? 'border-primary-500 bg-primary-100 text-primary-700'
                          : selectedCards.length >= 3
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 bg-white hover:border-primary-300 hover:bg-primary-50'
                        }
                        ${suitData.color}
                      `}
                    >
                      {card}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CardSelectionScreen;
