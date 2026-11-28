export const SUPPORTED_LOCALES = Object.freeze(['en', 'zh-CN', 'de', 'es', 'pt-BR']);

export const BASE_STRINGS = Object.freeze({
  'app.title': 'Sovereign: 1450',
  'app.tagline': 'Rule your dynasty. Build your capital. Defend your legacy.',
  'start.begin': 'BEGIN YOUR REIGN',
  'hud.treasury': 'TREASURY',
  'hud.army': 'TOTAL ARMY',
  'hud.stability': 'STABILITY',
  'hud.prestige': 'PRESTIGE',
  'hud.legitimacy': 'LEGITIMACY',
  'hud.advanceMonth': 'ADVANCE MONTH',
  'nav.hometown': 'Hometown',
  'nav.manage': 'Manage kingdom',
  'nav.reign': 'Reign',
  'nav.court': 'Court',
  'nav.diplomacy': 'Diplomacy',
  'nav.military': 'Military',
  'nav.chronicle': 'Chronicle',
  'battle.start': 'START BATTLE',
  'battle.rally': 'RALLY',
  'battle.retreat': 'RETREAT'
});

const LOCALE_OVERRIDES = {
  'zh-CN': {
    'app.title': '主权：1450',
    'start.begin': '开启统治',
    'hud.treasury': '国库',
    'hud.army': '总兵力',
    'hud.stability': '稳定度',
    'hud.advanceMonth': '推进月份',
    'nav.hometown': '都城建设',
    'battle.start': '开始战斗'
  },
  de: {
    'start.begin': 'HERRSCHAFT BEGINNEN',
    'hud.treasury': 'SCHATZKAMMER',
    'hud.army': 'GESAMTHEER',
    'hud.stability': 'STABILITÄT',
    'hud.advanceMonth': 'MONAT WEITER',
    'nav.hometown': 'Hauptstadt',
    'battle.start': 'SCHLACHT BEGINNEN'
  },
  es: {
    'start.begin': 'COMENZAR REINADO',
    'hud.treasury': 'TESORO',
    'hud.army': 'EJÉRCITO TOTAL',
    'hud.stability': 'ESTABILIDAD',
    'hud.advanceMonth': 'AVANZAR MES',
    'nav.hometown': 'Capital Real',
    'battle.start': 'INICIAR BATALLA'
  },
  'pt-BR': {
    'start.begin': 'INICIAR REINADO',
    'hud.treasury': 'TESOURO',
    'hud.army': 'EXÉRCITO TOTAL',
    'hud.stability': 'ESTABILIDADE',
    'hud.advanceMonth': 'AVANÇAR MÊS',
    'nav.hometown': 'Capital Real',
    'battle.start': 'INICIAR BATALHA'
  }
};

export function t(key, locale = 'en', fallback = null) {
  const table = LOCALE_OVERRIDES[locale];
  if (table && Object.hasOwn(table, key)) return table[key];
  if (Object.hasOwn(BASE_STRINGS, key)) return BASE_STRINGS[key];
  return fallback ?? key;
}
