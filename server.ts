import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_FILE = path.resolve(DATA_DIR, 'quiz-store.json');

app.use(express.json({ limit: '10mb' }));

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface QuizOption {
  id: 'A' | 'B';
  title: string;
  description: string;
  image: string | null;
  isHumanist: boolean;
}

export interface QuizQuestion {
  id: number;
  questionNumber: number;
  questionText: string;
  options: QuizOption[];
}

export interface AppStore {
  updatedAt?: number;
  settings: {
    websiteUrl: string;
    instagramUrl: string;
    humanistThresholdPct: number; // e.g. 50%
  };
  stats: {
    totalCompleted: number;
    humanistCount: number;
    nonHumanistCount: number;
    lastCompletedAt: string | null;
  };
  questions: QuizQuestion[];
}

const DEFAULT_STORE: AppStore = {
  settings: {
    websiteUrl: 'https://backangsgymnasiet.boras.se/utbildningar/humanistiska-programmet',
    instagramUrl: 'https://www.instagram.com/humanistjavisst_backang',
    humanistThresholdPct: 50
  },
  stats: {
    totalCompleted: 0,
    humanistCount: 0,
    nonHumanistCount: 0,
    lastCompletedAt: null
  },
  questions: [
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
  ]
};

function getStore(): AppStore {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading store file:', err);
  }
  // Initialize default
  saveStore(DEFAULT_STORE);
  return DEFAULT_STORE;
}

function saveStore(store: AppStore): void {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store file:', err);
  }
}

// Public API for quiz configuration
app.get('/api/quiz-data', (_req, res) => {
  const store = getStore();
  res.json({
    questions: store.questions,
    settings: store.settings,
    updatedAt: store.updatedAt || 0
  });
});

// Anonymous completion endpoint to aggregate stats
app.post('/api/quiz-complete', (req, res) => {
  const { isHumanist } = req.body;
  const store = getStore();
  
  store.stats.totalCompleted = (store.stats.totalCompleted || 0) + 1;
  if (isHumanist) {
    store.stats.humanistCount = (store.stats.humanistCount || 0) + 1;
  } else {
    store.stats.nonHumanistCount = (store.stats.nonHumanistCount || 0) + 1;
  }
  store.stats.lastCompletedAt = new Date().toISOString();
  
  saveStore(store);
  res.json({ success: true });
});

// Admin Authentication middleware / helper
const ADMIN_PASSWORD = 'hughmanatee';

function checkAdminAuth(req: express.Request): boolean {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === 'hughmanatee' || token === Buffer.from('hughmanatee').toString('base64')) {
      return true;
    }
  }
  const pass = req.headers['x-admin-password'] || req.query.password;
  return pass === ADMIN_PASSWORD;
}

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = Buffer.from(ADMIN_PASSWORD).toString('base64');
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, error: 'Fel lösenord' });
  }
});

// Admin get full data (including statistics)
app.get('/api/admin/data', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Obehörig' });
  }
  const store = getStore();
  res.json({ ...store, updatedAt: store.updatedAt || 0 });
});

// Admin save questions
app.post('/api/admin/questions', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Obehörig' });
  }
  const { questions, updatedAt } = req.body;
  if (!Array.isArray(questions)) {
    return res.status(400).json({ error: 'Ogiltigt format på frågor' });
  }

  const store = getStore();
  store.updatedAt = updatedAt || Date.now();
  store.questions = questions.map((q: QuizQuestion, index: number) => ({
    ...q,
    id: q.id || index + 1,
    questionNumber: index + 1
  }));

  saveStore(store);
  res.json({ success: true, questions: store.questions, updatedAt: store.updatedAt });
});

// Admin save settings (links, threshold)
app.post('/api/admin/settings', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Obehörig' });
  }
  const { websiteUrl, instagramUrl, humanistThresholdPct, updatedAt } = req.body;
  const store = getStore();

  store.updatedAt = updatedAt || Date.now();
  if (websiteUrl !== undefined) store.settings.websiteUrl = websiteUrl;
  if (instagramUrl !== undefined) store.settings.instagramUrl = instagramUrl;
  if (humanistThresholdPct !== undefined) store.settings.humanistThresholdPct = Number(humanistThresholdPct) || 50;

  saveStore(store);
  res.json({ success: true, settings: store.settings, updatedAt: store.updatedAt });
});

// Admin reset stats
app.post('/api/admin/reset-stats', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Obehörig' });
  }
  const store = getStore();
  store.stats = {
    totalCompleted: 0,
    humanistCount: 0,
    nonHumanistCount: 0,
    lastCompletedAt: null
  };
  saveStore(store);
  res.json({ success: true, stats: store.stats });
});

// Admin restore default questions
app.post('/api/admin/reset-defaults', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Obehörig' });
  }
  const store = getStore();
  store.questions = JSON.parse(JSON.stringify(DEFAULT_STORE.questions));
  saveStore(store);
  res.json({ success: true, questions: store.questions });
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
