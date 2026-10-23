import React from 'react';
import { QuizQuestion } from '../types';

interface StartScreenProps {
  questions: QuizQuestion[];
  onStartQuiz: () => void;
  onOpenAdmin: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  questions,
  onStartQuiz,
  onOpenAdmin
}) => {
  const count = questions.length;

  return (
    <div className="flex flex-col min-h-screen bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Fixed Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-md mx-auto px-margin flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm min-w-0">
            <img
              alt="Framtida Humanist Logo"
              className="h-8 w-auto object-contain flex-shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKbyM_XSaTR-P1QcM5PG_gDaLJQuZtdqPSKVzR8IP7Vt87xMjyVG6uP453An1_9Btsh8_Fbq4nmTKkm0ub3TOoTKvJDHfyvoG5voYbl5HJtxtSRfnKq236WuG8UQb5GtJCfZ_F0idHWWwcDyWWm7P4QhGj6I7cvRX8jDo9QbKJ9xFeHTpNNxQIiFzhInGccAv7smCD4SPNCi12sXCemgY3JOfycdG92fGG00DP1993QMw1al3u9iddwW-1iKlpXeIa1C4"
            />
            <div className="flex flex-col min-w-0">
              <span
                className="font-headline-md text-headline-md text-primary truncate leading-tight font-barriecito"
                style={{ fontFamily: "'Barriecito', cursive" }}
              >
                Startsida
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs">
            {/* Subtle Admin lock icon */}
            <button
              onClick={onOpenAdmin}
              title="Admin login"
              className="w-9 h-9 rounded-full flex items-center justify-center text-primary/40 hover:text-primary hover:bg-surface-container-high transition-colors"
              aria-label="Admin"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full max-w-md mx-auto px-margin pt-16 pb-24 bg-surface">
        <div className="flex flex-col w-full pb-8">
          {/* Top Logo & Emblem Container */}
          <div className="flex flex-col items-center justify-center my-4">
            <div className="relative flex flex-col items-center group">
              <div className="flex items-center justify-center" style={{ width: '260px', maxWidth: '100%' }}>
                <img
                  alt="Humanist Javisst logga"
                  className="w-full h-auto object-contain cursor-pointer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKbyM_XSaTR-P1QcM5PG_gDaLJQuZtdqPSKVzR8IP7Vt87xMjyVG6uP453An1_9Btsh8_Fbq4nmTKkm0ub3TOoTKvJDHfyvoG5voYbl5HJtxtSRfnKq236WuG8UQb5GtJCfZ_F0idHWWwcDyWWm7P4QhGj6I7cvRX8jDo9QbKJ9xFeHTpNNxQIiFzhInGccAv7smCD4SPNCi12sXCemgY3JOfycdG92fGG00DP1993QMw1al3u9iddwW-1iKlpXeIa1C4"
                  onClick={onStartQuiz}
                />
              </div>
            </div>
          </div>

          {/* Hero Title Section */}
          <div className="flex flex-col items-center text-center px-space-xs mt-1">
            {/* Accent Badge Pill */}
            <div className="inline-flex items-center gap-1.5 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full shadow-[2px_2px_0px_#334282] mb-3 transform -rotate-1">
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span className="font-label-md text-label-md uppercase tracking-wide">
                {count} snabba frågor
              </span>
            </div>

            {/* Main Title */}
            <h1
              className="font-headline-xl-mobile text-headline-xl-mobile text-primary-container leading-tight tracking-tight mb-4 font-barriecito"
              style={{ fontFamily: "'Barriecito', cursive" }}
            >
              Är du en framtida <span className="text-primary font-barriecito" style={{ fontFamily: "'Barriecito', cursive" }}>humanist?</span>
            </h1>

            {/* Descriptive Ingress */}
            <div className="text-left text-on-surface-variant max-w-sm px-2 text-[16px] leading-relaxed space-y-3">
              <p className="m-0">
                På humanistiska programmet studerar du människan. Hur vi kommunicerar, vad vi gör och skapar, i nutid och dåtid.
              </p>
              <p className="m-0">
                Gör testet och få svar på om du har en framtid inom humaniora!
              </p>
            </div>
          </div>

          {/* Primary Call To Action */}
          <div className="flex flex-col items-stretch mt-6 px-space-xs">
            <button
              onClick={onStartQuiz}
              type="button"
              className="group relative flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-on-primary transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
              style={{ backgroundColor: '#92b46e', boxShadow: '3px 3px 0px #6e8e4a' }}
            >
              <span className="font-headline-lg-mobile text-headline-lg-mobile tracking-wide font-bold">
                Starta testet
              </span>
              <span className="material-symbols-outlined text-[28px] transition-transform duration-200 group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Micro Footnote / Proof Pills */}
          <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1 mt-4 text-on-surface-variant px-space-sm text-center">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">checklist</span>
              <span className="font-label-sm text-label-sm">{count} frågor</span>
            </div>
            <span className="text-outline-variant">•</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
              <span className="font-label-sm text-label-sm">Tar ca 2 minuter</span>
            </div>
            <span className="text-outline-variant">•</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">favorite</span>
              <span className="font-label-sm text-label-sm">Inga rätt eller fel</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Nav Bar */}
      <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.04)]"></nav>
    </div>
  );
};
