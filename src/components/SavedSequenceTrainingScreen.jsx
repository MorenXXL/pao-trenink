import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';

function SavedSequenceTrainingScreen({ sequence, onBack, onNext, onPrev, isFirst, isLast }) {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setShowAnswer(false);
    onNext();
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setShowAnswer(false);
    onPrev();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-800 p-6 transition-colors duration-500">
      <div className="max-w-4xl mx-auto flex flex-col min-h-[90vh]">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-white hover:text-indigo-200 transition-colors text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Zpět na seznam
          </button>
        </div>

        {/* 3D Flip Card Container */}
        <div className="flex-grow flex items-center justify-center perspective-1000 py-8">
          <div
            className={`relative w-full max-w-2xl bg-transparent transition-transform duration-700 transform-style-3d ${showAnswer ? 'rotate-y-180' : ''}`}
            style={{ minHeight: '400px' }}
          >
            {/* Front of Card (Question) */}
            <div
              className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-2xl backface-hidden flex flex-col overflow-hidden cursor-pointer hover:shadow-3xl transition-shadow"
              onClick={!showAnswer ? handleShowAnswer : undefined}
            >
              <div className="bg-indigo-600 text-white px-8 py-4">
                <h3 className="text-xl font-bold text-center">Uložené sekvence</h3>
              </div>

              <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-4">Název sekvence</p>
                <div className="text-5xl font-bold text-gray-800 leading-tight">
                  {sequence?.name}
                </div>

                <div className={`mt-12 text-indigo-500 animate-bounce transition-opacity duration-300 ${showAnswer ? 'opacity-0' : 'opacity-100'}`}>
                  Klikni pro otočení
                </div>
              </div>
            </div>

            {/* Back of Card (Answer) */}
            <div className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-2xl backface-hidden rotate-y-180 flex flex-col overflow-hidden">
              <div className={`w-full h-full flex flex-col ${showAnswer ? 'opacity-100 transition-opacity duration-300 delay-300' : 'opacity-0 transition-none'}`}>
                <div className="bg-indigo-700 text-white px-8 py-4">
                  <h3 className="text-xl font-bold text-center">Hodnota a PAO</h3>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center p-8 space-y-6">
                  <div className="text-center w-full">
                    <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-2">Hodnota</p>
                    <div className="text-4xl font-bold text-gray-800 break-words whitespace-pre-wrap">
                      {sequence?.value || '-'}
                    </div>
                  </div>
                  
                  {sequence?.pao && (
                    <div className="text-center w-full bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                       <p className="text-indigo-400 text-sm uppercase tracking-wider font-semibold mb-2">PAO Sekvence</p>
                       <div className="text-xl text-gray-700 font-medium whitespace-pre-wrap">
                        {sequence.pao}
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between w-full mt-auto pt-6 px-4">
                     <button
                        onClick={handlePrev}
                        disabled={isFirst}
                        className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-colors ${isFirst ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'}`}
                      >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Předchozí
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={isLast}
                        className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-colors ${isLast ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'}`}
                      >
                        Další
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedSequenceTrainingScreen;
