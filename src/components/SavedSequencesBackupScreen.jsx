import React, { useState } from 'react';
import { ArrowLeft, Download, Upload, Copy, Check, AlertCircle } from 'lucide-react';

function SavedSequencesBackupScreen({ onBack, sequences, onImport }) {
  const [importData, setImportData] = useState('');
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState(null); // 'success', 'error', null

  // Generate JSON string for export
  const exportString = JSON.stringify(sequences || []);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleImport = () => {
    try {
      if (!importData.trim()) {
        throw new Error("Prázdná data");
      }
      
      const parsed = JSON.parse(importData);
      
      if (!Array.isArray(parsed)) {
        throw new Error("Špatný formát dat");
      }
      
      // Basic validation
      const isValid = parsed.every(item => item.id && item.name);
      if (!isValid) {
        throw new Error("Data neobsahují platné sekvence");
      }

      onImport(parsed);
      setImportStatus('success');
      setImportData('');
      
      setTimeout(() => {
        setImportStatus(null);
        onBack(); // Go back after successful import
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setImportStatus('error');
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-800 p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto pb-12">
        <button
          onClick={onBack}
          className="flex items-center text-white hover:text-indigo-200 transition-colors mb-8 text-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zpět na seznam
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-indigo-600 px-8 py-6 text-white text-center">
            <h3 className="text-3xl font-bold mb-2">Export dat</h3>
            <p className="text-indigo-200">Kopírujte text níže a přeneste jej do jiného zařízení</p>
          </div>

          <div className="p-8">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Vaše data pro zálohu ({sequences?.length || 0} sekvencí)
              </label>
              
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 relative">
                <textarea
                  readOnly
                  value={exportString}
                  rows="4"
                  className="w-full bg-transparent resize-none text-sm font-mono text-gray-600 focus:outline-none"
                  onClick={(e) => e.target.select()}
                />
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleCopy}
                  className={`flex items-center px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-md ${
                    copied 
                      ? 'bg-success-500 hover:bg-success-600 text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-6 h-6 mr-2" />
                      Zkopírováno!
                    </>
                  ) : (
                    <>
                      <Copy className="w-6 h-6 mr-2" />
                      Kopírovat kód
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-purple-600 px-8 py-6 text-white text-center">
            <h3 className="text-3xl font-bold mb-2">Import dat</h3>
            <p className="text-purple-200">Vložte zkopírovaný kód z jiného zařízení</p>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg mb-6 flex items-start">
                <AlertCircle className="w-6 h-6 text-orange-500 mr-3 shrink-0 mt-0.5" />
                <p className="text-orange-800 text-sm">
                  <strong>Upozornění:</strong> Importem tohoto kódu se <span className="font-bold underline">přepíšou</span> všechny vaše stávající sekvence na tomto zařízení.
                </p>
              </div>

              <label htmlFor="import-data" className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Vložte záložní text (JSON kód)
              </label>
              
              <textarea
                id="import-data"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder='[{"id":"123","name":"Moje sekvence"...}]'
                rows="5"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors font-mono text-sm"
              />
            </div>
            
            {importStatus === 'error' && (
              <div className="mb-6 text-center text-danger-600 font-semibold bg-danger-50 p-3 rounded-lg">
                Neplatný formát dat! Zkontrolujte, zda jste zkopírovali celý text.
              </div>
            )}

            {importStatus === 'success' && (
              <div className="mb-6 text-center text-success-600 font-semibold bg-success-50 p-3 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 mr-2" />
                Úspěšně importováno, přesměrovávám...
              </div>
            )}
            
            <div className="flex justify-center">
              <button
                onClick={handleImport}
                disabled={!importData.trim() || importStatus === 'success'}
                className="flex items-center bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-md"
              >
                <Upload className="w-6 h-6 mr-2" />
                Nahrát sekvence
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SavedSequencesBackupScreen;
