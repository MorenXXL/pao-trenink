import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { KARTY_SYSTEM } from '../data/constants';

const TITLES = {
  velky: 'Velký systém (PAO)',
  maly: 'Malý systém',
  binarni: 'Binární systém',
  karty: 'Karetní systém'
};

// Build { columns, rows } for the given system.
function buildTable(system, data) {
  if (system === 'velky') {
    const rows = Object.entries(data.velky || {})
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([num, pao]) => [num.padStart(2, '0'), pao.person, pao.action, pao.object]);
    return { columns: ['Číslo', 'Person', 'Action', 'Object'], rows };
  }

  if (system === 'maly') {
    const rows = Object.entries(data.maly || {})
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([num, word]) => [num.padStart(2, '0'), word]);
    return { columns: ['Číslo', 'Slovo'], rows };
  }

  if (system === 'binarni') {
    const rows = Object.entries(data.binarni || {})
      .sort((a, b) => a[1] - b[1])
      .map(([bin, num]) => [num.toString(), bin]);
    return { columns: ['Číslo', 'Binární'], rows };
  }

  // karty
  const rows = Object.entries(KARTY_SYSTEM)
    .sort((a, b) => a[1].number - b[1].number)
    .map(([card, d]) => [card, d.number.toString().padStart(2, '0'), d.person, d.action, d.object]);
  return { columns: ['Karta', 'Číslo', 'Person', 'Action', 'Object'], rows };
}

function ShowSystemScreen({ system, data, onBack }) {
  const { columns, rows } = buildTable(system, data);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-white hover:text-primary-200 transition-colors mb-6 text-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zpět do menu
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">{TITLES[system]}</h2>
          <p className="text-primary-100 mt-1">Přehled celého systému ({rows.length} položek)</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="max-h-[75vh] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-primary-600 text-white">
                  {columns.map((col, i) => (
                    <th
                      key={col}
                      className={`px-4 py-3 text-sm font-bold uppercase tracking-wide ${i === 0 ? 'w-16 text-center' : ''}`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`px-4 py-2.5 ${
                          ci === 0
                            ? 'text-center font-bold text-primary-700 whitespace-nowrap'
                            : 'text-gray-800'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowSystemScreen;
