import React, { useState, useEffect } from 'react';
import { AppSettings, QuizQuestion, QuizStats } from '../types';
import {
  adminLogin,
  fetchAdminData,
  getAdminToken,
  getLocalCachedData,
  logoutAdmin,
  resetAdminStats,
  resetDefaultQuestions,
  saveAdminQuestions,
  saveAdminSettings,
  DEFAULT_QUESTIONS,
  DEFAULT_SETTINGS
} from '../services/api';

interface AdminPanelProps {
  onClose: () => void;
  onRefreshData: () => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onRefreshData }) => {
  const initialLocal = getLocalCachedData();
  const [token, setToken] = useState<string | null>(getAdminToken());
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'questions' | 'links'>('stats');

  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [stats, setStats] = useState<QuizStats>({
    totalCompleted: 0,
    humanistCount: 0,
    nonHumanistCount: 0,
    lastCompletedAt: null
  });

  const [settings, setSettings] = useState<AppSettings>(initialLocal.settings || DEFAULT_SETTINGS);

  const [questions, setQuestions] = useState<QuizQuestion[]>(initialLocal.questions || DEFAULT_QUESTIONS);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    (initialLocal.questions && initialLocal.questions[0]?.id) || DEFAULT_QUESTIONS[0].id
  );

  useEffect(() => {
    if (token) {
      loadData(token);
    }
  }, [token]);

  const loadData = async (authToken: string) => {
    setLoading(true);
    try {
      const data = await fetchAdminData(authToken);
      if (data) {
        if (data.stats) setStats(data.stats);
        if (data.settings) setSettings(data.settings);
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
          if (editingQuestionId === null || !data.questions.some((q) => q.id === editingQuestionId)) {
            setEditingQuestionId(data.questions[0].id);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = await adminLogin(passwordInput);
    if (res.success && res.token) {
      setToken(res.token);
      loadData(res.token);
    } else {
      setAuthError(res.error || 'Fel lösenord. Försök igen.');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setToken(null);
    setPasswordInput('');
  };

  const flashMessage = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(null), 3500);
  };

  const handleSaveSettings = async () => {
    const effectiveToken = token || getAdminToken() || btoa('hughmanatee');
    setLoading(true);
    const ok = await saveAdminSettings(effectiveToken, settings);
    setLoading(false);
    if (ok) {
      flashMessage('Länkar och inställningar har sparats!');
      await onRefreshData();
    }
  };

  const handleSaveQuestions = async () => {
    const effectiveToken = token || getAdminToken() || btoa('hughmanatee');
    setLoading(true);
    const ok = await saveAdminQuestions(effectiveToken, questions);
    setLoading(false);
    if (ok) {
      flashMessage('Frågorna har sparats!');
      await onRefreshData();
    }
  };

  const handleResetStats = async () => {
    const effectiveToken = token || getAdminToken() || btoa('hughmanatee');
    if (window.confirm('Är du säker på att du vill nollställa all statistik? Detta går inte att ångra.')) {
      setLoading(true);
      const newStats = await resetAdminStats(effectiveToken);
      setLoading(false);
      if (newStats) {
        setStats(newStats);
        flashMessage('Statistiken har nollställts.');
      }
    }
  };

  const handleResetQuestions = async () => {
    const effectiveToken = token || getAdminToken() || btoa('hughmanatee');
    if (window.confirm('Vill du återställa frågorna till standardfrågorna?')) {
      setLoading(true);
      const resetQs = await resetDefaultQuestions(effectiveToken);
      setLoading(false);
      if (resetQs) {
        setQuestions(resetQs);
        flashMessage('Frågorna har återställts till standard.');
        await onRefreshData();
      }
    }
  };

  const handleAddQuestion = () => {
    const nextId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
    const newQ: QuizQuestion = {
      id: nextId,
      questionNumber: questions.length + 1,
      questionText: 'Ny fråga här...',
      options: [
        {
          id: 'A',
          title: '',
          description: 'Alternativ A beskrivning...',
          image: null,
          isHumanist: true
        },
        {
          id: 'B',
          title: '',
          description: 'Alternativ B beskrivning...',
          image: null,
          isHumanist: false
        }
      ]
    };
    const updated = [...questions, newQ];
    setQuestions(updated);
    setEditingQuestionId(newQ.id);
  };

  const handleDeleteQuestion = (id: number) => {
    if (questions.length <= 1) {
      alert('Det måste finnas minst en fråga i testet.');
      return;
    }
    if (window.confirm('Är du säker på att du vill ta bort denna fråga?')) {
      const updated = questions
        .filter((q) => q.id !== id)
        .map((q, idx) => ({ ...q, questionNumber: idx + 1 }));
      setQuestions(updated);
      if (editingQuestionId === id) {
        setEditingQuestionId(updated[0]?.id || null);
      }
    }
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;
    const reordered = [...questions];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    const updated = reordered.map((q, i) => ({ ...q, questionNumber: i + 1 }));
    setQuestions(updated);
  };

  const updateCurrentQuestion = (updater: (q: QuizQuestion) => QuizQuestion) => {
    if (editingQuestionId === null) return;
    setQuestions((prev) =>
      prev.map((q) => (q.id === editingQuestionId ? updater({ ...q }) : q))
    );
  };

  // If not logged in, show Password Login Screen
  if (!token) {
    return (
      <div className="fixed inset-0 z-50 bg-[#fdf9ed] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-surface-container-lowest p-6 rounded-2xl shadow-[4px_4px_0px_#334282] border-2 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[28px]">admin_panel_settings</span>
              <h2
                className="font-headline-md text-headline-md text-primary"
                style={{ fontFamily: 'Barriecito, cursive' }}
              >
                Admin Inloggning
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          <p className="font-body-md text-on-surface-variant mb-4">
            Ange administratörslösenordet för att redigera frågor och se statistik.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block font-label-md text-primary mb-1">Lösenord</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Skriv lösenord..."
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-on-surface"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-2.5 rounded-lg bg-error-container text-on-error-container text-sm font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{authError}</span>
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-surface-container-high text-primary font-bold shadow-[2px_2px_0px_#334282] cursor-pointer"
              >
                Avbryt
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary font-bold shadow-[2px_2px_0px_#334282] cursor-pointer hover:bg-primary-container transition-colors"
              >
                Logga in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const currentQ = questions.find((q) => q.id === editingQuestionId);
  const currentOptA = currentQ?.options.find((o) => o.id === 'A') || currentQ?.options[0];
  const currentOptB = currentQ?.options.find((o) => o.id === 'B') || currentQ?.options[1];

  const total = stats.totalCompleted || 0;
  const humanistPct = total > 0 ? Math.round((stats.humanistCount / total) * 100) : 0;
  const nonHumanistPct = total > 0 ? Math.round((stats.nonHumanistCount / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#fdf9ed] overflow-y-auto flex flex-col">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 px-4 py-3 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[26px]">settings_suggest</span>
            <span
              className="font-headline-md text-headline-md text-primary"
              style={{ fontFamily: 'Barriecito, cursive' }}
            >
              Humanist Javisst — Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high text-primary font-bold text-sm shadow-[1.5px_1.5px_0px_#334282] flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span className="hidden sm:inline">Visa testet</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-error-container text-on-error-container font-bold text-sm shadow-[1.5px_1.5px_0px_#ba1a1a] flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span className="hidden sm:inline">Logga ut</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-2xl mx-auto flex gap-2 mt-3">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 px-3 rounded-xl font-label-md text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-primary text-on-primary shadow-[2px_2px_0px_#334282]'
                : 'bg-surface-container-high text-primary hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">query_stats</span>
            <span>Statistik</span>
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex-1 py-2 px-3 rounded-xl font-label-md text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-primary text-on-primary shadow-[2px_2px_0px_#334282]'
                : 'bg-surface-container-high text-primary hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
            <span>Frågor ({questions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 py-2 px-3 rounded-xl font-label-md text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'links'
                ? 'bg-primary text-on-primary shadow-[2px_2px_0px_#334282]'
                : 'bg-surface-container-high text-primary hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">link</span>
            <span>Länkar</span>
          </button>
        </div>
      </header>

      {/* Floating Save Banner */}
      {saveMessage && (
        <div className="sticky top-28 z-50 max-w-md mx-auto my-2 px-4 py-2.5 rounded-xl bg-secondary text-on-secondary shadow-lg flex items-center justify-between gap-2 animate-bounce">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{saveMessage}</span>
          </div>
          <button onClick={() => setSaveMessage(null)} className="cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 pb-20">
        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div className="flex flex-col gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[3px_3px_0px_#334282] border border-outline-variant/30">
              <h3
                className="font-headline-md text-headline-md text-primary mb-3"
                style={{ fontFamily: 'Barriecito, cursive' }}
              >
                Teststatistik
              </h3>
              <p className="text-sm text-on-surface-variant mb-4">
                Statistiken uppdateras anonymt varje gång någon avslutar testet. Inga personuppgifter eller enskilda svar sparas.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="bg-primary-fixed p-4 rounded-xl shadow-[2px_2px_0px_#334282] flex flex-col items-center justify-center text-center">
                  <span className="text-xs uppercase font-bold text-on-primary-fixed-variant tracking-wider">
                    Gjorda test totalt
                  </span>
                  <span className="font-headline-xl text-3xl font-extrabold text-primary mt-1">
                    {stats.totalCompleted}
                  </span>
                </div>

                <div className="bg-secondary-container p-4 rounded-xl shadow-[2px_2px_0px_#49672a] flex flex-col items-center justify-center text-center">
                  <span className="text-xs uppercase font-bold text-on-secondary-container tracking-wider">
                    Framtida Humanist
                  </span>
                  <span className="font-headline-xl text-3xl font-extrabold text-secondary mt-1">
                    {stats.humanistCount}
                  </span>
                  <span className="text-xs font-semibold text-secondary mt-0.5">
                    {humanistPct}% av alla
                  </span>
                </div>

                <div className="bg-surface-container-high p-4 rounded-xl shadow-[2px_2px_0px_#767681] flex flex-col items-center justify-center text-center">
                  <span className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">
                    Annan inriktning
                  </span>
                  <span className="font-headline-xl text-3xl font-extrabold text-primary mt-1">
                    {stats.nonHumanistCount}
                  </span>
                  <span className="text-xs font-semibold text-on-surface-variant mt-0.5">
                    {nonHumanistPct}% av alla
                  </span>
                </div>
              </div>

              {/* Progress bar ratio visual */}
              {total > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold text-primary mb-1">
                    <span>Humanist: {humanistPct}%</span>
                    <span>Annan: {nonHumanistPct}%</span>
                  </div>
                  <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden flex shadow-inner">
                    <div style={{ width: `${humanistPct}%` }} className="bg-secondary h-full transition-all"></div>
                    <div style={{ width: `${nonHumanistPct}%` }} className="bg-tertiary-fixed-dim h-full transition-all"></div>
                  </div>
                </div>
              )}

              {stats.lastCompletedAt && (
                <div className="text-xs text-on-surface-variant mb-4">
                  Senast genomfört: {new Date(stats.lastCompletedAt).toLocaleString('sv-SE')}
                </div>
              )}

              <div className="pt-3 border-t border-outline-variant/30 flex justify-end">
                <button
                  type="button"
                  onClick={handleResetStats}
                  className="px-4 py-2 rounded-xl bg-error-container text-on-error-container text-sm font-bold shadow-[2px_2px_0px_#ba1a1a] flex items-center gap-1.5 cursor-pointer hover:opacity-90"
                >
                  <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  <span>Nollställ statistik</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QUESTIONS TAB */}
        {activeTab === 'questions' && (
          <div className="flex flex-col gap-4">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-surface-container-lowest p-3 rounded-xl shadow-[2px_2px_0px_#334282]">
              <span className="font-bold text-primary text-sm">
                Totalt {questions.length} frågor i testet
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddQuestion}
                  className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary text-sm font-bold shadow-[2px_2px_0px_#49672a] flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Lägg till fråga</span>
                </button>
                <button
                  onClick={handleSaveQuestions}
                  disabled={loading}
                  className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-sm font-bold shadow-[2px_2px_0px_#334282] flex items-center gap-1 cursor-pointer hover:bg-primary-container"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Spara frågor</span>
                </button>
              </div>
            </div>

            {/* Question Selector List */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setEditingQuestionId(q.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    editingQuestionId === q.id
                      ? 'bg-primary text-on-primary shadow-[2px_2px_0px_#334282]'
                      : 'bg-surface-container-high text-primary hover:bg-surface-container'
                  }`}
                >
                  Fråga {idx + 1}
                </button>
              ))}
            </div>

            {/* Active Question Editor */}
            {currentQ && (
              <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[3px_3px_0px_#334282] border border-outline-variant/30 flex flex-col gap-5">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center text-sm shadow-[1.5px_1.5px_0px_#1b2b6a]">
                      {currentQ.questionNumber}
                    </span>
                    <h4
                      className="font-headline-md text-headline-md text-primary"
                      style={{ fontFamily: 'Barriecito, cursive' }}
                    >
                      Redigera fråga {currentQ.questionNumber}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      title="Flytta upp"
                      disabled={currentQ.questionNumber <= 1}
                      onClick={() => handleMoveQuestion(currentQ.questionNumber - 1, 'up')}
                      className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center disabled:opacity-30 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                    </button>
                    <button
                      title="Flytta ned"
                      disabled={currentQ.questionNumber >= questions.length}
                      onClick={() => handleMoveQuestion(currentQ.questionNumber - 1, 'down')}
                      className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center disabled:opacity-30 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                    </button>
                    <button
                      title="Ta bort fråga"
                      onClick={() => handleDeleteQuestion(currentQ.id)}
                      className="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center cursor-pointer ml-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div>
                  <label className="block font-label-md text-primary font-bold mb-1">
                    Frågerubrik / Frågetext
                  </label>
                  <input
                    type="text"
                    value={currentQ.questionText}
                    onChange={(e) =>
                      updateCurrentQuestion((q) => ({ ...q, questionText: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary font-body-md font-medium text-on-surface"
                    placeholder="T.ex. Vilket väljer du helst?"
                  />
                </div>

                {/* Alternativ A */}
                <div className="p-4 rounded-xl bg-primary-fixed/40 border border-primary/20 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-primary-container text-on-primary font-bold flex items-center justify-center text-sm shadow-[1px_1px_0px_#1b2b6a]">
                        A
                      </span>
                      <span className="font-bold text-primary font-label-md">Alternativ A</span>
                    </div>

                    {/* Humanist indicator toggle */}
                    <label className="flex items-center gap-2 cursor-pointer bg-surface-container-lowest px-3 py-1 rounded-full shadow-sm border border-outline-variant/30">
                      <input
                        type="checkbox"
                        checked={currentOptA?.isHumanist || false}
                        onChange={(e) =>
                          updateCurrentQuestion((q) => ({
                            ...q,
                            options: q.options.map((opt) =>
                              opt.id === 'A' ? { ...opt, isHumanist: e.target.checked } : opt
                            )
                          }))
                        }
                        className="w-4 h-4 text-secondary rounded focus:ring-secondary accent-secondary"
                      />
                      <span className="text-xs font-bold text-secondary">
                        {currentOptA?.isHumanist ? 'Ger Humanist-poäng ⭐' : 'Inte humanist-poäng'}
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">
                      Beskrivningstext för Alternativ A (visas för användaren)
                    </label>
                    <textarea
                      rows={2}
                      value={currentOptA?.description || ''}
                      onChange={(e) =>
                        updateCurrentQuestion((q) => ({
                          ...q,
                          options: q.options.map((opt) =>
                            opt.id === 'A' ? { ...opt, description: e.target.value } : opt
                          )
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                      placeholder="Skriv beskrivningen för val A..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">
                        Valfri rubrik (lämna tom för att dölja)
                      </label>
                      <input
                        type="text"
                        value={currentOptA?.title || ''}
                        onChange={(e) =>
                          updateCurrentQuestion((q) => ({
                            ...q,
                            options: q.options.map((opt) =>
                              opt.id === 'A' ? { ...opt, title: e.target.value } : opt
                            )
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none"
                        placeholder="Valfri rubrik..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">
                        Valfri bild-URL (lämna tom för att dölja bild)
                      </label>
                      <input
                        type="text"
                        value={currentOptA?.image || ''}
                        onChange={(e) =>
                          updateCurrentQuestion((q) => ({
                            ...q,
                            options: q.options.map((opt) =>
                              opt.id === 'A'
                                ? { ...opt, image: e.target.value.trim() === '' ? null : e.target.value }
                                : opt
                            )
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none"
                        placeholder="https://... eller bildadress"
                      />
                    </div>
                  </div>

                  {currentOptA?.image && (
                    <div className="mt-1">
                      <p className="text-xs text-on-surface-variant mb-1">Förhandsgranskning bild A:</p>
                      <img
                        src={currentOptA.image}
                        alt="Preview A"
                        className="h-24 w-auto rounded border object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Alternativ B */}
                <div className="p-4 rounded-xl bg-secondary-container/40 border border-secondary/20 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-secondary text-on-secondary font-bold flex items-center justify-center text-sm shadow-[1px_1px_0px_#49672a]">
                        B
                      </span>
                      <span className="font-bold text-secondary font-label-md">Alternativ B</span>
                    </div>

                    {/* Humanist indicator toggle */}
                    <label className="flex items-center gap-2 cursor-pointer bg-surface-container-lowest px-3 py-1 rounded-full shadow-sm border border-outline-variant/30">
                      <input
                        type="checkbox"
                        checked={currentOptB?.isHumanist || false}
                        onChange={(e) =>
                          updateCurrentQuestion((q) => ({
                            ...q,
                            options: q.options.map((opt) =>
                              opt.id === 'B' ? { ...opt, isHumanist: e.target.checked } : opt
                            )
                          }))
                        }
                        className="w-4 h-4 text-secondary rounded focus:ring-secondary accent-secondary"
                      />
                      <span className="text-xs font-bold text-secondary">
                        {currentOptB?.isHumanist ? 'Ger Humanist-poäng ⭐' : 'Inte humanist-poäng'}
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">
                      Beskrivningstext för Alternativ B (visas för användaren)
                    </label>
                    <textarea
                      rows={2}
                      value={currentOptB?.description || ''}
                      onChange={(e) =>
                        updateCurrentQuestion((q) => ({
                          ...q,
                          options: q.options.map((opt) =>
                            opt.id === 'B' ? { ...opt, description: e.target.value } : opt
                          )
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                      placeholder="Skriv beskrivningen för val B..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">
                        Valfri rubrik (lämna tom för att dölja)
                      </label>
                      <input
                        type="text"
                        value={currentOptB?.title || ''}
                        onChange={(e) =>
                          updateCurrentQuestion((q) => ({
                            ...q,
                            options: q.options.map((opt) =>
                              opt.id === 'B' ? { ...opt, title: e.target.value } : opt
                            )
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none"
                        placeholder="Valfri rubrik..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">
                        Valfri bild-URL (lämna tom för att dölja bild)
                      </label>
                      <input
                        type="text"
                        value={currentOptB?.image || ''}
                        onChange={(e) =>
                          updateCurrentQuestion((q) => ({
                            ...q,
                            options: q.options.map((opt) =>
                              opt.id === 'B'
                                ? { ...opt, image: e.target.value.trim() === '' ? null : e.target.value }
                                : opt
                            )
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none"
                        placeholder="https://... eller bildadress"
                      />
                    </div>
                  </div>

                  {currentOptB?.image && (
                    <div className="mt-1">
                      <p className="text-xs text-on-surface-variant mb-1">Förhandsgranskning bild B:</p>
                      <img
                        src={currentOptB.image}
                        alt="Preview B"
                        className="h-24 w-auto rounded border object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleResetQuestions}
                    className="text-xs text-primary/70 hover:text-primary underline cursor-pointer"
                  >
                    Återställ standardfrågor
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveQuestions}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold shadow-[2px_2px_0px_#334282] hover:bg-primary-container transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[20px]">save</span>
                    <span>Spara alla frågor</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LINKS TAB */}
        {activeTab === 'links' && (
          <div className="flex flex-col gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[3px_3px_0px_#334282] border border-outline-variant/30 flex flex-col gap-5">
              <h3
                className="font-headline-md text-headline-md text-primary"
                style={{ fontFamily: 'Barriecito, cursive' }}
              >
                Länkar till Hemsida & Instagram
              </h3>
              <p className="text-sm text-on-surface-variant">
                Här ställer du in vilka webbadresser knapparna i resultatvyn ska öppna när användaren klickar på dem.
              </p>

              <div>
                <label className="block font-label-md text-primary font-bold mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">language</span>
                  <span>Knappen "Besök vår hemsida"</span>
                </label>
                <input
                  type="url"
                  value={settings.websiteUrl}
                  onChange={(e) => setSettings({ ...settings, websiteUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-on-surface"
                  placeholder="https://..."
                />
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Aktuell förhandsgranskning: {settings.websiteUrl}
                </span>
              </div>

              <div>
                <label className="block font-label-md text-primary font-bold mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  <span>Knappen "Kolla vår Instagram"</span>
                </label>
                <input
                  type="url"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-on-surface"
                  placeholder="https://instagram.com/..."
                />
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Aktuell förhandsgranskning: {settings.instagramUrl}
                </span>
              </div>

              <div>
                <label className="block font-label-md text-primary font-bold mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span>Gräns för humanistresultat (% humanistval som krävs)</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="30"
                    max="80"
                    step="5"
                    value={settings.humanistThresholdPct || 50}
                    onChange={(e) =>
                      setSettings({ ...settings, humanistThresholdPct: Number(e.target.value) })
                    }
                    className="flex-1 accent-primary"
                  />
                  <span className="font-bold text-primary text-sm min-w-[3rem]">
                    {settings.humanistThresholdPct || 50}%
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant mt-1 block">
                  Om användaren väljer humanistiska alternativ på minst {settings.humanistThresholdPct || 50}% av frågorna visas gratulationen "Du är nog en framtida humanist!".
                </span>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold shadow-[2px_2px_0px_#334282] hover:bg-primary-container transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  <span>Spara inställningar</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
