import React from 'react';
import { Brain, Edit3, Layers, Binary, Spade } from 'lucide-react';
function MenuScreen({ onSelectSystem, onEditSystem }) {
  const systems = [
    {
      id: 'velky',
      title: 'Velký systém (PAO)',
      description: 'Trénink Person-Action-Object systému pro zapamatování čísel',
      icon: Brain,
      color: 'primary',
      editable: true
    },
    {
      id: 'maly',
      title: 'Malý systém',
      description: 'Dvojčísla převedená na slova pro rychlé zapamatování',
      icon: Layers,
      color: 'success',
      editable: true
    },
    {
      id: 'karty',
      title: 'Karetní systém',
      description: 'Trénink zapamatování pořadí hracích karet',
      icon: Spade,
      color: 'danger',
      editable: false
    },
    {
      id: 'binarni',
      title: 'Binární systém',
      description: 'Převod binárních čísel 000-111 na desítková čísla',
      icon: Binary,
      color: 'warning',
      editable: true
    }
  ];

  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-success-500 to-success-600',
    danger: 'from-danger-500 to-danger-600',
    warning: 'from-warning-500 to-warning-600'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">PAO Trénink</h1>
          <p className="text-xl text-primary-100">Moderní trénink paměti pro lepší zapamatování</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {systems.map((system) => {
            const IconComponent = system.icon;
            return (
              <div
                key={system.id}
                className="relative group bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                onClick={() => onSelectSystem(system.id)}
              >
                {system.editable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSystem(system.id);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}

                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${colorClasses[system.color]} text-white mb-6`}>
                  <IconComponent className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{system.title}</h3>
                <p className="text-gray-600 leading-relaxed">{system.description}</p>

                <div className="mt-6 flex items-center text-primary-600 group-hover:text-primary-700 transition-colors">
                  <span className="font-semibold">Začít trénink</span>
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

export default MenuScreen;
