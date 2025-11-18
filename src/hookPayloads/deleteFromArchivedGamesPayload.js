import { ARCHIVED_GAMES_READ_ALIAS } from "./common/osIndexes.js";
import { sharedEnvFilter } from './common/shared.js';
import { pickHookTopicForArchivedGames, createHookName } from '../utils.js';
import { WEBHOOK_SUFFIXES } from '../constants/webhookTextParts.js';
import {
  SITE_GAME_V2_MODEL,
  GAME_V2_MODEL
} from './common/contentfulModels.js';


const CONTENTFUL_DELETE_MODELS_REGEXP = `^(${SITE_GAME_V2_MODEL}|${GAME_V2_MODEL})$`;

export const GENERAL_DELETE_HOOK_CUSTOM_PAYLOAD = {
  query: {
      match: {
        _id: "{/payload/sys/id}"
      }
  }
};

export const createArchivedGamesDeleteHookUrl = (osHost) => (`${osHost}${ARCHIVED_GAMES_READ_ALIAS}/_delete_by_query?refresh=true`);

export const createArchivedGamesDeleteHookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.archivedGamesDelete);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        regexp: [
            {doc: "sys.contentType.sys.id"},
            {pattern: CONTENTFUL_DELETE_MODELS_REGEXP}         
        ]
    }
]);

export const deleteArchivedGamesHookBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createArchivedGamesDeleteHookName(nodeEnv), 
    hookUrl: createArchivedGamesDeleteHookUrl(host), 
    ...pickHookTopicForArchivedGames(nodeEnv, 'archive-remove'),
    filters: createFilters(contentfulEnv), 
    active: true,
    payload: GENERAL_DELETE_HOOK_CUSTOM_PAYLOAD
});

