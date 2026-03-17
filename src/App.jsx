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
const SavedSequencesListScreen = lazy(() => import('./components/SavedSequencesListScreen'));
const SavedSequenceEditScreen = lazy(() => import('./components/SavedSequenceEditScreen'));
const SavedSequenceTrainingScreen = lazy(() => import('./components/SavedSequenceTrainingScreen'));

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
    totalQuestions: 10,
    fastestTime: Infinity,
    totalCorrectTime: 0,
    trainingCorrect: 0
  });

  const [reviewQueue, setReviewQueue] = useState([]); // Array of { question, successStreak }
  const [currentReviewItem, setCurrentReviewItem] = useState(null);

  const [currentSystem, setCurrentSystem] = useState(null);
  const [currentMode, setCurrentMode] = useState(null);
  const [question, setQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [currentRecallTime, setCurrentRecallTime] = useState(null);

  const [trainingSequenceIndex, setTrainingSequenceIndex] = useState(0);

  const { data, savedBinaries, saveBinary, deleteBinary, savedSequences, saveSequence, deleteSequence, saveSystem, resetSystem } = useStorage();

  const selectSystem = (system) => {
    setCurrentSystem(system);
    if (system === 'sekvence') {
       // Direct to the sequence list screen, treat "Uložené sekvence" differently
       setScreen('saved-sequences-list');
    } else {
       setScreen('mode');
    }
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
      totalQuestions: 10,
      fastestTime: Infinity,
      totalCorrectTime: 0,
      trainingCorrect: 0
    });
    setReviewQueue([]);
    setCurrentReviewItem(null);
    setPhase('training');
    setQuestionStartTime(null);
    setCurrentRecallTime(null);

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
    setQuestionStartTime(Date.now());
    setCurrentRecallTime(null);

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
    if (questionStartTime && currentRecallTime === null) {
      setCurrentRecallTime((Date.now() - questionStartTime) / 1000);
    }
  };

  const handleCorrect = () => {
    const recallTime = currentRecallTime;

    // Update Stats
    setSessionStats(prev => {
      const newCombo = prev.combo + 1;
      const points = 100 + (newCombo * 10); // Base 100 + 10 per combo level

      let newFastestTime = prev.fastestTime;
      let newTotalCorrectTime = prev.totalCorrectTime;
      let newTrainingCorrect = prev.trainingCorrect || 0;

      if (phase === 'training' && recallTime !== null) {
        newFastestTime = Math.min(prev.fastestTime, recallTime);
        newTotalCorrectTime += recallTime;
        newTrainingCorrect += 1;
      }

      return {
        ...prev,
        score: prev.score + points,
        combo: newCombo,
        maxCombo: Math.max(prev.maxCombo, newCombo),
        correct: prev.correct + 1,
        // Only increment answeredCount in training phase
        answeredCount: phase === 'training' ? prev.answeredCount + 1 : prev.answeredCount,
        fastestTime: newFastestTime,
        totalCorrectTime: newTotalCorrectTime,
        trainingCorrect: newTrainingCorrect
      };
    });

    if (phase === 'review' && currentReviewItem) {
      // Remove immediately upon correct answer in review mode
      setReviewQueue(prev => prev.filter(item => item !== currentReviewItem));
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
    if (system === 'sekvence') {
      // Direct edit button from menu for sekvence goes to list instead
      setScreen('saved-sequences-list');
    } else {
      setScreen('edit');
    }
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

  const handleResetRecords = (systemId) => {
    if (window.confirm('Opravdu chcete smazat všechny časové rekordy pro tento systém?')) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`record_${systemId}_`)) {
          localStorage.removeItem(key);
        }
      });
      alert('Rekordy pro tento systém byly úspěšně smazány.');
    }
  };

  const handleResetSystem = (systemId) => {
    if (window.confirm('Opravdu chcete resetovat tento systém do výchozích hodnot? Vaše vlastní úpravy v tomto systému budou ztraceny.')) {
      resetSystem(systemId);
      alert('Systém byl resetován do výchozích hodnot.');
    }
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
            onResetSystem={handleResetSystem}
            onResetRecords={handleResetRecords}
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
            system={currentSystem}
            mode={currentMode}
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

        {/* --- New Saved Sequences Screens --- */}
        {screen === 'saved-sequences-list' && (
          <SavedSequencesListScreen
            sequences={savedSequences}
            onBack={backToMenu}
            onAdd={() => {
              setCurrentSystem('sekvence');
              setQuestion(null); // use question state to pass selected sequence to edit
              setScreen('saved-sequence-edit');
            }}
            onEdit={(seq) => {
              setCurrentSystem('sekvence');
              setQuestion(seq); // Pass sequence
              setScreen('saved-sequence-edit');
            }}
            onDelete={deleteSequence}
            onTrain={() => {
              if (savedSequences && savedSequences.length > 0) {
                 setTrainingSequenceIndex(0);
                 setScreen('saved-sequence-training');
              }
            }}
          />
        )}

        {screen === 'saved-sequence-edit' && (
           <SavedSequenceEditScreen
             sequence={question} // contains sequence data
             onSave={(data) => {
               saveSequence(data);
               setScreen('saved-sequences-list');
             }}
             onCancel={() => setScreen('saved-sequences-list')}
           />
        )}

        {screen === 'saved-sequence-training' && savedSequences && savedSequences.length > 0 && (
           <SavedSequenceTrainingScreen
             sequence={savedSequences[trainingSequenceIndex]}
             isFirst={trainingSequenceIndex === 0}
             isLast={trainingSequenceIndex === savedSequences.length - 1}
             onNext={() => {
                if (trainingSequenceIndex < savedSequences.length - 1) {
                   setTrainingSequenceIndex(trainingSequenceIndex + 1);
                }
             }}
             onPrev={() => {
                if (trainingSequenceIndex > 0) {
                   setTrainingSequenceIndex(trainingSequenceIndex - 1);
                }
             }}
             onBack={() => setScreen('saved-sequences-list')}
           />
        )}
      </Suspense>
    </div>
  );
}

export default App;