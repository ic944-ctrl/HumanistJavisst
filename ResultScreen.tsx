import React, { useState } from 'react';
import { AppSettings } from '../types';

interface ResultScreenProps {
  isHumanist: boolean;
  score?: number;
  totalQuestions?: number;
  settings: AppSettings;
  onRetake: () => void;
  onOpenAdmin: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  isHumanist,
  settings,
  onRetake,
  onOpenAdmin
}) => {
  const [showToast, setShowToast] = useState(false);

  const websiteLink = settings.websiteUrl || 'https://backangsgymnasiet.boras.se';
  const instagramLink = settings.instagramUrl || 'https://instagram.com';

  const copyShareLink = () => {
    try {
      navigator.clipboard.writeText(window.location.origin);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-md mx-auto px-margin flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm min-w-0">
            <img
              alt="Framtida Humanist Logo"
              className="h-8 w-auto object-contain flex-shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFPggjzq1UW6qQhNK5llEaiUEsU635nM5GF0v3OByXeV9zj3vk30RIi2_7S0Fhnl-nzuQCVaR0Z-wWk67BklGOl38pJGqjT9lvjemLZIXl7WuT4-akG6dOFJ4ivOxnP0UAuRxncY8D5yust8C6WHWeEBAOWLTcvtSbAQymjxIQaiQXK3jencHUNcTLfRzq7Tx2fXOIwKJ7PbFGXYo98GzXfpDzVcyHBLsDoZeOr7txOTnPj-60cQNOPtx-IImdIZN_rF8"
            />
            <div className="flex flex-col min-w-0">
              <span
                className="font-headline-md text-headline-md text-primary truncate leading-tight font-barriecito"
                style={{ fontFamily: "'Barriecito', cursive" }}
              >
                Mitt Resultat
              </span>
            </div>
          </div>
          <button
            onClick={copyShareLink}
            title="Dela testet"
            className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
            aria-label="Dela testet"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative w-full max-w-md mx-auto px-margin pt-16 bg-surface pb-6">
        <div className="flex flex-col w-full">
          {/* Celebration Sparks & Badge Header */}
          <div className="relative w-full flex flex-col items-center text-center pt-6 pb-2">
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-0">
              <svg
                className="w-full h-full max-w-[360px] opacity-90 pointer-events-none"
                fill="none"
                viewBox="0 0 360 160"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="text-tertiary-fixed"
                  d="M22 18L26 27L36 29L28 36L30 46L22 40L14 46L16 36L8 29L18 27L22 18Z"
                  fill="#fae003"
                ></path>
                <circle className="text-error" cx="48" cy="14" fill="#ba1a1a" r="4.5"></circle>
                <path d="M12 56Q18 42 32 48" stroke="#49672a" strokeLinecap="round" strokeWidth="2.5"></path>
                <rect fill="#ba1a1a" height="7" rx="2" transform="rotate(25 110 8)" width="7" x="110" y="8"></rect>
                <circle cx="180" cy="10" fill="#fee40e" r="3.5"></circle>
                <circle cx="245" cy="12" fill="#49672a" r="3"></circle>
                <circle cx="312" cy="16" fill="#ba1a1a" r="4"></circle>
                <path
                  d="M336 22L340 31L350 33L342 40L344 50L336 44L328 50L330 40L322 33L332 31L336 22Z"
                  fill="#fee40e"
                ></path>
                <path d="M328 58Q338 46 348 54" stroke="#49672a" strokeLinecap="round" strokeWidth="2.5"></path>
                <circle cx="14" cy="120" fill="#49672a" r="3.5"></circle>
                <path d="M18 136Q28 126 36 134" stroke="#fee40e" strokeLinecap="round" strokeWidth="2.5"></path>
                <rect fill="#ba1a1a" height="6" rx="1.5" transform="rotate(35 342 118)" width="6" x="342" y="118"></rect>
                <circle cx="338" cy="138" fill="#fae003" r="3.5"></circle>
              </svg>
            </div>

            {isHumanist ? (
              <h1
                className="relative z-10 text-[38px] sm:text-[46px] text-primary tracking-tight px-2 leading-[1.08] font-barriecito my-4"
                style={{ fontFamily: "'Barriecito', cursive" }}
              >
                Grattis,
                <br />
                du kan nog vara en framtida humanist!
              </h1>
            ) : (
              <h1
                className="relative z-10 text-[30px] sm:text-[38px] text-primary tracking-tight px-2 leading-[1.12] font-barriecito my-4"
                style={{ fontFamily: "'Barriecito', cursive" }}
              >
                Ojdå,
                <br />
                du kanske inte är en framtida humanist.
                <br />
                Gör testet igen för säkerhets skull!
              </h1>
            )}
          </div>

          {/* Primary Action Buttons Section */}
          <div className="flex flex-col gap-3 w-full mt-4 mb-3">
            {/* Mandatory Button 1: Website Link */}
            <a
              className="w-full flex items-center justify-between px-5 py-3.5 bg-primary text-on-primary rounded-xl shadow-[3px_3px_0px_#334282] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#334282] transition-transform text-decoration-none cursor-pointer"
              href={websiteLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary-fixed">
                  <span className="material-symbols-outlined text-[20px]">language</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-label-lg text-label-lg leading-tight font-bold text-on-primary">
                    Besök vår hemsida
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[22px] text-on-primary">arrow_forward</span>
            </a>

            {/* Mandatory Button 2: Instagram Link */}
            <a
              className="w-full flex items-center justify-between px-5 py-3.5 bg-secondary text-on-secondary rounded-xl shadow-[3px_3px_0px_#334282] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#334282] transition-transform text-decoration-none cursor-pointer"
              href={instagramLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-label-lg text-label-lg leading-tight font-bold text-on-secondary">
                    Kolla vår Instagram
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[22px] text-on-secondary">open_in_new</span>
            </a>
          </div>

          {/* Secondary Actions: Retake Test */}
          <div className="gap-3 w-full">
            <button
              onClick={onRetake}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-lowest text-secondary rounded-xl shadow-[2.5px_2.5px_0px_#334282] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-[1px_1px_0px_#334282] transition-transform mx-auto cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[20px]">replay</span>
              <span className="font-label-md text-label-md">Gör om testet</span>
            </button>
          </div>

          {/* Footer Logo */}
          <div className="mt-5 mb-2 flex flex-col items-center justify-center text-center w-full">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDj4lMsu1y6aqs0_jOuwozqgxxVF4lMdhoybH55IAproDtjFVZ6OKp7oP4ZTsGlhi28GGT2FN0YqcVmK1xwS11thqcVHoyFjZXJuXUJeJG8SGJlw4J-qZdG8iSF0wZNFh28nUIbrMzCwODoaWo7dVzzwA0VLGWFsG1ig6c-74KuY2cFIb-QlC40IjYJiT2sTbupEQ9m1pJpFcjSWkMlyFM1EZzZgSK6dY5PuVlak3QigPlsDgj1UWBHPU2dk-shpRVn1-M"
              alt="Humanist Javisst - Bäckängsgymnasiet"
              className="w-full max-w-[200px] h-auto object-contain mx-auto"
            />
          </div>

          {/* Discreet admin link for staff */}
          <div className="mt-3 text-center">
            <button
              onClick={onOpenAdmin}
              type="button"
              className="text-xs text-primary/30 hover:text-primary transition-colors cursor-pointer"
            >
              Admin
            </button>
          </div>

          {/* Toast notification for sharing */}
          <div
            className={`fixed bottom-20 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-full font-label-md text-label-md transition-opacity duration-300 shadow-md z-50 flex items-center gap-1.5 ${
              showToast ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            id="shareToast"
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Länk kopierad till urklipp!</span>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.04)]"></nav>
    </div>
  );
};
