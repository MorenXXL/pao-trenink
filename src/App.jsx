import React, { useState, useEffect } from 'react';
import MenuScreen from './components/MenuScreen';
import ModeScreen from './components/ModeScreen';
import TrainingScreen from './components/TrainingScreen';
import CardSelectionScreen from './components/CardSelectionScreen';
import BinarySequenceScreen from './components/BinarySequenceScreen';
import TextConverterScreen from './components/TextConverterScreen';
import SavedBinaryScreen from './components/SavedBinaryScreen';
import EditScreen from './components/EditScreen';
import { useStorage } from './hooks/useStorage';
import { generateQuestion } from './utils/questionGenerator';

function App() {
  const [screen, setScreen] = useState('menu');
  const [currentSystem, setCurrentSystem] = useState(null);
  const [currentMode, setCurrentMode] = useState(null);
  const [question, setQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [wrongQuestions, setWrongQuestions] = useState([]);
  
  const { data, savedBinaries, saveBinary, deleteBinary, saveSystem, resetSystem } = useStorage();
  
  console.log('App.jsx - saveBinary function:', saveBinary);
  console.log('App.jsx - savedBinaries:', savedBinaries);
  
  const selectSystem = (system) => {
    setCurrentSystem(system);
    setScreen('mode');
  };

  const selectMode = (mode) => {
    setCurrentMode(mode);
    setStats({ correct: 0, wrong: 0 });
    setWrongQuestions([]);
    // For special modes, use appropriate screens
    if (currentSystem === 'karty' && mode === 'pao-cards') {
      setScreen('card-selection');
    } else if (currentSystem === 'binarni' && mode === 'text-utf8') {
      setScreen('text-converter');
    } else if (currentSystem === 'binarni' && mode === 'saved-binary') {
      setScreen('saved-binary');
    } else if (currentSystem === 'binarni' && ['seq-pao', 'pao-seq', 'seq-word', 'word-seq'].includes(mode)) {
      setScreen('binary-sequence');
    } else {
      setScreen('training');
    }
  };

  const generateNextQuestion = () => {
    setShowAnswer(false);
    
    if (wrongQuestions.length > 0) {
      const nextWrong = wrongQuestions[0];
      setWrongQuestions(prev => prev.slice(1));
      setQuestion(nextWrong);
    } else {
      const newQuestion = generateQuestion(currentSystem, currentMode, data);
      setQuestion(newQuestion);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleCorrect = () => {
    setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    generateNextQuestion();
  };
  
  const handleWrong = () => {
    setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    setWrongQuestions(prev => [...prev, question]);
    generateNextQuestion();
  };

  const startEdit = (system) => {
    setCurrentSystem(system);
    setScreen('edit');
  };

  const handleEditSave = (key, value) => {
    const newData = { ...data[currentSystem], [key]: value };
    saveSystem(currentSystem, newData);
  };

  const backToMenu = () => {
    setScreen('menu');
    setCurrentSystem(null);
    setCurrentMode(null);
    setQuestion(null);
    setShowAnswer(false);
  };

  const backToModes = () => {
    setScreen('mode');
    setCurrentMode(null);
    setQuestion(null);
    setShowAnswer(false);
  };

  // Generate first question when training starts
  useEffect(() => {
    if ((screen === 'training' || screen === 'card-selection' || screen === 'binary-sequence') && currentSystem && currentMode && !question) {
      generateNextQuestion();
    }
  }, [screen, currentSystem, currentMode]);
  return (
    <div className="App">
      {screen === 'menu' && (
        <MenuScreen 
          onSelectSystem={selectSystem}
          onEditSystem={startEdit}
        />
      )}

      {screen === 'mode' && (
        <ModeScreen 
          system={currentSystem}
          onBack={backToMenu}
          onStartTraining={selectMode}
        />
      )}

      {screen === 'training' && question && (
        <TrainingScreen 
          question={question}
          showAnswer={showAnswer}
          stats={stats}
          wrongCount={wrongQuestions.length}
          onBack={backToModes}
          onShowAnswer={handleShowAnswer}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
        />
      )}

      {screen === 'edit' && currentSystem && (
        <EditScreen 
          system={currentSystem}
          data={data[currentSystem]}
          onBack={backToMenu}
          onSave={handleEditSave}
          onReset={() => resetSystem(currentSystem)}
        />
      )}

      {screen === 'card-selection' && question && (
        <CardSelectionScreen 
          question={question}
          stats={stats}
          wrongCount={wrongQuestions.length}
          onBack={backToModes}
         onShowAnswer={handleShowAnswer}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
        />
      )}

      {screen === 'binary-sequence' && question && (
        <BinarySequenceScreen 
          question={question}
          mode={currentMode}
          showAnswer={handleShowAnswer}
          stats={stats}
          wrongCount={wrongQuestions.length}
          onBack={backToModes}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
        />
      )}

      {screen === 'text-converter' && (
        <TextConverterScreen 
          onBack={backToModes}
          data={data}
          onSaveBinary={saveBinary}
        />
      )}

      {screen === 'saved-binary' && (
        <SavedBinaryScreen 
          onBack={backToModes}
          savedBinaries={savedBinaries || []}
          onDeleteBinary={deleteBinary}
        />
      )}
    </div>
  );
}

export default App;