// @flow
import * as React from 'react';

import paperDecorator from '../../../PaperDecorator';
import MarketingPlans from '../../../../MarketingPlans/MarketingPlans';
import AuthenticatedUserContext from '../../../../Profile/AuthenticatedUserContext';
import { MarketingPlansStoreStateProvider } from '../../../../MarketingPlans/MarketingPlansStoreContext';
import {
  fakeAuthenticatedUserWithNoSubscriptionAndCredits,
  fakeGame,
  game2,
} from '../../../../fixtures/AirStudioServicesTestData';
import {
  client as gameApiAxiosClient,
  type GameFeaturing,
  type MarketingPlan,
} from '../../../../Utils/AirStudioServices/Game';
import MockAdapter from 'axios-mock-adapter';

export default {
  title: 'GameDashboard/Marketing/MarketingPlans',
  component: MarketingPlans,
  decorators: [paperDecorator],
};

const now = Date.now();
const nowMinusOneDay = now - 24 * 60 * 60 * 1000;
const nowPlusOneDay = now + 24 * 60 * 60 * 1000;

const marketingPlans: MarketingPlan[] = [
  {
    id: 'featuring-basic',
    nameByLocale: {
      en: 'gd.games Boost',
    },
    icon: 'speaker',
    canExtend: true,
    requiresManualContact: false,
    includedFeaturings: ['games-platform-home'],
    gameRequirements: {
      hasThumbnail: true,
      isPublished: true,
      isDiscoverable: true,
    },
    descriptionByLocale: {
      en: 'Perfect to playtest your alpha build and gather information.',
      'fr-FR':
        'Parfait pour tester votre version alpha et collecter des informations.',
      'ar-SA': 'Ù…Ø«Ø§Ù„ÙŠ Ù„Ø§Ø®ØªØ¨Ø§Ø± Ø¥ØµØ¯Ø§Ø± Ø£Ù„ÙØ§ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ ÙˆØ¬Ù…Ø¹ Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª.',
      'de-DE':
        'Perfekt, um Ihren Alpha-Build zu testen und Informationen zu sammeln.',
      'es-ES': 'Perfecto para probar su versiÃ³n alfa y recopilar informaciÃ³n.',
      'it-IT':
        'Perfetto per testare la tua versione alpha e raccogliere informazioni.',
      'ja-JP': 'ã‚¢ãƒ«ãƒ•ã‚¡ãƒ“ãƒ«ãƒ‰ã‚’ãƒ†ã‚¹ãƒˆã—ã¦æƒ…å ±ã‚’åŽé›†ã™ã‚‹ã®ã«æœ€é©ã§ã™ã€‚',
      'ko-KR': 'ì•ŒíŒŒ ë¹Œë“œë¥¼ í…ŒìŠ¤íŠ¸í•˜ê³  ì •ë³´ë¥¼ ìˆ˜ì§‘í•˜ê¸°ì— ì´ìƒì ìž…ë‹ˆë‹¤.',
      'pl-PL': 'Idealny do przetestowania wersji alfa i zbierania informacji.',
      'pt-BR': 'Perfeito para testar sua versÃ£o alfa e coletar informaÃ§Ãµes.',
      'ru-RU':
        'Ð˜Ð´ÐµÐ°Ð»ÑŒÐ½Ð¾ Ð¿Ð¾Ð´Ñ…Ð¾Ð´Ð¸Ñ‚ Ð´Ð»Ñ Ñ‚ÐµÑÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð°Ð»ÑŒÑ„Ð°-Ð²ÐµÑ€ÑÐ¸Ð¸ Ð¸ ÑÐ±Ð¾Ñ€Ð° Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸.',
      'sl-SI': 'Popolno za testiranje alfa razliÄice in zbiranje informacij.',
      'uk-UA':
        'Ð†Ð´ÐµÐ°Ð»ÑŒÐ½Ð¾ Ð¿Ñ–Ð´Ñ…Ð¾Ð´Ð¸Ñ‚ÑŒ Ð´Ð»Ñ Ñ‚ÐµÑÑ‚ÑƒÐ²Ð°Ð½Ð½Ñ Ð°Ð»ÑŒÑ„Ð°-Ð²ÐµÑ€ÑÑ–Ñ— Ñ‚Ð° Ð·Ð±Ð¾Ñ€Ñƒ Ñ–Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ñ–Ñ—.',
      'zh-CN': 'å®Œç¾Žçš„æµ‹è¯•æ‚¨çš„alphaç‰ˆæœ¬å¹¶æ”¶é›†ä¿¡æ¯ã€‚',
    },
    bulletPointsByLocale: [
      {
        en: 'Be promoted on gd.games homepage for 7 days',
        'fr-FR':
          "ÃŠtre mis en avant sur la page d'accueil de gd.games pendant 7 jours",
        'ar-SA': 'ÙŠØªÙ… Ø¹Ø±Ø¶Ù‡ Ø¹Ù„Ù‰ Ø§Ù„ØµÙØ­Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ© Ù„Ù€ gd.games Ù„Ù…Ø¯Ø© 7 Ø£ÙŠØ§Ù…',
        'de-DE':
          '7 Tage lang auf der Startseite von gd.games vorgestellt werden',
        'es-ES': 'Destacado en la pÃ¡gina de inicio de gd.games durante 7 dÃ­as',
        'it-IT': 'In primo piano sulla homepage di gd.games per 7 giorni',
        'ja-JP': 'gd.gamesã®ãƒ›ãƒ¼ãƒ ãƒšãƒ¼ã‚¸ã§7æ—¥é–“ç´¹ä»‹ã•ã‚Œã¾ã™',
        'ko-KR': 'gd.gamesì˜ í™ˆíŽ˜ì´ì§€ì—ì„œ 7 ì¼ ë™ì•ˆ ì†Œê°œë©ë‹ˆë‹¤.',
        'pl-PL': 'ZostaÅ„ wyrÃ³Å¼niony na stronie gÅ‚Ã³wnej gd.games przez 7 dni',
        'pt-BR': 'Destaque na pÃ¡gina inicial do gd.games por 7 dias',
        'ru-RU': 'Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´ÑƒÐµÑ‚ÑÑ Ð½Ð° Ð³Ð»Ð°Ð²Ð½Ð¾Ð¹ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ðµ gd.games Ð² Ñ‚ÐµÑ‡ÐµÐ½Ð¸Ðµ 7 Ð´Ð½ÐµÐ¹',
        'sl-SI': 'Prikazano na zaÄetni strani gd.games 7 dni',
        'uk-UA': 'Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´ÑƒÑ”Ñ‚ÑŒÑÑ Ð½Ð° Ð³Ð¾Ð»Ð¾Ð²Ð½Ñ–Ð¹ ÑÑ‚Ð¾Ñ€Ñ–Ð½Ñ†Ñ– gd.games Ð¿Ñ€Ð¾Ñ‚ÑÐ³Ð¾Ð¼ 7 Ð´Ð½Ñ–Ð²',
        'zh-CN': 'åœ¨gd.gamesé¦–é¡µä¸ŠæŽ¨å¹¿7å¤©',
      },
      {
        en: 'Get more player feedback',
        'fr-FR': 'Obtenez plus de commentaires de joueurs',
        'ar-SA': 'Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ Ù…Ø²ÙŠØ¯ Ù…Ù† ØªØ¹Ù„ÙŠÙ‚Ø§Øª Ø§Ù„Ù„Ø§Ø¹Ø¨ÙŠÙ†',
        'de-DE': 'Mehr Spieler-Feedback erhalten',
        'es-ES': 'Obtenga mÃ¡s comentarios de los jugadores',
        'it-IT': 'Ottieni piÃ¹ feedback dai giocatori',
        'ja-JP': 'ã‚ˆã‚Šå¤šãã®ãƒ—ãƒ¬ã‚¤ãƒ¤ãƒ¼ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯ã‚’å–å¾—ã™ã‚‹',
        'ko-KR': 'ë” ë§Žì€ í”Œë ˆì´ì–´ í”¼ë“œë°± ë°›ê¸°',
        'pl-PL': 'Otrzymaj wiÄ™cej opinii graczy',
        'pt-BR': 'Obtenha mais feedback dos jogadores',
        'ru-RU': 'ÐŸÐ¾Ð»ÑƒÑ‡Ð¸Ñ‚ÑŒ Ð±Ð¾Ð»ÑŒÑˆÐµ Ð¾Ñ‚Ð·Ñ‹Ð²Ð¾Ð² Ð¸Ð³Ñ€Ð¾ÐºÐ¾Ð²',
        'sl-SI': 'Pridobite veÄ povratnih informacij igralcev',
        'uk-UA': 'ÐžÑ‚Ñ€Ð¸Ð¼Ð°Ñ‚Ð¸ Ð±Ñ–Ð»ÑŒÑˆÐµ Ð²Ñ–Ð´Ð³ÑƒÐºÑ–Ð² Ð³Ñ€Ð°Ð²Ñ†Ñ–Ð²',
        'zh-CN': 'èŽ·å¾—æ›´å¤šçŽ©å®¶åé¦ˆ',
      },
    ],
    ownedBulletPointsByLocale: [
      {
        en: `Your game is promoted on gd.games.`,
        'fr-FR': `Votre jeu est mis en avant sur gd.games.`,
        'ar-SA': `ÙŠØªÙ… Ø§Ù„ØªØ±ÙˆÙŠØ¬ Ù„Ù„Ø¹Ø¨ØªÙƒ Ø¹Ù„Ù‰ gd.games.`,
        'de-DE': `Ihr Spiel wird auf gd.games beworben.`,
        'es-ES': `Tu juego es promocionado en gd.games.`,
        'it-IT': `Il tuo gioco Ã¨ promosso su gd.games.`,
        'ja-JP': `ã‚ãªãŸã®ã‚²ãƒ¼ãƒ ã¯gd.gamesã§å®£ä¼ã•ã‚Œã¾ã™ã€‚`,
        'ko-KR': `ê·€í•˜ì˜ ê²Œìž„ì€ gd.gamesì—ì„œ í™ë³´ë©ë‹ˆë‹¤.`,
        'pl-PL': `Twoja gra jest promowana na gd.games.`,
        'pt-BR': `Seu jogo Ã© promovido no gd.games.`,
        'ru-RU': `Ð’Ð°ÑˆÐ° Ð¸Ð³Ñ€Ð° Ñ€ÐµÐºÐ»Ð°Ð¼Ð¸Ñ€ÑƒÐµÑ‚ÑÑ Ð½Ð° gd.games.`,
        'sl-SI': `VaÅ¡a igra je promovirana na gd.games.`,
        'uk-UA': `Ð’Ð°ÑˆÐ° Ð³Ñ€Ð° Ñ€ÐµÐºÐ»Ð°Ð¼ÑƒÑ”Ñ‚ÑŒÑÑ Ð½Ð° gd.games.`,
        'zh-CN': `æ‚¨çš„æ¸¸æˆåœ¨gd.gamesä¸ŠæŽ¨å¹¿ã€‚`,
      },
    ],
    additionalSuccessMessageByLocale: {
      en:
        'Ensure that your game is public and you have configured a thumbnail for gd.games. This can take a few minutes for your game to be visible on the platform.',
      'fr-FR':
        'Assurez-vous que votre jeu est public et que vous avez configurÃ© une miniature pour gd.games. Il peut falloir quelques minutes pour que votre jeu soit visible sur la plateforme.',
      'ar-SA':
        'ØªØ£ÙƒØ¯ Ù…Ù† Ø£Ù† Ù„Ø¹Ø¨ØªÙƒ Ø¹Ø§Ù…Ø© ÙˆØ£Ù†Ùƒ Ù‚Ù…Øª Ø¨ØªÙƒÙˆÙŠÙ† ØµÙˆØ±Ø© Ù…ØµØºØ±Ø© Ù„Ù€ gd.games. Ù‚Ø¯ ÙŠØ³ØªØºØ±Ù‚ Ø¨Ø¶Ø¹ Ø¯Ù‚Ø§Ø¦Ù‚ Ø­ØªÙ‰ ØªØ¸Ù‡Ø± Ù„Ø¹Ø¨ØªÙƒ Ø¹Ù„Ù‰ Ø§Ù„Ù…Ù†ØµØ©.',
      'de-DE':
        'Stellen Sie sicher, dass Ihr Spiel Ã¶ffentlich ist und Sie ein Miniaturbild fÃ¼r gd.games konfiguriert haben. Es kann einige Minuten dauern, bis Ihr Spiel auf der Plattform sichtbar ist.',
      'es-ES':
        'AsegÃºrate de que tu juego es pÃºblico y has configurado una miniatura para gd.games. Puede tardar unos minutos en que tu juego sea visible en la plataforma.',
      'it-IT':
        'Assicurati che il tuo gioco sia pubblico e che tu abbia configurato unâ€™anteprima per gd.games. Potrebbero essere necessari alcuni minuti affinchÃ© il tuo gioco sia visibile sulla piattaforma.',
      'ja-JP':
        'ã‚²ãƒ¼ãƒ ãŒå…¬é–‹ã•ã‚Œã¦ãŠã‚Šã€gd.gamesã®ã‚µãƒ ãƒã‚¤ãƒ«ãŒè¨­å®šã•ã‚Œã¦ã„ã‚‹ã“ã¨ã‚’ç¢ºèªã—ã¦ãã ã•ã„ã€‚ã‚²ãƒ¼ãƒ ãŒãƒ—ãƒ©ãƒƒãƒˆãƒ•ã‚©ãƒ¼ãƒ ä¸Šã§è¡¨ç¤ºã•ã‚Œã‚‹ã¾ã§æ•°åˆ†ã‹ã‹ã‚‹å ´åˆãŒã‚ã‚Šã¾ã™ã€‚',
      'ko-KR':
        'ê²Œìž„ì´ ê³µê°œë˜ì–´ ìžˆê³  gd.gamesì— ëŒ€í•œ ì¸ë„¤ì¼ì´ êµ¬ì„±ë˜ì–´ ìžˆëŠ”ì§€ í™•ì¸í•˜ì‹­ì‹œì˜¤. ê²Œìž„ì´ í”Œëž«í¼ì—ì„œ ë³´ì´ëŠ” ë° ëª‡ ë¶„ ì •ë„ ê±¸ë¦´ ìˆ˜ ìžˆìŠµë‹ˆë‹¤.',
      'pl-PL':
        'Upewnij siÄ™, Å¼e twoja gra jest publiczna i masz skonfigurowany miniaturÄ™ dla gd.games. MoÅ¼e minÄ…Ä‡ kilka minut, zanim twoja gra bÄ™dzie widoczna na platformie.',
      'pt-BR':
        'Certifique-se de que seu jogo Ã© pÃºblico e vocÃª configurou uma miniatura para o gd.games. Pode levar alguns minutos para que seu jogo seja visÃ­vel na plataforma.',
      'ru-RU':
        'Ð£Ð±ÐµÐ´Ð¸Ñ‚ÐµÑÑŒ, Ñ‡Ñ‚Ð¾ Ð²Ð°ÑˆÐ° Ð¸Ð³Ñ€Ð° ÑÐ²Ð»ÑÐµÑ‚ÑÑ Ð¾Ð±Ñ‰ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾Ð¹ Ð¸ Ð²Ñ‹ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¸Ð»Ð¸ Ð¼Ð¸Ð½Ð¸Ð°Ñ‚ÑŽÑ€Ñƒ Ð´Ð»Ñ gd.games. Ð­Ñ‚Ð¾ Ð¼Ð¾Ð¶ÐµÑ‚ Ð·Ð°Ð½ÑÑ‚ÑŒ Ð½ÐµÑÐºÐ¾Ð»ÑŒÐºÐ¾ Ð¼Ð¸Ð½ÑƒÑ‚, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð²Ð°ÑˆÐ° Ð¸Ð³Ñ€Ð° ÑÑ‚Ð°Ð»Ð° Ð²Ð¸Ð´Ð¸Ð¼Ð¾Ð¹ Ð½Ð° Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ðµ.',
      'sl-SI':
        'PrepriÄajte se, da je vaÅ¡a igra javna in da ste konfigurirali sliÄico za gd.games. Za vaÅ¡o igro lahko traja nekaj minut, da bo vidna na platformi.',
      'uk-UA':
        'ÐŸÐµÑ€ÐµÐºÐ¾Ð½Ð°Ð¹Ñ‚ÐµÑÑ, Ñ‰Ð¾ Ð²Ð°ÑˆÐ° Ð³Ñ€Ð° Ñ” Ð¿ÑƒÐ±Ð»Ñ–Ñ‡Ð½Ð¾ÑŽ, Ñ– Ð²Ð¸ Ð½Ð°Ð»Ð°ÑˆÑ‚ÑƒÐ²Ð°Ð»Ð¸ Ð¼Ñ–Ð½Ñ–Ð°Ñ‚ÑŽÑ€Ñƒ Ð´Ð»Ñ gd.games. Ð¦Ðµ Ð¼Ð¾Ð¶Ðµ Ð·Ð°Ð¹Ð½ÑÑ‚Ð¸ ÐºÑ–Ð»ÑŒÐºÐ° Ñ…Ð²Ð¸Ð»Ð¸Ð½, Ñ‰Ð¾Ð± Ð²Ð°ÑˆÐ° Ð³Ñ€Ð° ÑÑ‚Ð°Ð»Ð° Ð²Ð¸Ð´Ð¸Ð¼Ð¾ÑŽ Ð½Ð° Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ñ–.',
      'zh-CN':
        'ç¡®ä¿æ‚¨çš„æ¸¸æˆæ˜¯å…¬å¼€çš„ï¼Œå¹¶ä¸”æ‚¨å·²ç»ä¸ºgd.gamesé…ç½®äº†ç¼©ç•¥å›¾ã€‚æ‚¨çš„æ¸¸æˆåœ¨å¹³å°ä¸Šå¯è§å¯èƒ½éœ€è¦å‡ åˆ†é’Ÿã€‚',
    },
    showExpirationDate: true,
  },
  {
    id: 'featuring-pro',
    nameByLocale: {
      en: 'Super Boost',
    },
    icon: 'speedometer',
    canExtend: false,
    requiresManualContact: false,
    includedFeaturings: [
      'games-platform-home',
      'games-platform-listing',
      'games-platform-game-page',
      'games-platform-guaranteed-sessions',
    ],
    gameRequirements: {
      hasThumbnail: true,
      isPublished: true,
      isDiscoverable: true,
    },
    descriptionByLocale: {
      en: 'Perfect for advanced creators who want more exposure and feedback',
      'fr-FR':
        'Parfait pour les crÃ©ateurs avancÃ©s qui souhaitent plus de visibilitÃ© et de commentaires',
      'ar-SA':
        'Ù…Ø«Ø§Ù„ÙŠ Ù„Ù„Ù…Ø¨Ø¯Ø¹ÙŠÙ† Ø§Ù„Ù…ØªÙ‚Ø¯Ù…ÙŠÙ† Ø§Ù„Ø°ÙŠÙ† ÙŠØ±ØºØ¨ÙˆÙ† ÙÙŠ Ø§Ù„Ù…Ø²ÙŠØ¯ Ù…Ù† Ø§Ù„ØªØ¹Ø±Ø¶ ÙˆØ§Ù„ØªØ¹Ù„ÙŠÙ‚Ø§Øª',
      'de-DE':
        'Perfekt fÃ¼r fortgeschrittene Kreative, die mehr Sichtbarkeit und Feedback mÃ¶chten',
      'es-ES':
        'Perfecto para creadores avanzados que desean mÃ¡s exposiciÃ³n y comentarios',
      'it-IT':
        'Perfetto per creatori avanzati che desiderano maggiore visibilitÃ  e feedback',
      'ja-JP': 'ã‚ˆã‚Šå¤šãã®éœ²å‡ºã¨ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯ã‚’æœ›ã‚€ä¸Šç´šã‚¯ãƒªã‚¨ã‚¤ã‚¿ãƒ¼ã«æœ€é©ã§ã™',
      'ko-KR': 'ë” ë§Žì€ ë…¸ì¶œê³¼ í”¼ë“œë°±ì„ ì›í•˜ëŠ” ê³ ê¸‰ ì°½ìž‘ìžì—ê²Œ ì í•©í•©ë‹ˆë‹¤.',
      'pl-PL':
        'Idealny dla zaawansowanych twÃ³rcÃ³w, ktÃ³rzy chcÄ… wiÄ™kszej ekspozycji i opinii',
      'pt-BR':
        'Perfeito para criadores avanÃ§ados que desejam mais exposiÃ§Ã£o e feedback',
      'ru-RU':
        'Ð˜Ð´ÐµÐ°Ð»ÑŒÐ½Ð¾ Ð¿Ð¾Ð´Ñ…Ð¾Ð´Ð¸Ñ‚ Ð´Ð»Ñ Ð¾Ð¿Ñ‹Ñ‚Ð½Ñ‹Ñ… ÑÐ¾Ð·Ð´Ð°Ñ‚ÐµÐ»ÐµÐ¹, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ñ…Ð¾Ñ‚ÑÑ‚ Ð±Ð¾Ð»ÑŒÑˆÐµÐ¹ Ð¸Ð·Ð²ÐµÑÑ‚Ð½Ð¾ÑÑ‚Ð¸ Ð¸ Ð¾Ð±Ñ€Ð°Ñ‚Ð½Ð¾Ð¹ ÑÐ²ÑÐ·Ð¸',
      'sl-SI':
        'Popolno za napredne ustvarjalce, ki Å¾elijo veÄ izpostavljenosti in povratnih informacij',
      'uk-UA':
        'Ð†Ð´ÐµÐ°Ð»ÑŒÐ½Ð¾ Ð¿Ñ–Ð´Ñ…Ð¾Ð´Ð¸Ñ‚ÑŒ Ð´Ð»Ñ Ð´Ð¾ÑÐ²Ñ–Ð´Ñ‡ÐµÐ½Ð¸Ñ… Ñ‚Ð²Ð¾Ñ€Ñ†Ñ–Ð², ÑÐºÑ– Ñ…Ð¾Ñ‡ÑƒÑ‚ÑŒ Ð±Ñ–Ð»ÑŒÑˆÐ¾Ñ— Ð²Ñ–Ð´Ð¾Ð¼Ð¾ÑÑ‚Ñ– Ñ‚Ð° Ð·Ð²Ð¾Ñ€Ð¾Ñ‚Ð½Ð¾Ð³Ð¾ Ð·Ð²â€™ÑÐ·ÐºÑƒ',
      'zh-CN': 'é€‚åˆé«˜çº§åˆ›ä½œè€…ï¼Œå¸Œæœ›èŽ·å¾—æ›´å¤šæ›å…‰å’Œåé¦ˆ',
    },
    bulletPointsByLocale: [
      {
        en: `Active until you get 1000 more players`,
        'fr-FR': `Actif jusqu'Ã  ce que vous obteniez 1000 joueurs supplÃ©mentaires`,
        'ar-SA': `Ù†Ø´Ø· Ø­ØªÙ‰ ØªØ­ØµÙ„ Ø¹Ù„Ù‰ 1000 Ù„Ø§Ø¹Ø¨Ù‹Ø§ Ø¢Ø®Ø±ÙŠÙ†`,
        'de-DE': `Aktiv, bis Sie 1000 weitere Spieler erhalten`,
        'es-ES': `Activo hasta que obtengas 1000 jugadores mÃ¡s`,
        'it-IT': `Attivo fino a quando non ottieni 1000 giocatori in piÃ¹`,
        'ja-JP': `1000äººä»¥ä¸Šã®ãƒ—ãƒ¬ã‚¤ãƒ¤ãƒ¼ã‚’ç²å¾—ã™ã‚‹ã¾ã§æœ‰åŠ¹ã§ã™`,
        'ko-KR': `1000ëª… ì´ìƒì˜ í”Œë ˆì´ì–´ë¥¼ ì–»ì„ ë•Œê¹Œì§€ í™œì„±í™”ë©ë‹ˆë‹¤`,
        'pl-PL': `Aktywny do momentu zdobycia 1000 dodatkowych graczy`,
        'pt-BR': `Ativo atÃ© vocÃª obter 1000 jogadores adicionais`,
        'ru-RU': `ÐÐºÑ‚Ð¸Ð²Ð½Ð¾ Ð´Ð¾ Ñ‚ÐµÑ… Ð¿Ð¾Ñ€, Ð¿Ð¾ÐºÐ° Ð²Ñ‹ Ð½Ðµ Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ñ‚Ðµ 1000 Ð´Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ñ… Ð¸Ð³Ñ€Ð¾ÐºÐ¾Ð²`,
        'sl-SI': `Aktivno, dokler ne pridobite 1000 dodatnih igralcev`,
        'uk-UA': `ÐÐºÑ‚Ð¸Ð²Ð½Ð¸Ð¹, Ð¿Ð¾ÐºÐ¸ Ð²Ð¸ Ð½Ðµ Ð¾Ñ‚Ñ€Ð¸Ð¼Ð°Ñ”Ñ‚Ðµ 1000 Ð´Ð¾Ð´Ð°Ñ‚ÐºÐ¾Ð²Ð¸Ñ… Ð³Ñ€Ð°Ð²Ñ†Ñ–Ð²`,
        'zh-CN': `æ´»åŠ¨ç›´åˆ°æ‚¨èŽ·å¾—1000åä»¥ä¸Šçš„çŽ©å®¶`,
      },
      {
        en:
          'Immediate impact: Get new players from around the world thanks to ads we run for your game.',
        'fr-FR':
          'Impact immÃ©diat : Obtenez de nouveaux joueurs du monde entier grÃ¢ce aux publicitÃ©s que nous diffusons pour votre jeu.',
        'ar-SA':
          'ØªØ£Ø«ÙŠØ± ÙÙˆØ±ÙŠ: Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ Ù„Ø§Ø¹Ø¨ÙŠÙ† Ø¬Ø¯Ø¯ Ù…Ù† Ø¬Ù…ÙŠØ¹ Ø£Ù†Ø­Ø§Ø¡ Ø§Ù„Ø¹Ø§Ù„Ù… Ø¨ÙØ¶Ù„ Ø§Ù„Ø¥Ø¹Ù„Ø§Ù†Ø§Øª Ø§Ù„ØªÙŠ Ù†Ù‚ÙˆÙ… Ø¨ØªØ´ØºÙŠÙ„Ù‡Ø§ Ù„Ù„Ø¹Ø¨ØªÙƒ.',
        'de-DE':
          'Sofortige Wirkung: Erhalten Sie neue Spieler aus der ganzen Welt dank der Anzeigen, die wir fÃ¼r Ihr Spiel schalten.',
        'es-ES':
          'Impacto inmediato: ObtÃ©n nuevos jugadores de todo el mundo gracias a los anuncios que ejecutamos para tu juego.',
        'it-IT':
          'Impatto immediato: Ottieni nuovi giocatori da tutto il mondo grazie agli annunci che eseguiamo per il tuo gioco.',
        'ja-JP':
          'å³æ™‚çš„ãªå½±éŸ¿ï¼šç§ãŸã¡ãŒã‚ãªãŸã®ã‚²ãƒ¼ãƒ ã®ãŸã‚ã«å®Ÿæ–½ã™ã‚‹åºƒå‘Šã®ãŠã‹ã’ã§ã€ä¸–ç•Œä¸­ã‹ã‚‰æ–°ã—ã„ãƒ—ãƒ¬ã‚¤ãƒ¤ãƒ¼ã‚’ç²å¾—ã—ã¾ã™ã€‚',
        'ko-KR':
          'ì¦‰ê°ì ì¸ íš¨ê³¼: ê´‘ê³  ë•ë¶„ì— ì „ ì„¸ê³„ì˜ ìƒˆë¡œìš´ í”Œë ˆì´ì–´ë¥¼ ì–»ì„ ìˆ˜ ìžˆìŠµë‹ˆë‹¤.',
        'pl-PL':
          'Natychmiastowy efekt: Zyskaj nowych graczy z caÅ‚ego Å›wiata dziÄ™ki reklamom, ktÃ³re prowadzimy dla twojej gry.',
        'pt-BR':
          'Impacto imediato: Obtenha novos jogadores de todo o mundo graÃ§as aos anÃºncios que executamos para o seu jogo.',
        'ru-RU':
          'ÐÐµÐ¼ÐµÐ´Ð»ÐµÐ½Ð½Ð¾Ðµ Ð²Ð¾Ð·Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ: ÐŸÐ¾Ð»ÑƒÑ‡Ð¸Ñ‚Ðµ Ð½Ð¾Ð²Ñ‹Ñ… Ð¸Ð³Ñ€Ð¾ÐºÐ¾Ð² ÑÐ¾ Ð²ÑÐµÐ³Ð¾ Ð¼Ð¸Ñ€Ð° Ð±Ð»Ð°Ð³Ð¾Ð´Ð°Ñ€Ñ Ñ€ÐµÐºÐ»Ð°Ð¼Ðµ, ÐºÐ¾Ñ‚Ð¾Ñ€ÑƒÑŽ Ð¼Ñ‹ Ñ€Ð°Ð·Ð¼ÐµÑ‰Ð°ÐµÐ¼ Ð´Ð»Ñ Ð²Ð°ÑˆÐµÐ¹ Ð¸Ð³Ñ€Ñ‹.',
        'sl-SI':
          'TakojÅ¡nji uÄinek: ZahvaljujoÄ oglasom, ki jih objavljamo za vaÅ¡o igro, pridobite nove igralce z vsega sveta.',
        'uk-UA':
          'ÐœÐ¸Ñ‚Ñ‚Ñ”Ð²Ð¸Ð¹ Ð²Ð¿Ð»Ð¸Ð²: ÐžÑ‚Ñ€Ð¸Ð¼Ð°Ð¹Ñ‚Ðµ Ð½Ð¾Ð²Ð¸Ñ… Ð³Ñ€Ð°Ð²Ñ†Ñ–Ð² Ð· ÑƒÑÑŒÐ¾Ð³Ð¾ ÑÐ²Ñ–Ñ‚Ñƒ Ð·Ð°Ð²Ð´ÑÐºÐ¸ Ñ€ÐµÐºÐ»Ð°Ð¼Ñ–, ÑÐºÑƒ Ð¼Ð¸ Ñ€Ð¾Ð·Ð¼Ñ–Ñ‰ÑƒÑ”Ð¼Ð¾ Ð´Ð»Ñ Ð²Ð°ÑˆÐ¾Ñ— Ð³Ñ€Ð¸.',
        'zh-CN':
          'ç«‹å³å½±å“ï¼šé€šè¿‡æˆ‘ä»¬ä¸ºæ‚¨çš„æ¸¸æˆè¿è¡Œçš„å¹¿å‘Šï¼Œä»Žä¸–ç•Œå„åœ°èŽ·å¾—æ–°çŽ©å®¶ã€‚',
      },
      {
        en: `Game promoted everywhere on gd.games for 10 days`,
        'fr-FR': `Jeu promu partout sur gd.games pendant 10 jours`,
        'ar-SA': `ØªØ±ÙˆÙŠØ¬ Ø§Ù„Ù„Ø¹Ø¨Ø© ÙÙŠ ÙƒÙ„ Ù…ÙƒØ§Ù† Ø¹Ù„Ù‰ gd.games Ù„Ù…Ø¯Ø© 10 Ø£ÙŠØ§Ù…`,
        'de-DE': `Spiel wird Ã¼berall auf gd.games fÃ¼r 10 Tage`,
        'es-ES': `Juego promocionado en todo gd.games durante 10 dÃ­as`,
        'it-IT': `Gioco promosso ovunque su gd.games per 10 giorni`,
        'ja-JP': `gd.gamesã®ã©ã“ã§ã‚‚10æ—¥é–“ã‚²ãƒ¼ãƒ ã‚’å®£ä¼ã—ã€ç›®æ¨™é”æˆã¾ã§åºƒå‘Šã‚’æŽ²è¼‰ã—ã¾ã™ã€‚`,
        'ko-KR': `gd.gamesì˜ ëª¨ë“  ê³³ì—ì„œ 10 ì¼ ë™ì•ˆ ê²Œìž„ì„ í™ë³´í•˜ê³ , ëª©í‘œ ë‹¬ì„±ê¹Œì§€ ê´‘ê³ ë¥¼ ê²Œìž¬í•©ë‹ˆë‹¤.`,
        'pl-PL': `Gra promowana wszÄ™dzie na gd.games przez 10 dni`,
        'pt-BR': `Jogo promovido em todo o gd.games por 10 dias`,
        'ru-RU': `Ð˜Ð³Ñ€Ð° Ñ€ÐµÐºÐ»Ð°Ð¼Ð¸Ñ€ÑƒÐµÑ‚ÑÑ Ð¿Ð¾Ð²ÑÑŽÐ´Ñƒ Ð½Ð° gd.games Ð² Ñ‚ÐµÑ‡ÐµÐ½Ð¸Ðµ 10 Ð´Ð½ÐµÐ¹`,
        'sl-SI': `Igra je promovirana povsod na gd.games za 10 dni`,
        'uk-UA': `Ð“Ñ€Ð° Ñ€ÐµÐºÐ»Ð°Ð¼ÑƒÑ”Ñ‚ÑŒÑÑ Ð²ÑÑŽÐ´Ð¸ Ð½Ð° gd.games Ð¿Ñ€Ð¾Ñ‚ÑÐ³Ð¾Ð¼ 10 Ð´Ð½Ñ–Ð²`,
        'zh-CN': `åœ¨gd.gamesçš„æ‰€æœ‰åœ°æ–¹æŽ¨å¹¿æ¸¸æˆ10å¤©`,
      },
    ],
    ownedBulletPointsByLocale: [
      {
        en: `Ads are being run for your game until it reaches its boost goal.`,
        'fr-FR': `Des publicitÃ©s sont diffusÃ©es pour votre jeu jusqu'Ã  ce qu'il atteigne son objectif de boost.`,
        'ar-SA': `ØªØªÙ… ØªØ´ØºÙŠÙ„ Ø§Ù„Ø¥Ø¹Ù„Ø§Ù†Ø§Øª Ù„Ù„Ø¹Ø¨ØªÙƒ Ø­ØªÙ‰ ØªØµÙ„ Ø¥Ù„Ù‰ Ù‡Ø¯ÙÙ‡Ø§.`,
        'de-DE': `Anzeigen werden fÃ¼r Ihr Spiel geschaltet, bis es sein Ziel erreicht.`,
        'es-ES': `Se estÃ¡n ejecutando anuncios para tu juego hasta que alcance su objetivo de impulso.`,
        'it-IT': `Gli annunci vengono eseguiti per il tuo gioco fino a quando non raggiunge il suo obiettivo di impulso.`,
        'ja-JP': `ã‚²ãƒ¼ãƒ ãŒç›®æ¨™ã«é”ã™ã‚‹ã¾ã§åºƒå‘ŠãŒå®Ÿæ–½ã•ã‚Œã¾ã™ã€‚`,
        'ko-KR': `ê²Œìž„ì´ ëª©í‘œì— ë„ë‹¬í•  ë•Œê¹Œì§€ ê´‘ê³ ê°€ ê²Œìž¬ë©ë‹ˆë‹¤.`,
        'pl-PL': `Reklamy sÄ… prowadzone dla twojej gry do momentu osiÄ…gniÄ™cia celu promocji.`,
        'pt-BR': `AnÃºncios estÃ£o sendo executados para o seu jogo atÃ© que ele atinja seu objetivo de destaque.`,
        'ru-RU': `Ð ÐµÐºÐ»Ð°Ð¼Ð° Ñ€Ð°Ð·Ð¼ÐµÑ‰Ð°ÐµÑ‚ÑÑ Ð´Ð»Ñ Ð²Ð°ÑˆÐµÐ¹ Ð¸Ð³Ñ€Ñ‹ Ð´Ð¾ Ð´Ð¾ÑÑ‚Ð¸Ð¶ÐµÐ½Ð¸Ñ Ñ†ÐµÐ»Ð¸ Ð¿Ð¾ÑÐ¸Ð»ÐµÐ½Ð¸Ñ.`,
        'sl-SI': `Oglasi se izvajajo za vaÅ¡o igro, dokler ne doseÅ¾e svojega cilja.`,
        'uk-UA': `Ð ÐµÐºÐ»Ð°Ð¼Ð° Ñ€Ð¾Ð·Ð¼Ñ–Ñ‰ÑƒÑ”Ñ‚ÑŒÑÑ Ð´Ð»Ñ Ð²Ð°ÑˆÐ¾Ñ— Ð³Ñ€Ð¸ Ð´Ð¾ Ð´Ð¾ÑÑÐ³Ð½ÐµÐ½Ð½Ñ Ñ†Ñ–Ð»Ñ– Ð¿Ñ–Ð´ÑÐ¸Ð»ÐµÐ½Ð½Ñ.`,
        'zh-CN': `å¹¿å‘Šå°†ä¸€ç›´è¿è¡Œï¼Œç›´åˆ°æ‚¨çš„æ¸¸æˆè¾¾åˆ°å…¶ç›®æ ‡ã€‚`,
      },
      {
        en: `You will receive an email with the results of the featuring.`,
        'fr-FR': `Vous recevrez un e-mail avec les rÃ©sultats de la mise en avant.`,
        'ar-SA': `Ø³ØªØªÙ„Ù‚Ù‰ Ø¨Ø±ÙŠØ¯Ù‹Ø§ Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠÙ‹Ø§ ÙŠØ­ØªÙˆÙŠ Ø¹Ù„Ù‰ Ù†ØªØ§Ø¦Ø¬ Ø§Ù„ØªØ±ÙˆÙŠØ¬.`,
        'de-DE': `Sie erhalten eine E-Mail mit den Ergebnissen der Bewerbung.`,
        'es-ES': `RecibirÃ¡s un correo electrÃ³nico con los resultados de la promociÃ³n.`,
        'it-IT': `Riceverai un'email con i risultati della promozione.`,
        'ja-JP': `ãƒ•ã‚£ãƒ¼ãƒãƒ£ãƒªãƒ³ã‚°ã®çµæžœã‚’è¨˜è¼‰ã—ãŸãƒ¡ãƒ¼ãƒ«ãŒå±Šãã¾ã™ã€‚`,
        'ko-KR': `ì¶”ì²œ ê²°ê³¼ê°€ í¬í•¨ëœ ì´ë©”ì¼ì„ ë°›ê²Œ ë©ë‹ˆë‹¤.`,
        'pl-PL': `Otrzymasz e-mail z wynikami promocji.`,
        'pt-BR': `VocÃª receberÃ¡ um e-mail com os resultados do destaque.`,
        'ru-RU': `Ð’Ñ‹ Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ñ‚Ðµ ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ð¾Ðµ Ð¿Ð¸ÑÑŒÐ¼Ð¾ Ñ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð°Ð¼Ð¸ Ñ€ÐµÐºÐ»Ð°Ð¼Ñ‹.`,
        'sl-SI': `Prejeli boste e-poÅ¡to z rezultati promocije.`,
        'uk-UA': `Ð’Ð¸ Ð¾Ñ‚Ñ€Ð¸Ð¼Ð°Ñ”Ñ‚Ðµ ÐµÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ð¸Ð¹ Ð»Ð¸ÑÑ‚ Ð· Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð°Ð¼Ð¸ Ñ€ÐµÐºÐ»Ð°Ð¼Ð¸.`,
        'zh-CN': `æ‚¨å°†æ”¶åˆ°ä¸€å°åŒ…å«æŽ¨å¹¿ç»“æžœçš„ç”µå­é‚®ä»¶ã€‚`,
      },
    ],
    additionalSuccessMessageByLocale: {
      en:
        'Ensure that your game is public and you have configured a thumbnail for gd.games. This can take a few minutes for your game to be visible on the platform.',
      'fr-FR':
        'Assurez-vous que votre jeu est public et que vous avez configurÃ© une miniature pour gd.games. Il peut falloir quelques minutes pour que votre jeu soit visible sur la plateforme.',
      'ar-SA':
        'ØªØ£ÙƒØ¯ Ù…Ù† Ø£Ù† Ù„Ø¹Ø¨ØªÙƒ Ø¹Ø§Ù…Ø© ÙˆØ£Ù†Ùƒ Ù‚Ù…Øª Ø¨ØªÙƒÙˆÙŠÙ† ØµÙˆØ±Ø© Ù…ØµØºØ±Ø© Ù„Ù€ gd.games. Ù‚Ø¯ ÙŠØ³ØªØºØ±Ù‚ Ø¨Ø¶Ø¹ Ø¯Ù‚Ø§Ø¦Ù‚ Ø­ØªÙ‰ ØªØ¸Ù‡Ø± Ù„Ø¹Ø¨ØªÙƒ Ø¹Ù„Ù‰ Ø§Ù„Ù…Ù†ØµØ©.',
      'de-DE':
        'Stellen Sie sicher, dass Ihr Spiel Ã¶ffentlich ist und Sie ein Miniaturbild fÃ¼r gd.games konfiguriert haben. Es kann einige Minuten dauern, bis Ihr Spiel auf der Plattform sichtbar ist.',
      'es-ES':
        'AsegÃºrate de que tu juego es pÃºblico y has configurado una miniatura para gd.games. Puede tardar unos minutos en que tu juego sea visible en la plataforma.',
      'it-IT':
        'Assicurati che il tuo gioco sia pubblico e che tu abbia configurato unâ€™anteprima per gd.games. Potrebbero essere necessari alcuni minuti affinchÃ© il tuo gioco sia visibile sulla piattaforma.',
      'ja-JP':
        'ã‚²ãƒ¼ãƒ ãŒå…¬é–‹ã•ã‚Œã¦ãŠã‚Šã€gd.gamesã®ã‚µãƒ ãƒã‚¤ãƒ«ãŒè¨­å®šã•ã‚Œã¦ã„ã‚‹ã“ã¨ã‚’ç¢ºèªã—ã¦ãã ã•ã„ã€‚ã‚²ãƒ¼ãƒ ãŒãƒ—ãƒ©ãƒƒãƒˆãƒ•ã‚©ãƒ¼ãƒ ä¸Šã§è¡¨ç¤ºã•ã‚Œã‚‹ã¾ã§æ•°åˆ†ã‹ã‹ã‚‹å ´åˆãŒã‚ã‚Šã¾ã™ã€‚',
      'ko-KR':
        'ê²Œìž„ì´ ê³µê°œë˜ì–´ ìžˆê³  gd.gamesì— ëŒ€í•œ ì¸ë„¤ì¼ì´ êµ¬ì„±ë˜ì–´ ìžˆëŠ”ì§€ í™•ì¸í•˜ì‹­ì‹œì˜¤. ê²Œìž„ì´ í”Œëž«í¼ì—ì„œ ë³´ì´ëŠ” ë° ëª‡ ë¶„ ì •ë„ ê±¸ë¦´ ìˆ˜ ìžˆìŠµë‹ˆë‹¤.',
      'pl-PL':
        'Upewnij siÄ™, Å¼e twoja gra jest publiczna i masz skonfigurowany miniaturÄ™ dla gd.games. MoÅ¼e minÄ…Ä‡ kilka minut, zanim twoja gra bÄ™dzie widoczna na platformie.',
      'pt-BR':
        'Certifique-se de que seu jogo Ã© pÃºblico e vocÃª configurou uma miniatura para o gd.games. Pode levar alguns minutos para que seu jogo seja visÃ­vel na plataforma.',
      'ru-RU':
        'Ð£Ð±ÐµÐ´Ð¸Ñ‚ÐµÑÑŒ, Ñ‡Ñ‚Ð¾ Ð²Ð°ÑˆÐ° Ð¸Ð³Ñ€Ð° ÑÐ²Ð»ÑÐµÑ‚ÑÑ Ð¾Ð±Ñ‰ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾Ð¹ Ð¸ Ð²Ñ‹ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¸Ð»Ð¸ Ð¼Ð¸Ð½Ð¸Ð°Ñ‚ÑŽÑ€Ñƒ Ð´Ð»Ñ gd.games. Ð­Ñ‚Ð¾ Ð¼Ð¾Ð¶ÐµÑ‚ Ð·Ð°Ð½ÑÑ‚ÑŒ Ð½ÐµÑÐºÐ¾Ð»ÑŒÐºÐ¾ Ð¼Ð¸Ð½ÑƒÑ‚, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð²Ð°ÑˆÐ° Ð¸Ð³Ñ€Ð° ÑÑ‚Ð°Ð»Ð° Ð²Ð¸Ð´Ð¸Ð¼Ð¾Ð¹ Ð½Ð° Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ðµ.',
      'sl-SI':
        'PrepriÄajte se, da je vaÅ¡a igra javna in da ste konfigurirali sliÄico za gd.games. Za vaÅ¡o igro lahko traja nekaj minut, da bo vidna na platformi.',
      'uk-UA':
        'ÐŸÐµÑ€ÐµÐºÐ¾Ð½Ð°Ð¹Ñ‚ÐµÑÑ, Ñ‰Ð¾ Ð²Ð°ÑˆÐ° Ð³Ñ€Ð° Ñ” Ð¿ÑƒÐ±Ð»Ñ–Ñ‡Ð½Ð¾ÑŽ, Ñ– Ð²Ð¸ Ð½Ð°Ð»Ð°ÑˆÑ‚ÑƒÐ²Ð°Ð»Ð¸ Ð¼Ñ–Ð½Ñ–Ð°Ñ‚ÑŽÑ€Ñƒ Ð´Ð»Ñ gd.games. Ð¦Ðµ Ð¼Ð¾Ð¶Ðµ Ð·Ð°Ð¹Ð½ÑÑ‚Ð¸ ÐºÑ–Ð»ÑŒÐºÐ° Ñ…Ð²Ð¸Ð»Ð¸Ð½, Ñ‰Ð¾Ð± Ð²Ð°ÑˆÐ° Ð³Ñ€Ð° ÑÑ‚Ð°Ð»Ð° Ð²Ð¸Ð´Ð¸Ð¼Ð¾ÑŽ Ð½Ð° Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ñ–.',
      'zh-CN':
        'ç¡®ä¿æ‚¨çš„æ¸¸æˆæ˜¯å…¬å¼€çš„ï¼Œå¹¶ä¸”æ‚¨å·²ç»ä¸ºgd.gamesé…ç½®äº†ç¼©ç•¥å›¾ã€‚æ‚¨çš„æ¸¸æˆåœ¨å¹³å°ä¸Šå¯è§å¯èƒ½éœ€è¦å‡ åˆ†é’Ÿã€‚',
    },
    showExpirationDate: false,
  },
  {
    id: 'featuring-premium',
    nameByLocale: {
      en: 'Mega Boost',
    },
    icon: 'stars',
    canExtend: false,
    requiresManualContact: true,
    includedFeaturings: [
      'games-platform-home',
      'games-platform-listing',
      'games-platform-game-page',
      'games-platform-guaranteed-sessions',
    ],
    gameRequirements: {},
    descriptionByLocale: {
      en:
        'Perfect for people with a finished game who want to promote it to the widest audience possible',
      'fr-FR':
        'Parfait pour les personnes ayant un jeu terminÃ© qui souhaitent le promouvoir auprÃ¨s du plus large public possible',
      'ar-SA':
        'Ù…Ø«Ø§Ù„ÙŠ Ù„Ù„Ø£Ø´Ø®Ø§Øµ Ø§Ù„Ø°ÙŠÙ† Ù„Ø¯ÙŠÙ‡Ù… Ù„Ø¹Ø¨Ø© Ù…ÙƒØªÙ…Ù„Ø© ÙˆÙŠØ±ØºØ¨ÙˆÙ† ÙÙŠ Ø§Ù„ØªØ±ÙˆÙŠØ¬ Ù„Ù‡Ø§ Ù„Ø£ÙˆØ³Ø¹ Ø¬Ù…Ù‡ÙˆØ± Ù…Ù…ÙƒÙ†',
      'de-DE':
        'Perfekt fÃ¼r Personen mit einem fertigen Spiel, die es einem mÃ¶glichst breiten Publikum vorstellen mÃ¶chten',
      'es-ES':
        'Perfecto para personas con un juego terminado que desean promocionarlo al pÃºblico mÃ¡s amplio posible',
      'it-IT':
        'Perfetto per le persone con un gioco finito che desiderano promuoverlo al pubblico piÃ¹ ampio possibile',
      'ja-JP':
        'å®Œæˆã—ãŸã‚²ãƒ¼ãƒ ã‚’æŒã¤äººã€…ã«æœ€é©ã§ã€ã§ãã‚‹ã ã‘å¹…åºƒã„è¦³å®¢ã«å®£ä¼ã—ãŸã„',
      'ko-KR':
        'ì™„ì„±ëœ ê²Œìž„ì„ ê°€ì§„ ì‚¬ëžŒë“¤ì—ê²Œ ê°€ìž¥ ì í•©í•˜ë©° ê°€ëŠ¥í•œ í•œ ë„“ì€ ê´€ê°ì—ê²Œ í™ë³´í•˜ë ¤ëŠ” ì‚¬ëžŒë“¤ì—ê²Œ ì í•©í•©ë‹ˆë‹¤.',
      'pl-PL':
        'Idealny dla osÃ³b z ukoÅ„czonÄ… grÄ…, ktÃ³re chcÄ… jÄ… promowaÄ‡ w jak najszerszym gronie odbiorcÃ³w',
      'pt-BR':
        'Perfeito para pessoas com um jogo finalizado que desejam promovÃª-lo para o pÃºblico mais amplo possÃ­vel',
      'ru-RU':
        'Ð˜Ð´ÐµÐ°Ð»ÑŒÐ½Ð¾ Ð¿Ð¾Ð´Ñ…Ð¾Ð´Ð¸Ñ‚ Ð´Ð»Ñ Ð»ÑŽÐ´ÐµÐ¹ Ñ Ð³Ð¾Ñ‚Ð¾Ð²Ð¾Ð¹ Ð¸Ð³Ñ€Ð¾Ð¹, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ñ…Ð¾Ñ‚ÑÑ‚ Ð¿Ñ€Ð¾Ð´Ð²Ð¸Ð³Ð°Ñ‚ÑŒ ÐµÐµ Ð½Ð°Ð¸Ð±Ð¾Ð»ÐµÐµ ÑˆÐ¸Ñ€Ð¾ÐºÐ¾Ð¹ Ð°ÑƒÐ´Ð¸Ñ‚Ð¾Ñ€Ð¸Ð¸',
      'sl-SI':
        'Popolno za ljudi z dokonÄano igro, ki jo Å¾elijo promovirati Äim Å¡irÅ¡i javnosti',
      'uk-UA':
        'Ð†Ð´ÐµÐ°Ð»ÑŒÐ½Ð¾ Ð¿Ñ–Ð´Ñ…Ð¾Ð´Ð¸Ñ‚ÑŒ Ð´Ð»Ñ Ð»ÑŽÐ´ÐµÐ¹ Ð· Ð³Ð¾Ñ‚Ð¾Ð²Ð¾ÑŽ Ð³Ñ€Ð¾ÑŽ, ÑÐºÑ– Ñ…Ð¾Ñ‡ÑƒÑ‚ÑŒ Ð¿Ñ€Ð¾ÑÑƒÐ²Ð°Ñ‚Ð¸ Ñ—Ñ— Ð½Ð°Ð¹Ð±Ñ–Ð»ÑŒÑˆ ÑˆÐ¸Ñ€Ð¾ÐºÑ–Ð¹ Ð°ÑƒÐ´Ð¸Ñ‚Ð¾Ñ€Ñ–Ñ—',
      'zh-CN': 'é€‚åˆæ‹¥æœ‰å®Œæˆæ¸¸æˆå¹¶å¸Œæœ›å°†å…¶æŽ¨å¹¿ç»™å°½å¯èƒ½å¹¿æ³›çš„å—ä¼—çš„äºº',
    },
    bulletPointsByLocale: [
      {
        en: `Active until you get 3000 more players`,
        'fr-FR': `Actif jusqu'Ã  ce que vous obteniez 3000 joueurs supplÃ©mentaires`,
        'ar-SA': `Ù†Ø´Ø· Ø­ØªÙ‰ ØªØ­ØµÙ„ Ø¹Ù„Ù‰ 3000 Ù„Ø§Ø¹Ø¨Ù‹Ø§ Ø¢Ø®Ø±ÙŠÙ†`,
        'de-DE': `Aktiv, bis Sie 3000 weitere Spieler erhalten`,
        'es-ES': `Activo hasta que obtengas 3000 jugadores mÃ¡s`,
        'it-IT': `Attivo fino a quando non ottieni 3000 giocatori in piÃ¹`,
        'ja-JP': `3000äººä»¥ä¸Šã®ãƒ—ãƒ¬ã‚¤ãƒ¤ãƒ¼ã‚’ç²å¾—ã™ã‚‹ã¾ã§æœ‰åŠ¹ã§ã™`,
        'ko-KR': `3000ëª… ì´ìƒì˜ í”Œë ˆì´ì–´ë¥¼ ì–»ì„ ë•Œê¹Œì§€ í™œì„±í™”ë©ë‹ˆë‹¤`,
        'pl-PL': `Aktywny do momentu zdobycia 3000 dodatkowych graczy`,
        'pt-BR': `Ativo atÃ© vocÃª obter 3000 jogadores adicionais`,
        'ru-RU': `ÐÐºÑ‚Ð¸Ð²Ð½Ð¾ Ð´Ð¾ Ñ‚ÐµÑ… Ð¿Ð¾Ñ€, Ð¿Ð¾ÐºÐ° Ð²Ñ‹ Ð½Ðµ Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ñ‚Ðµ 3000 Ð´Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ñ… Ð¸Ð³Ñ€Ð¾ÐºÐ¾Ð²`,
        'sl-SI': `Aktivno, dokler ne pridobite 3000 dodatnih igralcev`,
        'uk-UA': `ÐÐºÑ‚Ð¸Ð²Ð½Ð¸Ð¹, Ð¿Ð¾ÐºÐ¸ Ð²Ð¸ Ð½Ðµ Ð¾Ñ‚Ñ€Ð¸Ð¼Ð°Ñ”Ñ‚Ðµ 3000 Ð´Ð¾Ð´Ð°Ñ‚ÐºÐ¾Ð²Ð¸Ñ… Ð³Ñ€Ð°Ð²Ñ†Ñ–Ð²`,
        'zh-CN': `æ´»åŠ¨ç›´åˆ°æ‚¨èŽ·å¾—3000åä»¥ä¸Šçš„çŽ©å®¶`,
      },
      {
        en:
          'Immediate impact: Get new players from around the world thanks to ads we run for your game',
        'fr-FR':
          'Impact immÃ©diat : Obtenez de nouveaux joueurs du monde entier grÃ¢ce aux publicitÃ©s que nous diffusons pour votre jeu',
        'ar-SA':
          'ØªØ£Ø«ÙŠØ± ÙÙˆØ±ÙŠ: Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ Ù„Ø§Ø¹Ø¨ÙŠÙ† Ø¬Ø¯Ø¯ Ù…Ù† Ø¬Ù…ÙŠØ¹ Ø£Ù†Ø­Ø§Ø¡ Ø§Ù„Ø¹Ø§Ù„Ù… Ø¨ÙØ¶Ù„ Ø§Ù„Ø¥Ø¹Ù„Ø§Ù†Ø§Øª Ø§Ù„ØªÙŠ Ù†Ù‚ÙˆÙ… Ø¨ØªØ´ØºÙŠÙ„Ù‡Ø§ Ù„Ù„Ø¹Ø¨ØªÙƒ',
        'de-DE':
          'Sofortige Wirkung: Erhalten Sie neue Spieler aus der ganzen Welt dank der Anzeigen, die wir fÃ¼r Ihr Spiel schalten',
        'es-ES':
          'Impacto inmediato: ObtÃ©n nuevos jugadores de todo el mundo gracias a los anuncios que ejecutamos para tu juego',
        'it-IT':
          'Impatto immediato: Ottieni nuovi giocatori da tutto il mondo grazie agli annunci che eseguiamo per il tuo gioco',
        'ja-JP':
          'å³æ™‚çš„ãªå½±éŸ¿ï¼šç§ãŸã¡ãŒã‚ãªãŸã®ã‚²ãƒ¼ãƒ ã®ãŸã‚ã«å®Ÿæ–½ã™ã‚‹åºƒå‘Šã®ãŠã‹ã’ã§ã€ä¸–ç•Œä¸­ã‹ã‚‰æ–°ã—ã„ãƒ—ãƒ¬ã‚¤ãƒ¤ãƒ¼ã‚’ç²å¾—ã—ã¾ã™ã€‚',
        'ko-KR':
          'ì¦‰ê°ì ì¸ íš¨ê³¼: ê´‘ê³  ë•ë¶„ì— ì „ ì„¸ê³„ì˜ ìƒˆë¡œìš´ í”Œë ˆì´ì–´ë¥¼ ì–»ì„ ìˆ˜ ìžˆìŠµë‹ˆë‹¤',
        'pl-PL':
          'Natychmiastowy efekt: Zyskaj nowych graczy z caÅ‚ego Å›wiata dziÄ™ki reklamom, ktÃ³re prowadzimy dla twojej gry',
        'pt-BR':
          'Impacto imediato: Obtenha novos jogadores de todo o mundo graÃ§as aos anÃºncios que executamos para o seu jogo',
        'ru-RU':
          'ÐÐµÐ¼ÐµÐ´Ð»ÐµÐ½Ð½Ð¾Ðµ Ð²Ð¾Ð·Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ: ÐŸÐ¾Ð»ÑƒÑ‡Ð¸Ñ‚Ðµ Ð½Ð¾Ð²Ñ‹Ñ… Ð¸Ð³Ñ€Ð¾ÐºÐ¾Ð² ÑÐ¾ Ð²ÑÐµÐ³Ð¾ Ð¼Ð¸Ñ€Ð° Ð±Ð»Ð°Ð³Ð¾Ð´Ð°Ñ€Ñ Ñ€ÐµÐºÐ»Ð°Ð¼Ðµ, ÐºÐ¾Ñ‚Ð¾Ñ€ÑƒÑŽ Ð¼Ñ‹ Ñ€Ð°Ð·Ð¼ÐµÑ‰Ð°ÐµÐ¼ Ð´Ð»Ñ Ð²Ð°ÑˆÐµÐ¹ Ð¸Ð³Ñ€Ñ‹',
        'sl-SI':
          'TakojÅ¡nji uÄinek: ZahvaljujoÄ oglasom, ki jih objavljamo za vaÅ¡o igro, pridobite nove igralce z vsega sveta',
        'uk-UA':
          'ÐœÐ¸Ñ‚Ñ‚Ñ”Ð²Ð¸Ð¹ Ð²Ð¿Ð»Ð¸Ð²: ÐžÑ‚Ñ€Ð¸Ð¼Ð°Ð¹Ñ‚Ðµ Ð½Ð¾Ð²Ð¸Ñ… Ð³Ñ€Ð°Ð²Ñ†Ñ–Ð² Ð· ÑƒÑÑŒÐ¾Ð³Ð¾ ÑÐ²Ñ–Ñ‚Ñƒ Ð·Ð°Ð²Ð´ÑÐºÐ¸ Ñ€ÐµÐºÐ»Ð°Ð¼Ñ–, ÑÐºÑƒ Ð¼Ð¸ Ñ€Ð¾Ð·Ð¼Ñ–Ñ‰ÑƒÑ”Ð¼Ð¾ Ð´Ð»Ñ Ð²Ð°ÑˆÐ¾Ñ— Ð³Ñ€Ð¸',
        'zh-CN':
          'ç«‹å³å½±å“ï¼šé€šè¿‡æˆ‘ä»¬ä¸ºæ‚¨çš„æ¸¸æˆè¿è¡Œçš„å¹¿å‘Šï¼Œä»Žä¸–ç•Œå„åœ°èŽ·å¾—æ–°çŽ©å®¶ã€‚',
      },
      {
        en: `Game promoted everywhere on gd.games for 15 days`,
        'fr-FR': `Jeu promu partout sur gd.games pendant 15 jours`,
        'ar-SA': `ØªØ±ÙˆÙŠØ¬ Ø§Ù„Ù„Ø¹Ø¨Ø© ÙÙŠ ÙƒÙ„ Ù…ÙƒØ§Ù† Ø¹Ù„Ù‰ gd.games Ù„Ù…Ø¯Ø© 15 ÙŠÙˆÙ…Ù‹Ø§`,
        'de-DE': `Spiel wird Ã¼berall auf gd.games fÃ¼r 15 Tage`,
        'es-ES': `Juego promocionado en todo gd.games durante 15 dÃ­as`,
        'it-IT': `Gioco promosso ovunque su gd.games per 15 giorni`,
        'ja-JP': `gd.gamesã®ã©ã“ã§ã‚‚15æ—¥é–“ã‚²ãƒ¼ãƒ ã‚’å®£ä¼ã—ã€ç›®æ¨™é”æˆã¾ã§åºƒå‘Šã‚’æŽ²è¼‰ã—ã¾ã™ã€‚`,
        'ko-KR': `gd.gamesì˜ ëª¨ë“  ê³³ì—ì„œ 15 ì¼ ë™ì•ˆ ê²Œìž„ì„ í™ë³´í•˜ê³ , ëª©í‘œ ë‹¬ì„±ê¹Œì§€ ê´‘ê³ ë¥¼ ê²Œìž¬í•©ë‹ˆë‹¤.`,
        'pl-PL': `Gra promowana wszÄ™dzie na gd.games przez 15 dni`,
        'pt-BR': `Jogo promovido em todo o gd.games por 15 dias`,
        'ru-RU': `Ð˜Ð³Ñ€Ð° Ñ€ÐµÐºÐ»Ð°Ð¼Ð¸Ñ€ÑƒÐµÑ‚ÑÑ Ð¿Ð¾Ð²ÑÑŽÐ´Ñƒ Ð½Ð° gd.games Ð² Ñ‚ÐµÑ‡ÐµÐ½Ð¸Ðµ 15 Ð´Ð½ÐµÐ¹`,
        'sl-SI': `Igra je promovirana povsod na gd.games za 15 dni`,
        'uk-UA': `Ð“Ñ€Ð° Ñ€ÐµÐºÐ»Ð°Ð¼ÑƒÑ”Ñ‚ÑŒÑÑ Ð²ÑÑŽÐ´Ð¸ Ð½Ð° gd.games Ð¿Ñ€Ð¾Ñ‚ÑÐ³Ð¾Ð¼ 15 Ð´Ð½Ñ–Ð²`,
        'zh-CN': `åœ¨gd.gamesçš„æ‰€æœ‰åœ°æ–¹æŽ¨å¹¿æ¸¸æˆ15å¤©`,
      },
    ],
    ownedBulletPointsByLocale: [
      {
        en: `Ads are being run for your game until it reaches its boost goal.`,
        'fr-FR': `Des publicitÃ©s sont diffusÃ©es pour votre jeu jusqu'Ã  ce qu'il atteigne son objectif de boost.`,
        'ar-SA': `ØªØªÙ… ØªØ´ØºÙŠÙ„ Ø§Ù„Ø¥Ø¹Ù„Ø§Ù†Ø§Øª Ù„Ù„Ø¹Ø¨ØªÙƒ Ø­ØªÙ‰ ØªØµÙ„ Ø¥Ù„Ù‰ Ù‡Ø¯ÙÙ‡Ø§.`,
        'de-DE': `Anzeigen werden fÃ¼r Ihr Spiel geschaltet, bis es sein Ziel erreicht.`,
        'es-ES': `Se estÃ¡n ejecutando anuncios para tu juego hasta que alcance su objetivo de impulso.`,
        'it-IT': `Gli annunci vengono eseguiti per il tuo gioco fino a quando non raggiunge il suo obiettivo di impulso.`,
        'ja-JP': `ã‚²ãƒ¼ãƒ ãŒç›®æ¨™ã«é”ã™ã‚‹ã¾ã§åºƒå‘ŠãŒå®Ÿæ–½ã•ã‚Œã¾ã™ã€‚`,
        'ko-KR': `ê²Œìž„ì´ ëª©í‘œì— ë„ë‹¬í•  ë•Œê¹Œì§€ ê´‘ê³ ê°€ ê²Œìž¬ë©ë‹ˆë‹¤.`,
        'pl-PL': `Reklamy sÄ… prowadzone dla twojej gry do momentu osiÄ…gniÄ™cia celu promocji.`,
        'pt-BR': `AnÃºncios estÃ£o sendo executados para o seu jogo atÃ© que ele atinja seu objetivo de destaque.`,
        'ru-RU': `Ð ÐµÐºÐ»Ð°Ð¼Ð° Ñ€Ð°Ð·Ð¼ÐµÑ‰Ð°ÐµÑ‚ÑÑ Ð´Ð»Ñ Ð²Ð°ÑˆÐµÐ¹ Ð¸Ð³Ñ€Ñ‹ Ð´Ð¾ Ð´Ð¾ÑÑ‚Ð¸Ð¶ÐµÐ½Ð¸Ñ Ñ†ÐµÐ»Ð¸ Ð¿Ð¾ÑÐ¸Ð»ÐµÐ½Ð¸Ñ.`,
        'sl-SI': `Oglasi se izvajajo za vaÅ¡o igro, dokler ne doseÅ¾e svojega cilja.`,
        'uk-UA': `Ð ÐµÐºÐ»Ð°Ð¼Ð° Ñ€Ð¾Ð·Ð¼Ñ–Ñ‰ÑƒÑ”Ñ‚ÑŒÑÑ Ð´Ð»Ñ Ð²Ð°ÑˆÐ¾Ñ— Ð³Ñ€Ð¸ Ð´Ð¾ Ð´Ð¾ÑÑÐ³Ð½ÐµÐ½Ð½Ñ Ñ†Ñ–Ð»Ñ– Ð¿Ñ–Ð´ÑÐ¸Ð»ÐµÐ½Ð½Ñ.`,
        'zh-CN': `å¹¿å‘Šå°†ä¸€ç›´è¿è¡Œï¼Œç›´åˆ°æ‚¨çš„æ¸¸æˆè¾¾åˆ°å…¶ç›®æ ‡ã€‚`,
      },
      {
        en: `You will receive an email with the results of the featuring.`,
        'fr-FR': `Vous recevrez un e-mail avec les rÃ©sultats de la mise en avant.`,
        'ar-SA': `Ø³ØªØªÙ„Ù‚Ù‰ Ø¨Ø±ÙŠØ¯Ù‹Ø§ Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠÙ‹Ø§ ÙŠØ­ØªÙˆÙŠ Ø¹Ù„Ù‰ Ù†ØªØ§Ø¦Ø¬ Ø§Ù„ØªØ±ÙˆÙŠØ¬.`,
        'de-DE': `Sie erhalten eine E-Mail mit den Ergebnissen der Bewerbung.`,
        'es-ES': `RecibirÃ¡s un correo electrÃ³nico con los resultados de la promociÃ³n.`,
        'it-IT': `Riceverai un'email con i risultati della promozione.`,
        'ja-JP': `ãƒ•ã‚£ãƒ¼ãƒãƒ£ãƒªãƒ³ã‚°ã®çµæžœã‚’è¨˜è¼‰ã—ãŸãƒ¡ãƒ¼ãƒ«ãŒå±Šãã¾ã™ã€‚`,
        'ko-KR': `ì¶”ì²œ ê²°ê³¼ê°€ í¬í•¨ëœ ì´ë©”ì¼ì„ ë°›ê²Œ ë©ë‹ˆë‹¤.`,
        'pl-PL': `Otrzymasz e-mail z wynikami promocji.`,
        'pt-BR': `VocÃª receberÃ¡ um e-mail com os resultados do destaque.`,
        'ru-RU': `Ð’Ñ‹ Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ñ‚Ðµ ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ð¾Ðµ Ð¿Ð¸ÑÑŒÐ¼Ð¾ Ñ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð°Ð¼Ð¸ Ñ€ÐµÐºÐ»Ð°Ð¼Ñ‹.`,
        'sl-SI': `Prejeli boste e-poÅ¡to z rezultati promocije.`,
        'uk-UA': `Ð’Ð¸ Ð¾Ñ‚Ñ€Ð¸Ð¼Ð°Ñ”Ñ‚Ðµ ÐµÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ð¸Ð¹ Ð»Ð¸ÑÑ‚ Ð· Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð°Ð¼Ð¸ Ñ€ÐµÐºÐ»Ð°Ð¼Ð¸.`,
        'zh-CN': `æ‚¨å°†æ”¶åˆ°ä¸€å°åŒ…å«æŽ¨å¹¿ç»“æžœçš„ç”µå­é‚®ä»¶ã€‚`,
      },
    ],
    additionalSuccessMessageByLocale: {
      en:
        'We will get in touch in the next few days to get the campaign up, check your emails!',
      'fr-FR':
        'Nous vous contacterons dans les prochains jours pour lancer la campagne, vÃ©rifiez vos e-mails !',
      'ar-SA':
        'Ø³Ù†ØªØµÙ„ Ø¨Ùƒ Ø®Ù„Ø§Ù„ Ø§Ù„Ø£ÙŠØ§Ù… Ø§Ù„Ù‚Ù„ÙŠÙ„Ø© Ø§Ù„Ù‚Ø§Ø¯Ù…Ø© Ù„ØªØ´ØºÙŠÙ„ Ø§Ù„Ø­Ù…Ù„Ø©ØŒ ØªØ­Ù‚Ù‚ Ù…Ù† Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ!',
      'de-DE':
        'Wir werden uns in den nÃ¤chsten Tagen bei Ihnen melden, um die Kampagne zu starten. ÃœberprÃ¼fen Sie Ihre E-Mails!',
      'es-ES':
        'Nos pondremos en contacto en los prÃ³ximos dÃ­as para poner en marcha la campaÃ±a, Â¡revisa tus correos electrÃ³nicos!',
      'it-IT':
        'Ci metteremo in contatto nei prossimi giorni per avviare la campagna, controlla le tue email!',
      'ja-JP':
        'ã‚­ãƒ£ãƒ³ãƒšãƒ¼ãƒ³ã‚’é–‹å§‹ã™ã‚‹ãŸã‚ã«æ•°æ—¥ä»¥å†…ã«é€£çµ¡ã—ã¾ã™ã®ã§ã€ãƒ¡ãƒ¼ãƒ«ã‚’ã”ç¢ºèªãã ã•ã„ï¼',
      'ko-KR':
        'ë‹¤ìŒ ëª‡ ì¼ ì•ˆì— ìº íŽ˜ì¸ì„ ì‹œìž‘í•˜ê¸° ìœ„í•´ ì—°ë½ ë“œë¦¬ê² ìŠµë‹ˆë‹¤. ì´ë©”ì¼ì„ í™•ì¸í•˜ì„¸ìš”!',
      'pl-PL':
        'Skontaktujemy siÄ™ w ciÄ…gu najbliÅ¼szych dni, aby uruchomiÄ‡ kampaniÄ™, sprawdÅº swoje e-maile!',
      'pt-BR':
        'Entraremos em contato nos prÃ³ximos dias para iniciar a campanha, verifique seus e-mails!',
      'ru-RU':
        'ÐœÑ‹ ÑÐ²ÑÐ¶ÐµÐ¼ÑÑ Ñ Ð²Ð°Ð¼Ð¸ Ð² Ð±Ð»Ð¸Ð¶Ð°Ð¹ÑˆÐ¸Ðµ Ð´Ð½Ð¸, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð·Ð°Ð¿ÑƒÑÑ‚Ð¸Ñ‚ÑŒ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸ÑŽ, Ð¿Ñ€Ð¾Ð²ÐµÑ€ÑŒÑ‚Ðµ ÑÐ²Ð¾ÑŽ ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½ÑƒÑŽ Ð¿Ð¾Ñ‡Ñ‚Ñƒ!',
      'sl-SI':
        'V naslednjih dneh se bomo obrnili, da zaÄnemo kampanjo, preverite svoje e-poÅ¡tne predale!',
      'uk-UA':
        'ÐœÐ¸ Ð·Ð²â€™ÑÐ¶ÐµÐ¼Ð¾ÑÑ Ð² Ð½Ð°Ð¹Ð±Ð»Ð¸Ð¶Ñ‡Ñ– Ð´Ð½Ñ–, Ñ‰Ð¾Ð± Ð·Ð°Ð¿ÑƒÑÑ‚Ð¸Ñ‚Ð¸ ÐºÐ°Ð¼Ð¿Ð°Ð½Ñ–ÑŽ, Ð¿ÐµÑ€ÐµÐ²Ñ–Ñ€Ñ‚Ðµ ÑÐ²Ð¾ÑŽ ÐµÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ñƒ Ð¿Ð¾ÑˆÑ‚Ñƒ!',
      'zh-CN':
        'æˆ‘ä»¬å°†åœ¨æœªæ¥å‡ å¤©å†…ä¸Žæ‚¨è”ç³»ï¼Œä»¥å¯åŠ¨å¹¿å‘Šæ´»åŠ¨ï¼Œè¯·æŸ¥çœ‹æ‚¨çš„ç”µå­é‚®ä»¶ï¼',
    },
    showExpirationDate: false,
  },
];

const MarketingPlansStory = ({
  gameFeaturings,
  delayResponse,
  errorCode,
  errorMessage,
  incompleteGame,
}: {|
  gameFeaturings: GameFeaturing[],
  delayResponse?: number,
  errorCode?: number,
  errorMessage?: string,
  incompleteGame?: boolean,
|}) => {
  const gameServiceMock = new MockAdapter(gameApiAxiosClient, {
    delayResponse,
  });
  gameServiceMock
    .onGet('/game-featuring')
    .reply(errorCode || 200, errorCode ? errorMessage || null : gameFeaturings)
    .onGet('/marketing-plan')
    .reply(200, marketingPlans)
    .onAny()
    .reply(config => {
      console.error(`Unexpected call to ${config.url} (${config.method})`);
      return [504, null];
    });

  return (
    <AuthenticatedUserContext.Provider
      value={fakeAuthenticatedUserWithNoSubscriptionAndCredits}
    >
      <MarketingPlansStoreStateProvider>
        <MarketingPlans game={incompleteGame ? game2 : fakeGame} />
      </MarketingPlansStoreStateProvider>
    </AuthenticatedUserContext.Provider>
  );
};

export const LoadingAndError = (): React.Node => {
  return (
    <MarketingPlansStory
      gameFeaturings={[]}
      delayResponse={1000}
      errorCode={500}
      errorMessage="Internal server error"
    />
  );
};

export const Default = (): React.Node => {
  return <MarketingPlansStory gameFeaturings={[]} delayResponse={1000} />;
};

export const WithOwnedActiveBasicPlanIncompleteGame = (): React.Node => {
  return (
    <MarketingPlansStory
      gameFeaturings={[
        {
          gameId: 'complete-game-id',
          featuring: 'games-platform-home',
          createdAt: nowMinusOneDay / 1000,
          updatedAt: nowMinusOneDay / 1000,
          expiresAt: nowPlusOneDay / 1000,
        },
      ]}
      incompleteGame
    />
  );
};

export const WithOwnedActiveBasicPlanFullGame = (): React.Node => {
  return (
    <MarketingPlansStory
      gameFeaturings={[
        {
          gameId: 'complete-game-id',
          featuring: 'games-platform-home',
          createdAt: nowMinusOneDay / 1000,
          updatedAt: nowMinusOneDay / 1000,
          expiresAt: nowPlusOneDay / 1000,
        },
      ]}
    />
  );
};

export const WithOwnedExpiredBasicPlan = (): React.Node => {
  return (
    <MarketingPlansStory
      gameFeaturings={[
        {
          gameId: 'complete-game-id',
          featuring: 'games-platform-home',
          createdAt: nowMinusOneDay / 1000,
          updatedAt: nowMinusOneDay / 1000,
          expiresAt: nowMinusOneDay / 1000,
        },
      ]}
    />
  );
};

export const WithOwnedProPlan = (): React.Node => {
  return (
    <MarketingPlansStory
      gameFeaturings={[
        {
          gameId: 'complete-game-id',
          featuring: 'games-platform-game-page',
          createdAt: nowMinusOneDay / 1000,
          updatedAt: nowMinusOneDay / 1000,
          expiresAt: nowPlusOneDay / 1000,
        },
        {
          gameId: 'complete-game-id',
          featuring: 'games-platform-home',
          createdAt: nowMinusOneDay / 1000,
          updatedAt: nowMinusOneDay / 1000,
          expiresAt: nowPlusOneDay / 1000,
        },
        {
          gameId: 'complete-game-id',
          featuring: 'games-platform-listing',
          createdAt: nowMinusOneDay / 1000,
          updatedAt: nowMinusOneDay / 1000,
          expiresAt: nowPlusOneDay / 1000,
        },
        {
          gameId: 'complete-game-id',
          featuring: 'games-platform-guaranteed-sessions',
          createdAt: nowMinusOneDay / 1000,
          updatedAt: nowMinusOneDay / 1000,
          expiresAt: nowPlusOneDay / 1000,
        },
      ]}
    />
  );
};

export const WithOwnedPremiumPlan = (): React.Node => {
  return (
    <MarketingPlansStory
      gameFeaturings={[
        {
          gameId: 'complete-game-id',
          featuring: 'games-platform-game-page',
          createdAt: nowMinusOneDay / 1000,
          updatedAt: nowMinusOneDay / 1000,
          expiresAt: nowPlusOneDay / 1000,
        },
        {
          gameId: 'complete-game-id',
          featuring: 'games-platform-home',
          createdAt: nowMinusOneDay / 1000,
          updatedAt: nowMinusOneDay / 1000,
          expiresAt: nowPlusOneDay / 1000,
        },
        {
          gameId: 'complete-game-id',
          featuring: 'games-platform-listing',
          createdAt: nowMinusOneDay / 1000,
          updatedAt: nowMinusOneDay / 1000,
          expiresAt: nowPlusOneDay / 1000,
        },
        {
          gameId: 'complete-game-id',
          featuring: 'games-platform-guaranteed-sessions',
          createdAt: nowMinusOneDay / 1000,
          updatedAt: nowMinusOneDay / 1000,
          expiresAt: nowPlusOneDay / 1000,
        },
      ]}
    />
  );
};
