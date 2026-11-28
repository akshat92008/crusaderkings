export const SUPPORTED_LOCALES = Object.freeze(['en', 'zh-CN', 'de', 'es', 'pt-BR', 'ru', 'pl', 'fr', 'hi']);

export const LOCALE_NAMES = Object.freeze({
  en: 'English',
  'zh-CN': '简体中文 (Chinese)',
  de: 'Deutsch (German)',
  es: 'Español (Spanish)',
  'pt-BR': 'Português (BR)',
  ru: 'Русский (Russian)',
  pl: 'Polski (Polish)',
  fr: 'Français (French)',
  hi: 'हिन्दी (Hindi)'
});

export const BASE_STRINGS = Object.freeze({
  'app.title': 'Reign 1450 — Sovereign Strategy',
  'start.begin': 'BEGIN REIGN',
  'hud.treasury': 'TREASURY',
  'hud.food': 'FOOD',
  'hud.army': 'TOTAL ARMY',
  'hud.stability': 'STABILITY',
  'hud.prestige': 'PRESTIGE',
  'hud.legitimacy': 'LEGITIMACY',
  'hud.advanceMonth': 'ADVANCE MONTH',
  'hud.soundOn': 'Sound On',
  'hud.soundOff': 'Sound Off',
  'nav.crown': 'Crown',
  'nav.court': 'Court & Vassals',
  'nav.economy': 'Economy',
  'nav.diplomacy': 'Diplomacy',
  'nav.military': 'War & Army',
  'nav.chronicle': 'Chronicle',
  'nav.hometown': 'Capital',
  'nav.search': 'Search',
  'nav.legacy': 'Legacy',
  'battle.deploy': 'START ASSAULT',
  'battle.pause': 'PAUSE',
  'battle.resume': 'RESUME',
  'battle.retreat': 'RETREAT',
  'battle.rally': 'RALLY',
  'settings.title': 'Campaign settings',
  'settings.language': 'Language',
  'settings.keybindings': 'Custom Keybindings',
  'settings.resetKeys': 'Reset Default Keys',
  'coa.title': 'Royal Coat of Arms Studio',
  'coa.save': 'Save Royal Arms'
});

const LOCALE_TRANSLATIONS = Object.freeze({
  en: BASE_STRINGS,
  'zh-CN': {
    'app.title': '1450王朝 — 君主大战略',
    'start.begin': '开启统治',
    'hud.treasury': '国库',
    'hud.food': '粮草',
    'hud.army': '总兵力',
    'hud.stability': '稳定度',
    'hud.prestige': '威望',
    'hud.legitimacy': '正统性',
    'hud.advanceMonth': '推进月份',
    'hud.soundOn': '开启音效',
    'hud.soundOff': '静音',
    'nav.crown': '王权',
    'nav.court': '宫廷与附庸',
    'nav.economy': '经济与建设',
    'nav.diplomacy': '外交',
    'nav.military': '军事与战争',
    'nav.chronicle': '编年史',
    'nav.hometown': '王都',
    'nav.search': '检索',
    'nav.legacy': '王朝传承',
    'battle.deploy': '发起进攻',
    'battle.pause': '暂停',
    'battle.resume': '继续',
    'battle.retreat': '撤退',
    'battle.rally': '鼓舞士气',
    'settings.title': '战役设置',
    'settings.language': '界面语言',
    'settings.keybindings': '自定义快捷键',
    'settings.resetKeys': '恢复默认按键',
    'coa.title': '皇家纹章工坊',
    'coa.save': '保存王室纹章'
  },
  de: {
    'app.title': 'Reign 1450 — Große Strategie',
    'start.begin': 'HERRSCHAFT BEGINNEN',
    'hud.treasury': 'SCHATZKAMMER',
    'hud.food': 'VORRÄTE',
    'hud.army': 'GESAMTHEER',
    'hud.stability': 'STABILITÄT',
    'hud.prestige': 'PRESTIGE',
    'hud.legitimacy': 'LEGITIMITÄT',
    'hud.advanceMonth': 'NÄCHSTER MONAT',
    'hud.soundOn': 'Ton ein',
    'hud.soundOff': 'Ton aus',
    'nav.crown': 'Krone',
    'nav.court': 'Hof & Vasallen',
    'nav.economy': 'Wirtschaft',
    'nav.diplomacy': 'Diplomatie',
    'nav.military': 'Krieg & Heer',
    'nav.chronicle': 'Chronik',
    'nav.hometown': 'Hauptstadt',
    'nav.search': 'Suche',
    'nav.legacy': 'Vermächtnis',
    'battle.deploy': 'ANGRIFF STARTEN',
    'battle.pause': 'PAUSE',
    'battle.resume': 'WEITER',
    'battle.retreat': 'RÜCKZUG',
    'battle.rally': 'SAMMELN',
    'settings.title': 'Kampagneneinstellungen',
    'settings.language': 'Sprache',
    'settings.keybindings': 'Tastenbelegung',
    'settings.resetKeys': 'Standard zurücksetzen',
    'coa.title': 'Wappenwerkstatt',
    'coa.save': 'Wappen speichern'
  },
  es: {
    'app.title': 'Reign 1450 — Gran Estrategia',
    'start.begin': 'COMENZAR REINADO',
    'hud.treasury': 'TESORO',
    'hud.food': 'VÍVERES',
    'hud.army': 'EJÉRCITO TOTAL',
    'hud.stability': 'ESTABILIDAD',
    'hud.prestige': 'PRESTIGIO',
    'hud.legitimacy': 'LEGITIMIDAD',
    'hud.advanceMonth': 'AVANZAR MES',
    'hud.soundOn': 'Sonido activado',
    'hud.soundOff': 'Silenciado',
    'nav.crown': 'Corona',
    'nav.court': 'Corte y Vasallos',
    'nav.economy': 'Economía',
    'nav.diplomacy': 'Diplomacia',
    'nav.military': 'Guerra y Ejército',
    'nav.chronicle': 'Crónica',
    'nav.hometown': 'Capital',
    'nav.search': 'Buscar',
    'nav.legacy': 'Legado',
    'battle.deploy': 'INICIAR ASALTO',
    'battle.pause': 'PAUSA',
    'battle.resume': 'REANUDAR',
    'battle.retreat': 'RETIRADA',
    'battle.rally': 'REAGRUPAR',
    'settings.title': 'Ajustes de campaña',
    'settings.language': 'Idioma',
    'settings.keybindings': 'Atajos de teclado',
    'settings.resetKeys': 'Restablecer teclas',
    'coa.title': 'Taller Heráldico Real',
    'coa.save': 'Guardar Blasón'
  },
  'pt-BR': {
    'app.title': 'Reign 1450 — Grande Estratégia',
    'start.begin': 'INICIAR REINADO',
    'hud.treasury': 'TESOURO',
    'hud.food': 'MANTIMENTOS',
    'hud.army': 'EXÉRCITO TOTAL',
    'hud.stability': 'ESTABILIDADE',
    'hud.prestige': 'PRESTÍGIO',
    'hud.legitimacy': 'LEGITIMIDADE',
    'hud.advanceMonth': 'AVANÇAR MÊS',
    'hud.soundOn': 'Som ligado',
    'hud.soundOff': 'Som desligado',
    'nav.crown': 'Coroa',
    'nav.court': 'Corte e Vassalos',
    'nav.economy': 'Economia',
    'nav.diplomacy': 'Diplomacia',
    'nav.military': 'Guerra e Exército',
    'nav.chronicle': 'Crônica',
    'nav.hometown': 'Capital',
    'nav.search': 'Buscar',
    'nav.legacy': 'Legado',
    'battle.deploy': 'INICIAR ATAQUE',
    'battle.pause': 'PAUSAR',
    'battle.resume': 'RETOMAR',
    'battle.retreat': 'RECUAR',
    'battle.rally': 'REAGRUPAR',
    'settings.title': 'Configurações da campanha',
    'settings.language': 'Idioma',
    'settings.keybindings': 'Atalhos personalizados',
    'settings.resetKeys': 'Restaurar padrão',
    'coa.title': 'Estúdio Heráldico Real',
    'coa.save': 'Salvar Brasão'
  },
  ru: {
    'app.title': 'Reign 1450 — Глобальная стратегия',
    'hud.treasury': 'КАЗНА',
    'hud.food': 'ПРОВИАНТ',
    'hud.army': 'АРМИЯ',
    'hud.stability': 'СТАБИЛЬНОСТЬ',
    'hud.prestige': 'ПРЕСТИЖ',
    'hud.legitimacy': 'ЛЕГИТИМНОСТЬ',
    'hud.advanceMonth': 'СЛЕД. МЕСЯЦ',
    'hud.soundOn': 'Звук вкл.',
    'hud.soundOff': 'Звук выкл.',
    'nav.crown': 'Корона',
    'nav.court': 'Двор и вассалы',
    'nav.economy': 'Экономика',
    'nav.diplomacy': 'Дипломатия',
    'nav.military': 'Армия и война',
    'nav.chronicle': 'Хроника',
    'nav.hometown': 'Столица',
    'nav.search': 'Поиск',
    'nav.legacy': 'Наследие',
    'battle.deploy': 'НАЧАТЬ ШТУРМ',
    'battle.pause': 'ПАУЗА',
    'battle.resume': 'ПРОДОЛЖИТЬ',
    'battle.retreat': 'ОТСТУПЛЕНИЕ',
    'battle.rally': 'СПЛОТИТЬ',
    'settings.title': 'Настройки кампании',
    'settings.language': 'Язык',
    'settings.keybindings': 'Горячие клавиши',
    'settings.resetKeys': 'Сбросить клавиши',
    'coa.title': 'Мастерская гербов',
    'coa.save': 'Сохранить герб'
  },
  pl: {
    'app.title': 'Reign 1450 — Wielka Strategia',
    'hud.treasury': 'SKARBIEC',
    'hud.food': 'ZAPASY',
    'hud.army': 'ARMIA',
    'hud.stability': 'STABILNOŚĆ',
    'hud.prestige': 'PRESTIŻ',
    'hud.legitimacy': 'LEGITYMACJA',
    'hud.advanceMonth': 'NASTĘPNY MIESIĄC',
    'hud.soundOn': 'Dźwięk wł.',
    'hud.soundOff': 'Dźwięk wył.',
    'nav.crown': 'Korona',
    'nav.court': 'Dwór i Wasale',
    'nav.economy': 'Gospodarka',
    'nav.diplomacy': 'Dyplomacja',
    'nav.military': 'Wojna i Armia',
    'nav.chronicle': 'Kronika',
    'nav.hometown': 'Stolica',
    'nav.search': 'Szukaj',
    'nav.legacy': 'Dziedzictwo',
    'battle.deploy': 'ROZPOCZNIJ BITWĘ',
    'battle.pause': 'PAUZA',
    'battle.resume': 'WZNÓW',
    'battle.retreat': 'ODWRÓT',
    'battle.rally': 'ZBIÓRKA',
    'settings.title': 'Ustawienia kampanii',
    'settings.language': 'Język',
    'settings.keybindings': 'Skróty klawiszowe',
    'settings.resetKeys': 'Przywróć domyślne',
    'coa.title': 'Pracownia Herbowa',
    'coa.save': 'Zapisz Herb'
  },
  fr: {
    'app.title': 'Reign 1450 — Grande Stratégie',
    'hud.treasury': 'TRÉSOR',
    'hud.food': 'VIVRES',
    'hud.army': 'ARMÉE TOTALE',
    'hud.stability': 'STABILITÉ',
    'hud.prestige': 'PRESTIGE',
    'hud.legitimacy': 'LÉGITIMITÉ',
    'hud.advanceMonth': 'MOIS SUIVANT',
    'hud.soundOn': 'Son activé',
    'hud.soundOff': 'Son coupé',
    'nav.crown': 'Couronne',
    'nav.court': 'Cour et Vassaux',
    'nav.economy': 'Économie',
    'nav.diplomacy': 'Diplomatie',
    'nav.military': 'Guerre et Armée',
    'nav.chronicle': 'Chronique',
    'nav.hometown': 'Capitale',
    'nav.search': 'Chercher',
    'nav.legacy': 'Héritage',
    'battle.deploy': 'LANCER L’ASSAUT',
    'battle.pause': 'PAUSE',
    'battle.resume': 'REPRENDRE',
    'battle.retreat': 'RETRAITE',
    'battle.rally': 'RALLIEMENT',
    'settings.title': 'Paramètres de campagne',
    'settings.language': 'Langue',
    'settings.keybindings': 'Raccourcis clavier',
    'settings.resetKeys': 'Réinitialiser',
    'coa.title': 'Atelier Héraldique Royal',
    'coa.save': 'Enregistrer le Blason'
  },
  hi: {
    'app.title': 'रेन 1450 — भव्य रणनीति',
    'hud.treasury': 'राजकोष',
    'hud.food': 'अन्न भंडार',
    'hud.army': 'कुल सेना',
    'hud.stability': 'स्थिरता',
    'hud.prestige': 'प्रतिष्ठा',
    'hud.legitimacy': 'वैधता',
    'hud.advanceMonth': 'अगला माह',
    'hud.soundOn': 'ध्वनि चालू',
    'hud.soundOff': 'ध्वनि बंद',
    'nav.crown': 'राजमुकुट',
    'nav.court': 'दरबार व सामंत',
    'nav.economy': 'अर्थव्यवस्था',
    'nav.diplomacy': 'कूटनीति',
    'nav.military': 'युद्ध व सेना',
    'nav.chronicle': 'राजवंश इतिवृत्त',
    'nav.hometown': 'राजधानी',
    'nav.search': 'खोजें',
    'nav.legacy': 'विरासत',
    'battle.deploy': 'आक्रमण प्रारंभ',
    'battle.pause': 'रोकें',
    'battle.resume': 'जारी रखें',
    'battle.retreat': 'पीछे हटें',
    'battle.rally': 'सैन्य आह्वान',
    'settings.title': 'अभियान सेटिंग्स',
    'settings.language': 'भाषा',
    'settings.keybindings': 'कस्टम कुंजीपटल',
    'settings.resetKeys': 'डिफ़ॉल्ट कुंजियाँ',
    'coa.title': 'राजचिह्न कार्यशाला',
    'coa.save': 'राजचिह्न सहेजें'
  }
});

let currentLocale = 'en';

export function getLocale() {
  try {
    const saved = globalThis.localStorage?.getItem('crown-of-nations.locale');
    if (saved && SUPPORTED_LOCALES.includes(saved)) return saved;
  } catch {}
  return currentLocale;
}

export function setLocale(locale) {
  currentLocale = SUPPORTED_LOCALES.includes(locale) ? locale : 'en';
  try { globalThis.localStorage?.setItem('crown-of-nations.locale', currentLocale); } catch {}
  return currentLocale;
}

export function t(key, varsOrLocale = {}, maybeLocale = getLocale()) {
  let vars = varsOrLocale;
  let locale = maybeLocale;
  if (typeof varsOrLocale === 'string') {
    locale = varsOrLocale;
    vars = {};
  }
  const dict = LOCALE_TRANSLATIONS[locale] || LOCALE_TRANSLATIONS.en;
  let str = dict[key] ?? BASE_STRINGS[key] ?? key;
  for (const [k, v] of Object.entries(vars || {})) {
    str = str.replaceAll('{' + k + '}', String(v));
  }
  return str;
}

export function applyTranslations(doc = globalThis.document, locale = getLocale()) {
  if (!doc) return locale;
  const active = SUPPORTED_LOCALES.includes(locale) ? locale : 'en';
  if (doc.documentElement) doc.documentElement.lang = active;
  for (const el of doc.querySelectorAll?.('[data-i18n]') || []) {
    el.textContent = t(el.dataset.i18n, {}, active);
  }
  const nextBtn = doc.getElementById?.('next-month');
  if (nextBtn) nextBtn.innerHTML = `${t('hud.advanceMonth', {}, active)} <span>›</span>`;
  const hudMap = [
    ['resource-gold', 'hud.treasury'],
    ['resource-food', 'hud.food'],
    ['resource-army', 'hud.army'],
    ['resource-stability', 'hud.stability'],
    ['resource-prestige', 'hud.prestige'],
    ['resource-legitimacy', 'hud.legitimacy']
  ];
  for (const [id, key] of hudMap) {
    const lbl = doc.getElementById?.(id)?.parentElement?.querySelector?.('small');
    if (lbl) lbl.textContent = t(key, {}, active);
  }
  const navKeys = {
    realm: 'nav.crown',
    political: 'nav.court',
    economy: 'nav.economy',
    diplomacy: 'nav.diplomacy',
    military: 'nav.military',
    chronicle: 'nav.chronicle'
  };
  for (const [tabId, key] of Object.entries(navKeys)) {
    const span = doc.querySelector?.(`#quick-nav [data-priority-tab="${tabId}"] span`);
    if (span) span.textContent = t(key, {}, active);
  }
  const capSpan = doc.querySelector?.('#capital-nav span');
  if (capSpan) capSpan.textContent = t('nav.hometown', {}, active);
  const startBtn = doc.getElementById?.('battle-start');
  if (startBtn) startBtn.textContent = t('battle.deploy', {}, active);
  const retreatBtn = doc.getElementById?.('battle-retreat');
  if (retreatBtn) retreatBtn.textContent = t('battle.retreat', {}, active);
  return active;
}
