import { INDEXES_ALIASES, IG_SHARED_READ_ALIAS } from "./common/osIndexes.js";
import { sharedEnvFilter } from './common/shared.js';
import { pickHookTopic, createHookName } from '../utils.js';
import { WEBHOOK_SUFFIXES } from '../constants/webhookTextParts.js';
import {
  GAMES_FEATURE_SECTION_MODEL,
  LAYOUT_MODEL,
  MINI_GAMES_MODEL,
  CATEGORIES_MODEL,
  CATEGORY_MODEL,
  VENTURE_MODEL,
  LOCALISATION_MODEL,
  FOOTER_MODEL,
  FOOTER_ICON_MODEL,
  FOOTER_LINK_MODEL,
  POLICY_MODEL,
  SITE_GAME_V2_MODEL,
  LEGENDARY_JACKPOT_MODEL,
  SECTION_MODEL,
  PERSONALISED_SECTION_COLLAB_MODEL,
  PERSONALISED_SECTION_SIMILARITY_MODEL,
  SUGGESTED_GAMES_MODEL,
  IG_NAVIGATION,
  IG_LINK,
  IG_QUICK_LINK,
  IG_THEME,
  IG_VIEW,
  IG_MINI_GAMES,
  IG_GRID_A,
  IG_GRID_B,
  IG_GRID_C,
  IG_GRID_D,
  IG_GRID_E,
  IG_GRID_F,
  IG_GRID_G,
  IG_CAROUSEL_A,
  IG_CAROUSEL_B,
  IG_JACKPOT_SECTION,
  IG_JACKPOT_BLOCK,
  IG_SEARCH_PLACEHOLDER,
  IG_DFG,
  ML_SECTION_COLLAB_MODEL,
  ML_SECTION_SIMILARITY_MODEL,
  ML_DEFAULTS_MODEL,
  IG_PROMOTIONS_GRID,
  IG_GAME_SHUFFLE
} from './common/contentfulModels.js';


const CONTENTFUL_DELETE_MODELS_REGEXP = `^(${SITE_GAME_V2_MODEL}|${SECTION_MODEL}|${PERSONALISED_SECTION_COLLAB_MODEL}|${PERSONALISED_SECTION_SIMILARITY_MODEL}|${SUGGESTED_GAMES_MODEL}|${LEGENDARY_JACKPOT_MODEL}|${GAMES_FEATURE_SECTION_MODEL}|${LAYOUT_MODEL}|${MINI_GAMES_MODEL}|${CATEGORIES_MODEL}|${CATEGORY_MODEL}|${VENTURE_MODEL}|${LOCALISATION_MODEL}|${FOOTER_MODEL}|${FOOTER_ICON_MODEL}|${FOOTER_LINK_MODEL}|${POLICY_MODEL})$`;
// '^(siteGameV2|section|legendaryJackpotsSection|gamesFeatureSection|layout|miniGames|categories|category|venture|localisation|footer|footerIcon|footerLink|policy)$';

const CONTENTFUL_V3_DELETE_MODELS_REGEXP = `^(${SITE_GAME_V2_MODEL}|${IG_NAVIGATION}|${IG_LINK}|${IG_QUICK_LINK}|${IG_THEME}|${IG_VIEW}|${IG_MINI_GAMES}|${IG_GRID_A}|${IG_GRID_B}|${IG_GRID_C}|${IG_GRID_D}|${IG_GRID_E}|${IG_GRID_F}|${IG_GRID_G}|${IG_CAROUSEL_A}|${IG_CAROUSEL_B}|${IG_JACKPOT_SECTION}|${IG_JACKPOT_BLOCK}|${IG_SEARCH_PLACEHOLDER}|${IG_DFG}|${ML_SECTION_COLLAB_MODEL}|${ML_SECTION_SIMILARITY_MODEL}|${ML_DEFAULTS_MODEL}|${IG_PROMOTIONS_GRID}|${IG_GAME_SHUFFLE})$`;

export const GENERAL_DELETE_HOOK_CUSTOM_PAYLOAD = {
  query: {
    match: {
      _id: "{/payload/sys/id}"
    }
  }
};

export const createGeneralDeleteHookUrl = (osHost, version) => {
  const osIndex = version === 'v3' ? IG_SHARED_READ_ALIAS : INDEXES_ALIASES;

  return `${osHost}${osIndex}/_delete_by_query?refresh=true`;
};

export const createGeneralDeleteHookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.generalDelete);

export const createFilters = (contentfulEnv, version) => {
  const modelPattern = version === 'v3' ? CONTENTFUL_V3_DELETE_MODELS_REGEXP : CONTENTFUL_DELETE_MODELS_REGEXP;
  return ([
    sharedEnvFilter(contentfulEnv),
    {
      regexp: [
        { doc: "sys.contentType.sys.id" },
        { pattern: modelPattern }
      ]
    }
  ])
};

export const deleteGeneralHookBodyParams = (nodeEnv, host, contentfulEnv, version = 'v2') => ({
  hookName: createGeneralDeleteHookName(nodeEnv),
  hookUrl: createGeneralDeleteHookUrl(host, version),
  ...pickHookTopic(nodeEnv, 'delete'),
  filters: createFilters(contentfulEnv, version),
  active: true,
  payload: GENERAL_DELETE_HOOK_CUSTOM_PAYLOAD
});

