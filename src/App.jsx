import React, { useState, useEffect, Suspense, lazy } from 'react';
import MenuScreen from './components/MenuScreen';
import { generateQuestion } from './utils/questionGenerator';
import { DEFAULT_VELKY, DEFAULT_MALY, DEFAULT_BINARNI, SAVED_SEQUENCES } from './data/constants';
import { pickPracticeExercise } from './utils/stats';

// Lazy load screens
const ModeScreen = lazy(() => import('./components/ModeScreen'));
const TrainingScreen = lazy(() => import('./components/TrainingScreen'));
const CardSelectionScreen = lazy(() => import('./components/CardSelectionScreen'));
const BinarySequenceScreen = lazy(() => import('./components/BinarySequenceScreen'));
const TextConverterScreen = lazy(() => import('./components/TextConverterScreen'));
const SummaryScreen = lazy(() => import('./components/SummaryScreen'));
const SavedSequencesListScreen = lazy(() => import('./components/SavedSequencesListScreen'));
const SavedSequenceTrainingScreen = lazy(() => import('./components/SavedSequenceTrainingScreen'));
const SavedSequencesBackupScreen = lazy(() => import('./components/SavedSequencesBackupScreen'));
const ShowSystemScreen = lazy(() => import('./components/ShowSystemScreen'));
const StatisticsScreen = lazy(() => import('./components/StatisticsScreen'));
const PracticeLaunchScreen = lazy(() => import('./components/PracticeLaunchScreen'));

// Fixed reference data — defined in code, no editing/storage at runtime.
const data = { velky: DEFAULT_VELKY, maly: DEFAULT_MALY, binarni: DEFAULT_BINARNI };

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
  const [practicePick, setPracticePick] = useState(null);

  // Sequences: seeded from code (SAVED_SEQUENCES), optionally overridden by a
  // local import (persisted to localStorage on this device). No cloud sync.
  const [savedSequences, setSavedSequences] = useState(() => {
    try {
      const stored = localStorage.getItem('savedSequences');
      return stored ? JSON.parse(stored) : SAVED_SEQUENCES;
    } catch {
      return SAVED_SEQUENCES;
    }
  });

  const importSequences = (importedData) => {
    setSavedSequences(importedData);
    try {
      localStorage.setItem('savedSequences', JSON.stringify(importedData));
    } catch (error) {
      console.error('Failed to save imported sequences:', error);
    }
  };

  const restoreDefaultSequences = () => {
    setSavedSequences(SAVED_SEQUENCES);
    try {
      localStorage.removeItem('savedSequences');
    } catch (error) {
      console.error('Failed to restore default sequences:', error);
    }
  };

  const selectSystem = (system) => {
    setCurrentSystem(system);
    if (system === 'sekvence') {
       // Direct to the sequence list screen, treat "Uložené sekvence" differently
       setScreen('saved-sequences-list');
    } else {
       setScreen('mode');
    }
  };

  // Spustí konkrétní cvičení (systém + režim) – použité jak z menu, tak z „CVIČIT".
  const startExercise = (system, mode) => {
    setCurrentSystem(system);
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
    setQuestion(null); // ensure the first question is freshly generated on restart
    setQuestionStartTime(null);
    setCurrentRecallTime(null);

    // For special modes, use appropriate screens
    if (system === 'karty' && mode === 'pao-cards') {
      setScreen('card-selection');
    } else if (system === 'binarni' && mode === 'text-utf8') {
      setScreen('text-converter');
    } else if (system === 'binarni' && ['seq-pao', 'pao-seq', 'seq-word', 'word-seq'].includes(mode)) {
      setScreen('binary-sequence');
    } else {
      setScreen('training');
    }
  };

  const selectMode = (mode) => startExercise(currentSystem, mode);

  // `overrides` lets callers pass the freshly computed answeredCount / reviewQueue,
  // because state updates from setState are not yet visible inside this same tick.
  const generateNextQuestion = (overrides = {}) => {
    setShowAnswer(false);
    setQuestionStartTime(Date.now());
    setCurrentRecallTime(null);

    const answeredCount = overrides.answeredCount ?? sessionStats.answeredCount;
    const queue = overrides.reviewQueue ?? reviewQueue;

    if (phase === 'training') {
      if (answeredCount >= sessionStats.totalQuestions) {
        // End of training phase
        if (queue.length > 0) {
          setPhase('review');
          // Pick first review item
          const nextReview = queue[0];
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
      if (queue.length === 0) {
        setQuestion(null);
        finishSession();
      } else {
        // Pick a random item from review queue that isn't the current one (if possible)
        let candidateIndex = 0;
        if (queue.length > 1) {
          const availableIndices = queue
            .map((_, idx) => idx)
            .filter(idx => queue[idx] !== currentReviewItem);

          if (availableIndices.length > 0) {
            candidateIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
          }
        }
        const nextReview = queue[candidateIndex];
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
    const newAnsweredCount = phase === 'training'
      ? sessionStats.answeredCount + 1
      : sessionStats.answeredCount;

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

    let nextQueue = reviewQueue;
    if (phase === 'review' && currentReviewItem) {
      // Remove immediately upon correct answer in review mode
      nextQueue = reviewQueue.filter(item => item !== currentReviewItem);
      setReviewQueue(nextQueue);
    }

    generateNextQuestion({ answeredCount: newAnsweredCount, reviewQueue: nextQueue });
  };

  const handleWrong = () => {
    const newAnsweredCount = phase === 'training'
      ? sessionStats.answeredCount + 1
      : sessionStats.answeredCount;

    setSessionStats(prev => ({
      ...prev,
      combo: 0, // Reset combo
      wrong: prev.wrong + 1,
      // Only increment answeredCount in training phase
      answeredCount: phase === 'training' ? prev.answeredCount + 1 : prev.answeredCount
    }));

    // Add to review queue if not already there
    let nextQueue = reviewQueue;
    if (phase === 'training') {
      const newItem = { question: question, successStreak: 0 };
      nextQueue = [...reviewQueue, newItem];
      setReviewQueue(nextQueue);
    } else if (phase === 'review' && currentReviewItem) {
      // Každou chybu opakujeme jen jednou — po pokusu ji z fronty odebereme
      // bez ohledu na to, zda byla podruhé správně nebo špatně.
      nextQueue = reviewQueue.filter(item => item !== currentReviewItem);
      setReviewQueue(nextQueue);
    }

    generateNextQuestion({ answeredCount: newAnsweredCount, reviewQueue: nextQueue });
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

  const showSystem = (systemId) => {
    setCurrentSystem(systemId);
    setScreen('show-system');
  };

  const handlePractice = () => {
    setPracticePick(pickPracticeExercise());
    setScreen('practice-launch');
  };

  const repickPractice = () => {
    setPracticePick(prev => pickPracticeExercise(prev?.key));
  };

  const handleResetRecords = (systemId) => {
    if (window.confirm('Opravdu chcete smazat všechny časové rekordy a statistiky pro tento systém?')) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`record_${systemId}_`) || key.startsWith(`stats_${systemId}_`)) {
          localStorage.removeItem(key);
        }
      });
      alert('Rekordy a statistiky pro tento systém byly úspěšně smazány.');
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
            onResetRecords={handleResetRecords}
            onShowSystem={showSystem}
            onShowStats={() => setScreen('statistics')}
            onPractice={handlePractice}
          />
        )}

        {screen === 'statistics' && (
          <StatisticsScreen onBack={backToMenu} />
        )}

        {screen === 'practice-launch' && (
          <PracticeLaunchScreen
            pick={practicePick}
            onStart={startExercise}
            onAnother={repickPractice}
            onBack={backToMenu}
          />
        )}

        {screen === 'show-system' && currentSystem && (
          <ShowSystemScreen
            system={currentSystem}
            data={data}
            onBack={backToMenu}
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
            onPractice={handlePractice}
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
            onShowAnswer={handleShowAnswer}
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
          />
        )}

        {/* --- Saved Sequences (read-only, defined in code) --- */}
        {screen === 'saved-sequences-list' && (
          <SavedSequencesListScreen
            sequences={savedSequences}
            onBack={backToMenu}
            onTrain={() => {
              if (savedSequences && savedSequences.length > 0) {
                 setTrainingSequenceIndex(0);
                 setScreen('saved-sequence-training');
              }
            }}
            onBackup={() => setScreen('saved-sequence-backup')}
          />
        )}

        {screen === 'saved-sequence-backup' && (
           <SavedSequencesBackupScreen
             sequences={savedSequences}
             onBack={() => setScreen('saved-sequences-list')}
             onImport={importSequences}
             onRestoreDefaults={restoreDefaultSequences}
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
