import React, { useState } from 'react';
import { ArrowLeft, Trash2, Eye } from 'lucide-react';

function SavedBinaryScreen({ 
  onBack, 
  savedBinaries,
  onDeleteBinary
}) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleDelete = (id) => {
    if (confirm('Opravdu smazat tento uložený převod?')) {
      onDeleteBinary(id);
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const handleBack = () => {
    if (selectedItem) {
      setSelectedItem(null);
    } else {
      onBack();
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('cs-CZ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center text-white hover:text-primary-200 transition-colors mb-8 text-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {selectedItem ? 'Zpět na seznam' : 'Zpět na režimy'}
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 text-white px-8 py-4">
            <h3 className="text-xl font-bold text-center">
              {selectedItem ? 'Detail binárního kódu' : 'Uložené binární kódy'}
            </h3>
          </div>

          <div className="p-8">
            {!selectedItem ? (
              /* List View */
              <div>
                {savedBinaries.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-500 mb-4">Žádné uložené binární kódy</p>
                    <p className="text-gray-400">Použijte režim "Text → UTF-8 Binární" pro vytvoření a uložení převodů</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <p className="text-lg text-gray-600">
                        Celkem uloženo: <span className="font-bold">{savedBinaries.length}</span> převodů
                      </p>
                    </div>
                    
                    <div className="grid gap-4">
                      {savedBinaries.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-lg text-gray-900 mb-1">
                              {item.text}
                            </div>
                            <div className="text-sm text-gray-500">
                              Uloženo: {formatDate(item.timestamp)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemClick(item);
                              }}
                              className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                              className="p-2 text-danger-600 hover:bg-danger-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Detail View */
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Detail převodu
                  </h2>
                  <p className="text-lg text-gray-600">
                    Uloženo: {formatDate(selectedItem.timestamp)}
                  </p>
                </div>

                {/* Original text */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <div className="text-lg font-semibold text-gray-600 mb-3 text-center">
                    Původní text:
                  </div>
                  <div className="text-2xl font-bold text-gray-900 text-center">
                    {selectedItem.text}
                  </div>
                </div>

                {/* Binary code */}
                <div className="bg-success-50 border border-success-200 rounded-2xl p-6">
                  <div className="text-lg font-semibold text-success-600 mb-3 text-center">
                    UTF-8 Binární kód:
                  </div>
                  <div className="text-base font-mono text-success-700 text-center break-all leading-relaxed">
                    {selectedItem.binary}
                  </div>
                </div>
                
                {/* Number sequence */}
                <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6">
                  <div className="text-lg font-semibold text-primary-600 mb-3 text-center">
                    Číselné sekvence:
                  </div>
                  <div className="text-xl font-bold text-primary-700 text-center">
                    {selectedItem.numbers}
                  </div>
                </div>
                
                {/* PAO sequences */}
                <div className="bg-warning-50 border border-warning-200 rounded-2xl p-6">
                  <div className="text-lg font-semibold text-warning-600 mb-3 text-center">
                    PAO výrazy:
                  </div>
                  <div className="text-lg font-bold text-warning-700 text-center whitespace-pre-line">
                    {selectedItem.pao}
                  </div>
                </div>

                {/* Action button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleDelete(selectedItem.id)}
                    className="flex items-center bg-danger-600 hover:bg-danger-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Smazat tento převod
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

export default SavedBinaryScreen;
