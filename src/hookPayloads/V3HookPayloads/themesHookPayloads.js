import { THEME_INDEX_WRITE_ALIAS } from "../common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from '../common/shared.js';
import { pickHookTopic, createHookName } from '../../utils.js';
import { WEBHOOK_SUFFIXES } from '../../constants/webhookTextParts.js';
import { IG_THEME } from '../common/contentfulModels.js';

const CONTENTFUL_THEME_MODEL_REGEX = `^(${IG_THEME})$`;

export const THEME_HOOK_CUSTOM_PAYLOAD = {
    id: "{/payload/sys/id}",
    contentType: "{/payload/sys/contentType/sys/id}",
    entryTitle: "{/payload/fields/entryTitle}",
    image: "{/payload/fields/image}",
    primaryColor: "{/payload/fields/primaryColor}",
    secondaryColor: "{/payload/fields/secondaryColor}",
    venture: "{/payload/fields/venture}",
    cmsEnv: "{/payload/sys/environment/sys/id}",
    updatedAt: "{/payload/sys/updatedAt}",  
    
};
export const createThemeHookUrl = (osHost, nodeEnv = 'dev') => {
    const retryRefresh = setConflictRefreshBehaviour(nodeEnv);

    return `${osHost}${THEME_INDEX_WRITE_ALIAS}/_doc/{/payload/sys/id}?${retryRefresh}`;
}

export const createThemeHookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.themes);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        regexp: [
            { doc: "sys.contentType.sys.id" },
            { pattern: CONTENTFUL_THEME_MODEL_REGEX }

        ]
    }
]);

export const themesHookBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createThemeHookName(nodeEnv),
    hookUrl: createThemeHookUrl(host, nodeEnv),
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv),
    active: true,
    payload: THEME_HOOK_CUSTOM_PAYLOAD
});
