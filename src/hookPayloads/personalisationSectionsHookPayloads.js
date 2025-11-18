import { PERSONALISED_SECTIONS_WRITE_ALIAS } from "./common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from './common/shared.js';
import { PERSONALISED_SECTION_COLLAB_MODEL, PERSONALISED_SECTION_SIMILARITY_MODEL} from './common/contentfulModels.js';
import { pickHookTopic, createHookName } from '../utils.js';
import { WEBHOOK_SUFFIXES } from '../constants/webhookTextParts.js';

const CONTENTFUL_PERSONALISED_SECTIONS_MODEL_REGEXP = `^(${PERSONALISED_SECTION_COLLAB_MODEL}|${PERSONALISED_SECTION_SIMILARITY_MODEL})$`;

export const PERSONALISED_SECTIONS_HOOK_CUSTOM_PAYLOAD = {
    id: "{/payload/sys/id}",
    contentType: "{/payload/sys/contentType/sys/id}",
    entryTitle: "{/payload/fields/entryTitle}",
    venture: "{/payload/fields/venture}",
    platform: "{/payload/fields/platform}",
    type: "{/payload/fields/type}",
    games: "{/payload/fields/games}",
    name: "{/payload/fields/name}",
    title: "{/payload/fields/title}",
    tileSize: "{/payload/fields/tileSize}",
    show: "{/payload/fields/show}",
    environment: "{/payload/fields/environment/en-GB}",
    cmsEnv: "{/payload/sys/environment/sys/id}",
    updatedAt: "{/payload/sys/updatedAt}",
    priorityOverride: "{/payload/fields/priorityOverride}",
};
export const createPersonalisedSectionsHookUrl = (osHost, nodeEnv = 'dev') => {
    const retryRefresh = setConflictRefreshBehaviour(nodeEnv);

    return `${osHost}${PERSONALISED_SECTIONS_WRITE_ALIAS}/_doc/{/payload/sys/id}?${retryRefresh}`;
}

export const createPersonalsiedSectionsHookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.personalisedSections);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        regexp: [
            {doc: "sys.contentType.sys.id"},
            {pattern: CONTENTFUL_PERSONALISED_SECTIONS_MODEL_REGEXP}
        ]
    }
]);

export const personalisedSectionsHookBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createPersonalsiedSectionsHookName(nodeEnv), 
    hookUrl: createPersonalisedSectionsHookUrl(host, nodeEnv), 
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv), 
    active: true,
    payload: PERSONALISED_SECTIONS_HOOK_CUSTOM_PAYLOAD
});
