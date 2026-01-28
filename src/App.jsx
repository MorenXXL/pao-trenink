import React, { useState, useEffect, Suspense, lazy } from 'react';
import MenuScreen from './components/MenuScreen';
import { useStorage } from './hooks/useStorage';
import { generateQuestion } from './utils/questionGenerator';

// Lazy load screens
const ModeScreen = lazy(() => import('./components/ModeScreen'));
const TrainingScreen = lazy(() => import('./components/TrainingScreen'));
const CardSelectionScreen = lazy(() => import('./components/CardSelectionScreen'));
const BinarySequenceScreen = lazy(() => import('./components/BinarySequenceScreen'));
const TextConverterScreen = lazy(() => import('./components/TextConverterScreen'));
const SavedBinaryScreen = lazy(() => import('./components/SavedBinaryScreen'));
const EditScreen = lazy(() => import('./components/EditScreen'));
const SummaryScreen = lazy(() => import('./components/SummaryScreen'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-xl text-primary-600 font-semibold animate-pulse">
      Načítání...
    </div>
  </div>
);

function App() {
  const [screen, setScreen] = useState('menu');

  // Session State
  const [phase, setPhase] = useState('menu'); // 'training', 'review', 'summary'
  const [sessionStats, setSessionStats] = useState({
    score: 0,
    combo: 0,
    maxCombo: 0,
    correct: 0,
    wrong: 0,
    answeredCount: 0,
    totalQuestions: 10
  });

  const [reviewQueue, setReviewQueue] = useState([]); // Array of { question, successStreak }
  const [currentReviewItem, setCurrentReviewItem] = useState(null);

  const [currentSystem, setCurrentSystem] = useState(null);
  const [currentMode, setCurrentMode] = useState(null);
  const [question, setQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const { data, savedBinaries, saveBinary, deleteBinary, saveSystem, resetSystem } = useStorage();

  const selectSystem = (system) => {
    setCurrentSystem(system);
    setScreen('mode');
  };

  const selectMode = (mode) => {
    setCurrentMode(mode);
    setSessionStats({
      score: 0,
      combo: 0,
      maxCombo: 0,
      correct: 0,
      wrong: 0,
      answeredCount: 0,
      totalQuestions: 10
    });
    setReviewQueue([]);
    setCurrentReviewItem(null);
    setPhase('training');

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

    if (phase === 'training') {
      if (sessionStats.answeredCount >= sessionStats.totalQuestions) {
        // End of training phase
        if (reviewQueue.length > 0) {
          setPhase('review');
          // Pick first review item
          const nextReview = reviewQueue[0];
          setCurrentReviewItem(nextReview);
          setQuestion(nextReview.question);
        } else {
          finishSession(); // No errors, go straight to summary
        }
      } else {
        // Next training question
        const newQuestion = generateQuestion(currentSystem, currentMode, data);
        setQuestion(newQuestion);
      }
    } else if (phase === 'review') {
      if (reviewQueue.length === 0) {
        setQuestion(null);
        finishSession();
      } else {
        // Pick a random item from review queue that isn't the current one (if possible)
        let candidateIndex = 0;
        if (reviewQueue.length > 1) {
          const availableIndices = reviewQueue
            .map((_, idx) => idx)
            .filter(idx => reviewQueue[idx] !== currentReviewItem);

          if (availableIndices.length > 0) {
            candidateIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
          }
        }
        const nextReview = reviewQueue[candidateIndex];
        setCurrentReviewItem(nextReview);
        setQuestion(nextReview.question);
      }
    }
  };

  const finishSession = () => {
    setScreen('summary');
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleCorrect = () => {
    // Update Stats
    setSessionStats(prev => {
      const newCombo = prev.combo + 1;
      const points = 100 + (newCombo * 10); // Base 100 + 10 per combo level
      return {
        ...prev,
        score: prev.score + points,
        combo: newCombo,
        maxCombo: Math.max(prev.maxCombo, newCombo),
        correct: prev.correct + 1,
        // Only increment answeredCount in training phase
        answeredCount: phase === 'training' ? prev.answeredCount + 1 : prev.answeredCount
      };
    });

    if (phase === 'review' && currentReviewItem) {
      // Update review item streak
      setReviewQueue(prev => {
        const updated = prev.map(item => {
          if (item === currentReviewItem) {
            return { ...item, successStreak: item.successStreak + 1 };
          }
          return item;
        });
        // Filter out completed ones
        return updated.filter(item => item.successStreak < 3);
      });
    }

    generateNextQuestion();
  };

  const handleWrong = () => {
    setSessionStats(prev => ({
      ...prev,
      combo: 0, // Reset combo
      wrong: prev.wrong + 1,
      // Only increment answeredCount in training phase
      answeredCount: phase === 'training' ? prev.answeredCount + 1 : prev.answeredCount
    }));

    // Add to review queue if not already there
    if (phase === 'training') {
      const newItem = { question: question, successStreak: 0 };
      setReviewQueue(prev => [...prev, newItem]);
    } else if (phase === 'review' && currentReviewItem) {
      setReviewQueue(prev => prev.map(item => {
        if (item === currentReviewItem) {
          return { ...item, successStreak: 0 };
        }
        return item;
      }));
    }

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
      <Suspense fallback={<LoadingSpinner />}>
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
            stats={sessionStats} // Passing full stats object
            phase={phase}
            onBack={backToModes}
            onShowAnswer={handleShowAnswer}
            onCorrect={handleCorrect}
            onWrong={handleWrong}
          />
        )}

        {screen === 'summary' && (
          <SummaryScreen
            stats={sessionStats}
            onHome={backToMenu}
            onRestart={() => selectMode(currentMode)}
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
            stats={sessionStats}
            wrongCount={reviewQueue.length}
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
            stats={sessionStats}
            wrongCount={reviewQueue.length}
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
      </Suspense>
    </div>
  );
}

export default App;