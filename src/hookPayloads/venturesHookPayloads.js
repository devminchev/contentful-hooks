import { VENTURES_INDEX_WRITE_ALIAS } from "./common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from './common/shared.js';
import { pickHookTopic, createHookName } from '../utils.js';
import { WEBHOOK_SUFFIXES } from '../constants/webhookTextParts.js';

const CONTENTFUL_VENTURES_MODEL_NAME = 'venture';

export const VENTURES_HOOK_CUSTOM_PAYLOAD = {
    id: "{/payload/sys/id}",
    contentType: "{/payload/sys/contentType/sys/id}",
    entryTitle: "{/payload/fields/entryTitle}",
    name: "{/payload/fields/name}",
    jurisdiction: "{/payload/fields/jurisdiction}",
    cmsEnv: "{/payload/sys/environment/sys/id}",
    updatedAt: "{/payload/sys/updatedAt}"
};
export const createVenturesHookUrl = (osHost, nodeEnv='dev') => {
    const retryRefresh = setConflictRefreshBehaviour(nodeEnv);

    return `${osHost}${VENTURES_INDEX_WRITE_ALIAS}/_doc/{/payload/sys/id}?${retryRefresh}`;
}

export const createVenturesHookName = (nodeEnv, version) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.ventures, version);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        equals: [
            {doc: "sys.contentType.sys.id"},
            CONTENTFUL_VENTURES_MODEL_NAME
        ]
    }
]);

export const venturesHookBodyParams = (nodeEnv, host, contentfulEnv, version = 'v2') => ({
    hookName: createVenturesHookName(nodeEnv, version), 
    hookUrl: createVenturesHookUrl(host, nodeEnv), 
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv), 
    active: true,
    payload: VENTURES_HOOK_CUSTOM_PAYLOAD
});
