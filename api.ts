import { AppSettings, AppStoreData, QuizQuestion, QuizStats } from '../types';

export const STORAGE_KEY_QUESTIONS = 'humanist_quiz_questions_v2';
export const STORAGE_KEY_SETTINGS = 'humanist_quiz_settings_v2';
export const STORAGE_KEY_UPDATED_AT = 'humanist_quiz_updated_at_v2';
export const STORAGE_KEY_CUSTOMIZED = 'humanist_quiz_customized_v2';
export const STORAGE_KEY_ADMIN_TOKEN = 'humanist_quiz_admin_token_v2';
export const STORAGE_KEY_STATS = 'humanist_quiz_stats_v2';

export const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionNumber: 1,
    questionText: 'Vad lockar dig mest när du läser en bok eller ser en film?',
    options: [
      {
        id: 'A',
        title: '',
        description: 'Människornas känslor, språket, relationerna och de existentiella frågorna.',
        image: null,
        isHumanist: true
      },
      {
        id: 'B',
        title: '',
        description: 'Specialeffekterna, tekniska detaljer och den matematiska logiken i handlingen.',
        image: null,
        isHumanist: false
      }
    ]
  },
  {
    id: 2,
    questionNumber: 2,
    questionText: 'Om du fick resa i tiden för en dag, vad skulle du välja?',
    options: [
      {
        id: 'A',
        title: '',
        description: 'Besöka antikens Rom, renässansens Florens eller uppleva en historisk kulturkrock.',
        image: null,
        isHumanist: true
      },
      {
        id: 'B',
        title: '',
        description: 'Resa 500 år in i framtiden för att utforska rymdstationer och avancerade maskiner.',
        image: null,
        isHumanist: false
      }
    ]
  },
  {
    id: 3,
    questionNumber: 3,
    questionText: 'Vilket ämne diskuterar du helst under en fika?',
    options: [
      {
        id: 'A',
        title: '',
        description: 'Kultur, historia, samhällsfrågor, filosofi eller varför människor agerar som de gör.',
        image: null,
        isHumanist: true
      },
      {
        id: 'B',
        title: '',
        description: 'Aktiepriser, datorhårdvara, kemiska formler eller senaste tekniska prylarna.',
        image: null,
        isHumanist: false
      }
    ]
  },
  {
    id: 4,
    questionNumber: 4,
    questionText: 'Vilket väljer du helst?',
    options: [
      {
        id: 'A',
        title: '',
        description: 'Jag analyserar orden, språket och vad som sägs mellan raderna i samtalet.',
        image: null,
        isHumanist: true
      },
      {
        id: 'B',
        title: '',
        description: 'Jag sätter in problemet i ett historiskt och etiskt sammanhang för att förstå varför det uppstod.',
        image: null,
        isHumanist: true
      }
    ]
  },
  {
    id: 5,
    questionNumber: 5,
    questionText: 'När du lär dig ett nytt språk, vad är mest givande?',
    options: [
      {
        id: 'A',
        title: '',
        description: 'Att kunna förstå en ny kultur, läsa litteratur på originalspråk och prata med folk.',
        image: null,
        isHumanist: true
      },
      {
        id: 'B',
        title: '',
        description: 'Grammatiken enbart som ett matematiskt kodsystem och formella regler.',
        image: null,
        isHumanist: false
      }
    ]
  },
  {
    id: 6,
    questionNumber: 6,
    questionText: 'Vilken typ av museum besöker du helst?',
    options: [
      {
        id: 'A',
        title: '',
        description: 'Ett konstmuseum, historiskt museum eller arkeologisk utgrävning.',
        image: null,
        isHumanist: true
      },
      {
        id: 'B',
        title: '',
        description: 'Ett motormuseum eller ett tekniklaboratorium.',
        image: null,
        isHumanist: false
      }
    ]
  },
  {
    id: 7,
    questionNumber: 7,
    questionText: 'Vad vill du helst förstå mer om i världen?',
    options: [
      {
        id: 'A',
        title: '',
        description: 'Hur språk formar hur vi tänker, och hur idéer sprids genom generationer.',
        image: null,
        isHumanist: true
      },
      {
        id: 'B',
        title: '',
        description: 'Hur algoritmer sorterar data och hur kretskort tillverkas.',
        image: null,
        isHumanist: false
      }
    ]
  },
  {
    id: 8,
    questionNumber: 8,
    questionText: 'Hur uttrycker du dig bäst?',
    options: [
      {
        id: 'A',
        title: '',
        description: 'Genom text, argumentation, retorik och nyanserade samtal.',
        image: null,
        isHumanist: true
      },
      {
        id: 'B',
        title: '',
        description: 'Genom tabeller, beräkningar och programmeringskod.',
        image: null,
        isHumanist: false
      }
    ]
  },
  {
    id: 9,
    questionNumber: 9,
    questionText: 'Vilket citat känner du starkast för?',
    options: [
      {
        id: 'A',
        title: '',
        description: '"Homo sum, humani nihil a me alienum puto" (Jag är människa, inget mänskligt är mig främmande).',
        image: null,
        isHumanist: true
      },
      {
        id: 'B',
        title: '',
        description: '"Om det inte går att mäta i siffror så existerar det knappt."',
        image: null,
        isHumanist: false
      }
    ]
  },
  {
    id: 10,
    questionNumber: 10,
    questionText: 'Vad tycker du är viktigast för framtidens samhälle?',
    options: [
      {
        id: 'A',
        title: '',
        description: 'Kritiskt tänkande, empati, källkritik och förståelse mellan olika kulturer.',
        image: null,
        isHumanist: true
      },
      {
        id: 'B',
        title: '',
        description: 'Enbart automation, industriell robotik och snabbare processorer.',
        image: null,
        isHumanist: false
      }
    ]
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  websiteUrl: 'https://backangsgymnasiet.boras.se/utbildningar/humanistiska-programmet',
  instagramUrl: 'https://www.instagram.com/humanistjavisst_backang',
  humanistThresholdPct: 50
};

// Helper to read local cache
export function getLocalCachedData(): {
  questions: QuizQuestion[] | null;
  settings: AppSettings | null;
  updatedAt: number;
  isCustomized: boolean;
} {
  try {
    const qStr = localStorage.getItem(STORAGE_KEY_QUESTIONS);
    const sStr = localStorage.getItem(STORAGE_KEY_SETTINGS);
    const upStr = localStorage.getItem(STORAGE_KEY_UPDATED_AT);
    const isCust = localStorage.getItem(STORAGE_KEY_CUSTOMIZED) === 'true';

    return {
      questions: qStr ? JSON.parse(qStr) : null,
      settings: sStr ? JSON.parse(sStr) : null,
      updatedAt: upStr ? Number(upStr) : 0,
      isCustomized: isCust
    };
  } catch {
    return {
      questions: null,
      settings: null,
      updatedAt: 0,
      isCustomized: false
    };
  }
}

// Fetch questions and settings with resilient sync
export async function getQuizData(): Promise<{ questions: QuizQuestion[]; settings: AppSettings }> {
  const local = getLocalCachedData();
  let currentQuestions = local.questions || DEFAULT_QUESTIONS;
  let currentSettings = local.settings || DEFAULT_SETTINGS;

  try {
    const res = await fetch('/api/quiz-data');
    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        const serverUpdatedAt = data.updatedAt || 0;

        // If local has customized questions and local is newer, keep local and sync to server!
        if (local.isCustomized && local.questions && local.updatedAt > serverUpdatedAt) {
          // Push local to server in background
          syncQuestionsToServer(local.questions, local.updatedAt).catch(() => {});
        } else if (data.questions && data.questions.length > 0) {
          // Server data is accepted
          currentQuestions = data.questions;
          currentSettings = data.settings || currentSettings;
          try {
            localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(data.questions));
            if (data.settings) {
              localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(data.settings));
            }
            if (serverUpdatedAt > 0) {
              localStorage.setItem(STORAGE_KEY_UPDATED_AT, serverUpdatedAt.toString());
            }
          } catch {
            // ignore localStorage quota
          }
        }
      }
    }
  } catch (err) {
    console.warn('Backend /api/quiz-data unavailable, using cached data:', err);
  }

  return {
    questions: currentQuestions,
    settings: currentSettings
  };
}

async function syncQuestionsToServer(questions: QuizQuestion[], updatedAt: number): Promise<void> {
  const token = getAdminToken() || btoa('hughmanatee');
  await fetch('/api/admin/questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ questions, updatedAt })
  });
}

// Anonymous completion tracking
export async function recordQuizCompletion(isHumanist: boolean): Promise<void> {
  // Update local stats cache
  try {
    const statsStr = localStorage.getItem(STORAGE_KEY_STATS);
    const stats: QuizStats = statsStr
      ? JSON.parse(statsStr)
      : { totalCompleted: 0, humanistCount: 0, nonHumanistCount: 0, lastCompletedAt: null };
    stats.totalCompleted += 1;
    if (isHumanist) {
      stats.humanistCount += 1;
    } else {
      stats.nonHumanistCount += 1;
    }
    stats.lastCompletedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  } catch {
    // ignore
  }

  // Update server stats
  try {
    await fetch('/api/quiz-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isHumanist })
    });
  } catch (err) {
    console.warn('Could not record quiz completion to server:', err);
  }
}

// Admin API
export async function adminLogin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem(STORAGE_KEY_ADMIN_TOKEN, data.token);
        return { success: true, token: data.token };
      }
    }
  } catch {
    // Network or static fallback
  }

  // Client validation fallback
  if (password === 'hughmanatee') {
    const token = btoa('hughmanatee');
    localStorage.setItem(STORAGE_KEY_ADMIN_TOKEN, token);
    return { success: true, token };
  }
  return { success: false, error: 'Fel lösenord' };
}

export function getAdminToken(): string | null {
  return localStorage.getItem(STORAGE_KEY_ADMIN_TOKEN);
}

export function logoutAdmin(): void {
  localStorage.removeItem(STORAGE_KEY_ADMIN_TOKEN);
}

export async function fetchAdminData(token: string): Promise<AppStoreData> {
  const local = getLocalCachedData();
  let localStats: QuizStats = {
    totalCompleted: 0,
    humanistCount: 0,
    nonHumanistCount: 0,
    lastCompletedAt: null
  };
  try {
    const s = localStorage.getItem(STORAGE_KEY_STATS);
    if (s) localStats = JSON.parse(s);
  } catch {
    // ignore
  }

  try {
    const res = await fetch('/api/admin/data', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data: AppStoreData = await res.json();
      const serverUpdatedAt = data.updatedAt || 0;

      // If local has customized questions and local timestamp is newer, retain local!
      if (local.isCustomized && local.questions && local.updatedAt > serverUpdatedAt) {
        syncQuestionsToServer(local.questions, local.updatedAt).catch(() => {});
        return {
          questions: local.questions,
          settings: local.settings || data.settings || DEFAULT_SETTINGS,
          stats: data.stats || localStats,
          updatedAt: local.updatedAt
        };
      }

      // Otherwise save server questions to localStorage
      if (data.questions && data.questions.length > 0) {
        try {
          localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(data.questions));
          if (data.settings) {
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(data.settings));
          }
          if (serverUpdatedAt > 0) {
            localStorage.setItem(STORAGE_KEY_UPDATED_AT, serverUpdatedAt.toString());
          }
        } catch {
          // ignore
        }
      }
      return data;
    }
  } catch (err) {
    console.error('Failed to fetch admin data from server, using local storage:', err);
  }

  // Fallback cleanly to local storage or defaults - NEVER erase user questions!
  return {
    questions: local.questions || DEFAULT_QUESTIONS,
    settings: local.settings || DEFAULT_SETTINGS,
    stats: localStats,
    updatedAt: local.updatedAt
  };
}

export async function saveAdminQuestions(token: string, questions: QuizQuestion[]): Promise<boolean> {
  const now = Date.now();
  // 1. ALWAYS write to localStorage immediately so user never loses their changes
  try {
    localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
    localStorage.setItem(STORAGE_KEY_UPDATED_AT, now.toString());
    localStorage.setItem(STORAGE_KEY_CUSTOMIZED, 'true');
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }

  // 2. Also save to server
  try {
    const effectiveToken = token || getAdminToken() || btoa('hughmanatee');
    await fetch('/api/admin/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${effectiveToken}`
      },
      body: JSON.stringify({ questions, updatedAt: now })
    });
  } catch (err) {
    console.error('Failed to save questions to server (saved locally):', err);
  }

  return true;
}

export async function saveAdminSettings(token: string, settings: AppSettings): Promise<boolean> {
  const now = Date.now();
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    localStorage.setItem(STORAGE_KEY_UPDATED_AT, now.toString());
    localStorage.setItem(STORAGE_KEY_CUSTOMIZED, 'true');
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }

  try {
    const effectiveToken = token || getAdminToken() || btoa('hughmanatee');
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${effectiveToken}`
      },
      body: JSON.stringify({ ...settings, updatedAt: now })
    });
  } catch (err) {
    console.error('Failed to save settings to server (saved locally):', err);
  }

  return true;
}

export async function resetAdminStats(token: string): Promise<QuizStats | null> {
  const emptyStats: QuizStats = {
    totalCompleted: 0,
    humanistCount: 0,
    nonHumanistCount: 0,
    lastCompletedAt: null
  };
  try {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(emptyStats));
  } catch {
    // ignore
  }

  try {
    const effectiveToken = token || getAdminToken() || btoa('hughmanatee');
    const res = await fetch('/api/admin/reset-stats', {
      method: 'POST',
      headers: { Authorization: `Bearer ${effectiveToken}` }
    });
    if (res.ok) {
      const data = await res.json();
      return data.stats;
    }
  } catch (err) {
    console.error('Failed to reset stats on server:', err);
  }
  return emptyStats;
}

export async function resetDefaultQuestions(token: string): Promise<QuizQuestion[] | null> {
  const now = Date.now();
  try {
    localStorage.removeItem(STORAGE_KEY_CUSTOMIZED);
    localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(DEFAULT_QUESTIONS));
    localStorage.setItem(STORAGE_KEY_UPDATED_AT, now.toString());
  } catch {
    // ignore
  }

  try {
    const effectiveToken = token || getAdminToken() || btoa('hughmanatee');
    const res = await fetch('/api/admin/reset-defaults', {
      method: 'POST',
      headers: { Authorization: `Bearer ${effectiveToken}` }
    });
    if (res.ok) {
      const data = await res.json();
      return data.questions;
    }
  } catch (err) {
    console.error('Failed to reset defaults on server:', err);
  }
  return DEFAULT_QUESTIONS;
}
