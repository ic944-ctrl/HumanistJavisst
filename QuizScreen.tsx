import React from 'react';
import { QuizQuestion } from '../types';

interface QuizScreenProps {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedChoice: 'A' | 'B' | null;
  onSelectOption: (choice: 'A' | 'B') => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedChoice,
  onSelectOption,
  onNext,
  onPrevious
}) => {
  const qNum = currentIndex + 1;
  const pct = Math.round((qNum / totalQuestions) * 100);

  const optA = question.options.find((o) => o.id === 'A') || question.options[0];
  const optB = question.options.find((o) => o.id === 'B') || question.options[1];

  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="flex flex-col min-h-screen bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-md mx-auto px-margin flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs min-w-0">
            <button
              aria-label="Tillbaka"
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
              onClick={onPrevious}
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <img
              alt="Humanist Javisst Logo"
              className="h-8 w-auto object-contain flex-shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYywkVrGXO9XyQkxtwTy908VqNyA5Gut402d_2ygmhqpQiQwxM9iSAV06B3-V6kWTpcoBEOxxGOPnmq2acmyY0-H820ARGcT-QTzf0FpJnbGR5gVCOHAhrRe6y-1wDH3wy2s2O1soEHBS5xNkSPPUASHA8G1S9mXyyKVVP5mfMWkwu4FvnSlByTler9V3Kr3-UB-4NmbSvontfCiaFWK3RDFQzOwjh1XGcXMWfJdvsBvrvTP1MSaKz5q1kKYlWP4GrqPc"
            />
            <h1
              className="font-headline-md text-headline-md text-primary truncate leading-tight ml-1 font-barriecito"
              style={{ fontFamily: "'Barriecito', cursive" }}
            >
              Test
            </h1>
          </div>
          <div className="flex items-center gap-space-xs"></div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative w-full max-w-md mx-auto px-margin pt-16 pb-safe bg-surface">
        <div className="flex flex-col w-full pb-8">
          {/* Progress Section */}
          <div className="pt-4 pb-3 flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm shadow-[2px_2px_0px_#1b2b6a]"
                  id="progress-badge-num"
                >
                  {qNum}
                </span>
                <span
                  className="font-label-md text-label-md text-primary tracking-wide uppercase font-barriecito"
                  id="progress-label-text"
                  style={{
                    fontFamily: "'Barriecito', cursive",
                    fontSize: '16px',
                    letterSpacing: '0.05em'
                  }}
                >
                  Fråga {qNum} av {totalQuestions}
                </span>
              </div>
              <span
                className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold"
                id="progress-pct-text"
              >
                {pct}% avklarat
              </span>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full h-3 bg-surface-container-lowest rounded-full p-0.5 shadow-[2px_2px_0px_#334282] overflow-hidden flex items-center">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-0.5"
                id="progress-bar-fill"
                style={{ width: `${pct}%` }}
              >
                <div className="w-2 h-2 rounded-full bg-tertiary-fixed shadow-[0_0_4px_rgba(254,228,14,0.8)]"></div>
              </div>
            </div>
          </div>

          {/* Question Framing */}
          <div className="mt-2 mb-5 flex flex-col gap-1.5 text-left">
            <h2
              className="text-[22px] sm:text-[25px] font-bold text-primary leading-snug tracking-normal"
              id="question-text"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {question.questionText}
            </h2>
          </div>

          {/* A/B Comparison Stack */}
          <div className="relative flex flex-col gap-3 my-1" id="quiz-options">
            {/* Option A Card */}
            <div
              id="card-option-a"
              onClick={() => onSelectOption('A')}
              className={`cursor-pointer group relative flex flex-col p-4 rounded-xl transition-all duration-150 shadow-[3px_3px_0px_#334282] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#334282] ${
                selectedChoice === 'A' ? 'bg-primary-fixed' : 'bg-surface-container-lowest'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary font-headline-md text-headline-md flex items-center justify-center shadow-[1px_1px_0px_#1b2b6a]">
                    A
                  </span>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    selectedChoice === 'A' ? 'bg-primary-container' : 'bg-surface-container-high'
                  }`}
                  id="radio-indicator-a"
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      selectedChoice === 'A' ? 'bg-on-primary scale-100' : 'bg-transparent scale-0'
                    }`}
                    id="radio-dot-a"
                  ></div>
                </div>
              </div>

              {/* Optional image section for Option A */}
              {optA?.image && optA.image.trim() !== '' && (
                <div className="overflow-hidden rounded-lg mt-3 border border-outline-variant/30" id="image-wrapper-a">
                  <img
                    alt={optA.title || 'Alternativ A bild'}
                    className="w-full h-36 object-cover"
                    id="image-a"
                    src={optA.image}
                  />
                </div>
              )}

              <div className="mt-3 flex flex-col gap-1">
                {optA?.title && optA.title.trim() !== '' && (
                  <h3
                    className="text-lg font-bold text-primary leading-snug"
                    id="title-a"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {optA.title}
                  </h3>
                )}
                <p className="font-body-lg text-body-lg text-primary font-medium leading-snug" id="desc-a">
                  {optA?.description}
                </p>
              </div>

              {/* Accent bar */}
              <div
                className={`h-1.5 bg-primary-container rounded-full mt-3 transition-all duration-300 ${
                  selectedChoice === 'A' ? 'w-full' : 'w-0'
                }`}
                id="accent-a"
              ></div>
            </div>

            {/* Playful Divider Badge "ELLER" */}
            <div className="relative flex items-center justify-center -my-1 z-10 pointer-events-none">
              <div className="px-4 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md shadow-[2px_2px_0px_#334282] flex items-center gap-1">
                <span>ELLER</span>
              </div>
            </div>

            {/* Option B Card */}
            <div
              id="card-option-b"
              onClick={() => onSelectOption('B')}
              className={`cursor-pointer group relative flex flex-col p-4 rounded-xl transition-all duration-150 shadow-[3px_3px_0px_#334282] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#334282] ${
                selectedChoice === 'B' ? 'bg-secondary-container' : 'bg-surface-container-lowest'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-secondary text-on-secondary font-headline-md text-headline-md flex items-center justify-center shadow-[1px_1px_0px_#49672a]">
                    B
                  </span>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    selectedChoice === 'B' ? 'bg-secondary' : 'bg-surface-container-high'
                  }`}
                  id="radio-indicator-b"
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      selectedChoice === 'B' ? 'bg-on-secondary scale-100' : 'bg-transparent scale-0'
                    }`}
                    id="radio-dot-b"
                  ></div>
                </div>
              </div>

              {/* Optional image section for Option B */}
              {optB?.image && optB.image.trim() !== '' && (
                <div className="overflow-hidden rounded-lg mt-3 border border-outline-variant/30" id="image-wrapper-b">
                  <img
                    alt={optB.title || 'Alternativ B bild'}
                    className="w-full h-36 object-cover"
                    id="image-b"
                    src={optB.image}
                  />
                </div>
              )}

              <div className="mt-3 flex flex-col gap-1">
                {optB?.title && optB.title.trim() !== '' && (
                  <h3
                    className="text-lg font-bold text-primary leading-snug"
                    id="title-b"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {optB.title}
                  </h3>
                )}
                <p className="font-body-lg text-body-lg text-primary font-medium leading-snug" id="desc-b">
                  {optB?.description}
                </p>
              </div>

              {/* Accent bar */}
              <div
                className={`h-1.5 bg-secondary rounded-full mt-3 transition-all duration-300 ${
                  selectedChoice === 'B' ? 'w-full' : 'w-0'
                }`}
                id="accent-b"
              ></div>
            </div>
          </div>

          {/* Navigation Action Bar */}
          <div className="mt-6 flex items-center justify-between gap-3 pt-3">
            {/* Previous Button */}
            <button
              className="flex-1 py-3 px-4 rounded-xl bg-surface-container-high text-primary font-label-lg text-label-lg flex items-center justify-center gap-1 shadow-[2px_2px_0px_#334282] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#334282] cursor-pointer"
              onClick={onPrevious}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">west</span>
              <span>Föregående</span>
            </button>

            {/* Next Button (Active / Flare State) */}
            <button
              disabled={!selectedChoice}
              className={`flex-1 py-3 px-4 rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_#334282] transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#334282] cursor-pointer ${
                selectedChoice
                  ? 'bg-tertiary-fixed text-on-tertiary-fixed opacity-100 hover:scale-[1.02]'
                  : 'bg-surface-container-high text-on-surface-variant/40 opacity-60 cursor-not-allowed shadow-[1px_1px_0px_#767681]'
              }`}
              id="next-btn"
              onClick={onNext}
              type="button"
            >
              <span>{isLastQuestion ? 'Se resultat' : 'Nästa fråga'}</span>
              <span className="material-symbols-outlined text-[20px]">east</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
