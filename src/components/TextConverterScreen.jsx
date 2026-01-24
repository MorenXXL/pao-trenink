import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Save, Trash2 } from 'lucide-react';

function TextConverterScreen({ 
  onBack, 
  data,
  onSaveBinary
}) {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Convert text to UTF-8 binary
  const textToBinary = (text) => {
    return Array.from(text)
      .map(char => {
        const code = char.charCodeAt(0);
        return code.toString(2).padStart(8, '0');
      })
      .join(' ');
  };

  // Convert binary to PAO sequences (group by 6 bits for our system)
  const binaryToPAO = (binaryString) => {
    const cleanBinary = binaryString.replace(/\s/g, '');
    const numbers = [];
    
    // Group into 6-bit chunks (our binary system uses 3-bit pairs)
    for (let i = 0; i < cleanBinary.length; i += 6) {
      const chunk = cleanBinary.substr(i, 6);
      if (chunk.length === 6) {
        const first3 = chunk.substr(0, 3);
        const second3 = chunk.substr(3, 3);
        
        const firstNum = data.binarni[first3] !== undefined ? data.binarni[first3] : 0;
        const secondNum = data.binarni[second3] !== undefined ? data.binarni[second3] : 0;
        const combinedNum = firstNum * 10 + secondNum;
        
        numbers.push(combinedNum);
      }
    }
    
    // Convert numbers to PAO sequences - group by triplets
    const paoLines = [];
    for (let i = 0; i < numbers.length; i += 3) {
      const triplet = numbers.slice(i, i + 3);
      
      if (triplet.length === 3) {
        // Full PAO triplet
        const pao1 = data.velky[triplet[0]] || { person: "Unknown", action: "does", object: "something" };
        const pao2 = data.velky[triplet[1]] || { person: "Unknown", action: "does", object: "something" };
        const pao3 = data.velky[triplet[2]] || { person: "Unknown", action: "does", object: "something" };
        
        paoLines.push(`${pao1.person} ${pao2.action} ${pao3.object}`);
      } else if (triplet.length === 2) {
        // Incomplete PA (Person + Action only)
        const pao1 = data.velky[triplet[0]] || { person: "Unknown", action: "does", object: "something" };
        const pao2 = data.velky[triplet[1]] || { person: "Unknown", action: "does", object: "something" };
        
        paoLines.push(`${pao1.person} ${pao2.action}`);
      } else if (triplet.length === 1) {
        // Only Person
        const pao1 = data.velky[triplet[0]] || { person: "Unknown", action: "does", object: "something" };
        
        paoLines.push(`${pao1.person}`);
      }
    }
    
    return paoLines.join('\n');
  };

  // Convert to numeric sequences for display
  const binaryToNumbers = (binaryString) => {
    const cleanBinary = binaryString.replace(/\s/g, '');
    const numbers = [];
    
    for (let i = 0; i < cleanBinary.length; i += 6) {
      const chunk = cleanBinary.substr(i, 6);
      if (chunk.length === 6) {
        const first3 = chunk.substr(0, 3);
        const second3 = chunk.substr(3, 3);
        
        const firstNum = data.binarni[first3] !== undefined ? data.binarni[first3] : 0;
        const secondNum = data.binarni[second3] !== undefined ? data.binarni[second3] : 0;
        const combinedNum = firstNum * 10 + secondNum;
        
        numbers.push(combinedNum.toString().padStart(2, '0'));
      }
    }
    
    return numbers.join(' ');
  };

  const handleConvert = () => {
    if (inputText.trim()) {
      const binaryCode = textToBinary(inputText.trim());
      const paoSequence = binaryToPAO(binaryCode);
      const numberSequence = binaryToNumbers(binaryCode);
      
      setResult({
        text: inputText.trim(),
        binary: binaryCode,
        numbers: numberSequence,
        pao: paoSequence,
        timestamp: new Date().toISOString()
      });
      setShowResult(true);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setShowResult(false);
  };

  const handleSave = () => {
    console.log('Save button clicked');
    console.log('Result:', result);
    console.log('onSaveBinary function:', onSaveBinary);
    if (result && onSaveBinary) {
      console.log('Saving binary data:', result);
      onSaveBinary(result);
      alert('ULOŽENO!');
      handleClear();
    } else {
      console.log('Cannot save - missing result or onSaveBinary function');
      console.log('Result exists:', !!result);
      console.log('onSaveBinary exists:', !!onSaveBinary);
    }
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

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 text-white px-8 py-4">
            <h3 className="text-xl font-bold text-center">Text → UTF-8 Binární převodník</h3>
          </div>

          <div className="p-12">
            {!showResult ? (
              /* Input Section */
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Zadejte text k převodu
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="textInput" className="block text-lg font-semibold text-gray-700 mb-3">
                      Váš text:
                    </label>
                    <textarea
                      id="textInput"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Napište text, který chcete převést na binární kód..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-0 text-lg resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleConvert}
                      disabled={!inputText.trim()}
                      className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      Převeď na binární kód
                    </button>
                    <button
                      onClick={handleClear}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-4 rounded-xl text-lg font-semibold transition-colors shadow-lg"
                    >
                      Vymazat
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Result Section */
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Výsledek převodu
                  </h2>
                  <p className="text-lg text-gray-600">
                    Text: <span className="font-semibold">{result.text}</span>
                  </p>
                </div>

                {/* Binary code */}
                <div className="bg-success-50 border border-success-200 rounded-2xl p-6">
                  <div className="text-lg font-semibold text-success-600 mb-3 text-center">
                    UTF-8 Binární kód:
                  </div>
                  <div className="text-base font-mono text-success-700 text-center break-all leading-relaxed">
                    {result.binary}
                  </div>
                </div>
                
                {/* Number sequence */}
                <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6">
                  <div className="text-lg font-semibold text-primary-600 mb-3 text-center">
                    Číselné sekvence:
                  </div>
                  <div className="text-xl font-bold text-primary-700 text-center">
                    {result.numbers}
                  </div>
                </div>
                
                {/* PAO sequences */}
                <div className="bg-warning-50 border border-warning-200 rounded-2xl p-6">
                  <div className="text-lg font-semibold text-warning-600 mb-3 text-center">
                    PAO výrazy:
                  </div>
                  <div className="text-lg font-bold text-warning-700 text-center whitespace-pre-line">
                    {result.pao}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center bg-success-600 hover:bg-success-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Uložit
                  </button>
                  <button
                    onClick={handleClear}
                    className="flex items-center bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Nový převod
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

export default TextConverterScreen;
