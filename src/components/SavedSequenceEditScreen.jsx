import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';

function SavedSequenceEditScreen({ sequence, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    pao: ''
  });

  useEffect(() => {
    if (sequence) {
      setFormData({
        name: sequence.name || '',
        value: sequence.value || '',
        pao: sequence.pao || ''
      });
    }
  }, [sequence]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave({
      ...sequence, // Keep ID if editing
      ...formData
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-800 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onCancel}
          className="flex items-center text-white hover:text-indigo-200 transition-colors mb-8 text-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zpět na seznam
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-indigo-600 text-white px-8 py-6">
            <h3 className="text-2xl font-bold">
              {sequence ? 'Upravit sekvenci' : 'Nová sekvence'}
            </h3>
            <p className="text-indigo-200 mt-1">
              Vyplňte údaje pro trénink
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Název sekvence */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Název sekvence <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Např. Rodné číslo Vojta"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg"
                required
              />
              <p className="mt-2 text-sm text-gray-500">Zobrazí se na přední straně karty.</p>
            </div>

            {/* Hodnota */}
            <div>
              <label htmlFor="value" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Hodnota (Číslo / Text)
              </label>
              <textarea
                id="value"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="Zadejte hodnotu k zapamatování..."
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg resize-none"
              />
            </div>

            {/* PAO */}
            <div>
              <label htmlFor="pao" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                PAO převod
              </label>
              <textarea
                id="pao"
                name="pao"
                value={formData.pao}
                onChange={handleChange}
                placeholder="Zadejte pomocný PAO příběh nebo sekvenci..."
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg resize-none"
              />
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors flex items-center"
              >
                <X className="w-5 h-5 mr-2" />
                Zrušit
              </button>
              <button
                type="submit"
                disabled={!formData.name.trim()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl font-semibold transition-colors flex items-center shadow-lg hover:shadow-xl"
              >
                <Save className="w-5 h-5 mr-2" />
                Uložit sekvenci
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SavedSequenceEditScreen;
