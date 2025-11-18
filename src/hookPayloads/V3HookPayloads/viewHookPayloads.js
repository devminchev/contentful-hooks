import { VIEW_INDEX_WRITE_ALIAS } from "../common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from '../common/shared.js';
import { pickHookTopic, createHookName } from '../../utils.js';
import { WEBHOOK_SUFFIXES } from '../../constants/webhookTextParts.js';

const CONTENTFUL_VIEW_MODEL_REGEX = '^(igView|igMiniGames)$';

export const VIEW_HOOK_CUSTOM_PAYLOAD = {
    id: "{/payload/sys/id}",
    contentType: "{/payload/sys/contentType/sys/id}",
    entryTitle: "{/payload/fields/entryTitle}",
    name: "{/payload/fields/name}",
    viewSlug: "{/payload/fields/viewSlug}",
    platformVisibility: "{/payload/fields/platformVisibility}",
    sessionVisibility: "{/payload/fields/sessionVisibility}",
    environmentVisibility: "{/payload/fields/environmentVisibility}",
    venture: "{/payload/fields/venture}",
    sections: "{/payload/fields/sections}",
    topContent: "{/payload/fields/topContent}",
    primaryContent: "{/payload/fields/primaryContent}",
    liveHidden: "{/payload/fields/liveHidden}",
    classification: "{/payload/fields/classification}",
    cmsEnv: "{/payload/sys/environment/sys/id}",
    updatedAt: "{/payload/sys/updatedAt}",
    
};
export const createViewHookUrl = (osHost, nodeEnv = 'dev') => {
    const retryRefresh = setConflictRefreshBehaviour(nodeEnv);

    return `${osHost}${VIEW_INDEX_WRITE_ALIAS}/_doc/{/payload/sys/id}?${retryRefresh}`;
}

export const createViewHookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.view);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        regexp: [
            { doc: "sys.contentType.sys.id" },
            { pattern: CONTENTFUL_VIEW_MODEL_REGEX }

        ]
    }
]);

export const viewHookBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createViewHookName(nodeEnv),
    hookUrl: createViewHookUrl(host, nodeEnv),
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv),
    active: true,
    payload: VIEW_HOOK_CUSTOM_PAYLOAD
});
