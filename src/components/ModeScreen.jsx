import React from 'react';
import { ArrowLeft, Target, Zap, TrendingUp } from 'lucide-react';
import { MODES } from '../data/constants';

function ModeScreen({ system, onBack, onStartTraining }) {
  const modes = MODES[system] || [];
  
  const systemTitles = {
    velky: 'Velký systém (PAO)',
    maly: 'Malý systém',
    karty: 'Karetní systém',
    binarni: 'Binární systém'
  };

  const modeIcons = [Target, Zap, TrendingUp];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-white hover:text-primary-200 transition-colors mb-8 text-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zpět na menu
        </button>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Vyberte režim tréninku</h2>
          <p className="text-xl text-primary-100">{systemTitles[system]}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modes.map((mode, index) => {
            const IconComponent = modeIcons[index % modeIcons.length];
            return (
              <div
                key={mode.mode}
                className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                onClick={() => onStartTraining(mode.mode)}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white mb-6 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{mode.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{mode.description}</p>

                <div className="flex items-center text-primary-600 group-hover:text-primary-700 transition-colors">
                  <span className="font-semibold">Začít</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ModeScreen;
