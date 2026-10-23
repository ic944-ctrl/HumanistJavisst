import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestion, AppSettings } from './types';
import {
  getQuizData,
  getLocalCachedData,
  recordQuizCompletion,
  DEFAULT_QUESTIONS,
  DEFAULT_SETTINGS
} from './services/api';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  const initialLocal = getLocalCachedData();
  const [view, setView] = useState<'start' | 'quiz' | 'result'>('start');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [questions, setQuestions] = useState<QuizQuestion[]>(initialLocal.questions || DEFAULT_QUESTIONS);
  const [settings, setSettings] = useState<AppSettings>(initialLocal.settings || DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  // Quiz in-progress state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userChoices, setUserChoices] = useState<Record<number, 'A' | 'B'>>({});
  const [hasSubmittedStats, setHasSubmittedStats] = useState(false);

  // Load configuration from API/cache
  const loadQuizConfig = useCallback(async () => {
    try {
      const data = await getQuizData();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      }
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to load quiz config:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuizConfig();

    // Check if URL has ?admin or #admin
    const checkAdminInUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('admin') || window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    checkAdminInUrl();
    window.addEventListener('hashchange', checkAdminInUrl);
    return () => window.removeEventListener('hashchange', checkAdminInUrl);
  }, [loadQuizConfig]);

  // Start test
  const handleStartQuiz = () => {
    setUserChoices({});
    setCurrentQuestionIndex(0);
    setHasSubmittedStats(false);
    setView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Option selection
  const handleSelectOption = (choice: 'A' | 'B') => {
    const q = questions[currentQuestionIndex];
    if (!q) return;
    setUserChoices((prev) => ({
      ...prev,
      [q.id]: choice
    }));
  };

  // Move to next question or show results
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Finished all questions -> calculate score & submit anonymous stats
      finishQuiz();
    }
  };

  // Move to previous question or return to start
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setView('start');
    }
  };

  // Calculate score and complete
  const finishQuiz = () => {
    let humanistPoints = 0;
    questions.forEach((q) => {
      const choice = userChoices[q.id];
      if (choice) {
        const chosenOption = q.options.find((opt) => opt.id === choice);
        if (chosenOption && chosenOption.isHumanist) {
          humanistPoints += 1;
        }
      }
    });

    const thresholdPct = settings.humanistThresholdPct || 50;
    const userPct = (humanistPoints / questions.length) * 100;
    const isHumanist = userPct >= thresholdPct;

    if (!hasSubmittedStats) {
      setHasSubmittedStats(true);
      recordQuizCompletion(isHumanist);
    }

    setView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retake quiz
  const handleRetake = () => {
    setUserChoices({});
    setCurrentQuestionIndex(0);
    setHasSubmittedStats(false);
    setView('start');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate current score for result view
  const calculateResultStats = () => {
    let score = 0;
    questions.forEach((q) => {
      const choice = userChoices[q.id];
      if (choice) {
        const chosenOption = q.options.find((opt) => opt.id === choice);
        if (chosenOption && chosenOption.isHumanist) {
          score += 1;
        }
      }
    });
    const thresholdPct = settings.humanistThresholdPct || 50;
    const isHumanist = (score / (questions.length || 1)) * 100 >= thresholdPct;
    return { score, isHumanist };
  };

  const currentQ = questions[currentQuestionIndex] || questions[0];
  const currentChoice = currentQ ? userChoices[currentQ.id] || null : null;
  const resultData = calculateResultStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="font-label-md text-primary" style={{ fontFamily: 'Barriecito, cursive' }}>
            Laddar testet...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {view === 'start' && (
        <StartScreen
          questions={questions}
          onStartQuiz={handleStartQuiz}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      )}

      {view === 'quiz' && currentQ && (
        <QuizScreen
          question={currentQ}
          currentIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          selectedChoice={currentChoice}
          onSelectOption={handleSelectOption}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {view === 'result' && (
        <ResultScreen
          isHumanist={resultData.isHumanist}
          score={resultData.score}
          totalQuestions={questions.length}
          settings={settings}
          onRetake={handleRetake}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      )}

      {/* Admin Panel Modal / Overlay */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => {
            setIsAdminOpen(false);
            if (window.location.hash === '#admin') {
              history.replaceState(null, '', window.location.pathname);
            }
          }}
          onRefreshData={loadQuizConfig}
        />
      )}
    </>
  );
}
