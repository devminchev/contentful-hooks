import { LAYOUTS_INDEX_WRITE_ALIAS } from "./common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from './common/shared.js';
import { pickHookTopic, createHookName } from '../utils.js';
import { WEBHOOK_SUFFIXES } from '../constants/webhookTextParts.js';

const CONTENTFUL_LAYOUTS_MODEL_REGEXP = '^(layout|miniGames)$';

export const LAYOUTS_HOOK_CUSTOM_PAYLOAD = {
    id: "{/payload/sys/id}",
    contentType: "{/payload/sys/contentType/sys/id}",
    entryTitle: "{/payload/fields/entryTitle}",
    sections: "{/payload/fields/sections}",
    venture: "{/payload/fields/venture}",
    partner: "{/payload/fields/partner}",
    platform: "{/payload/fields/platform}",
    name: "{/payload/fields/name}",
    cmsEnv: "{/payload/sys/environment/sys/id}",
    environment: "{/payload/fields/environment/en-GB}",
    updatedAt: "{/payload/sys/updatedAt}"
};
export const createLayoutsHookUrl = (osHost, nodeEnv='dev') => {

    const retryRefresh = setConflictRefreshBehaviour(nodeEnv);

    return `${osHost}${LAYOUTS_INDEX_WRITE_ALIAS}/_doc/{/payload/sys/id}?${retryRefresh}`;
}

export const createLayoutsHookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.layouts);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        regexp: [
            {doc: "sys.contentType.sys.id"},
            {pattern: CONTENTFUL_LAYOUTS_MODEL_REGEXP}
        ]
    }
]);

export const layoutsHookBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createLayoutsHookName(nodeEnv), 
    hookUrl: createLayoutsHookUrl(host, nodeEnv), 
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv), 
    active: true,
    payload: LAYOUTS_HOOK_CUSTOM_PAYLOAD
});
