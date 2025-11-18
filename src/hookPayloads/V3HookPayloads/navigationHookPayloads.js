import { NAVIGATION_INDEX_WRITE_ALIAS } from "../common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from '../common/shared.js';
import { pickHookTopic, createHookName } from '../../utils.js';
import { WEBHOOK_SUFFIXES } from '../../constants/webhookTextParts.js';

const CONTENTFUL_NAVIGATION_MODEL_REGEX = '^(igNavigation|igLink|igQuickLinks)$';

export const NAVIGATION_HOOK_CUSTOM_PAYLOAD = {
    id: "{/payload/sys/id}",
    contentType: "{/payload/sys/contentType/sys/id}",
    entryTitle: "{/payload/fields/entryTitle}",
    layoutType: "{/payload/fields/layoutType}",
    links: "{/payload/fields/links}",
    bottomNavLinks: "{/payload/fields/bottomNavLinks}",
    label: "{/payload/fields/label}",
    view: "{/payload/fields/view}",
    externalUrl: "{/payload/fields/externalUrl}",
    internalUrl: "{/payload/fields/internalUrl}",
    image: "{/payload/fields/image}",
    bynderImage: "{/payload/fields/bynderImage}",
    subMenu: "{/payload/fields/subMenu}",
    platformVisibility: "{/payload/fields/platformVisibility}",
    sessionVisibility: "{/payload/fields/sessionVisibility}",
    environmentVisibility: "{/payload/fields/environmentVisibility}",
    venture: "{/payload/fields/venture}",
    liveHidden: "{/payload/fields/liveHidden}",
    classification: "{/payload/fields/classification}",
    cmsEnv: "{/payload/sys/environment/sys/id}",
    updatedAt: "{/payload/sys/updatedAt}",
    
};
export const createNavigationHookUrl = (osHost, nodeEnv = 'dev') => {
    const retryRefresh = setConflictRefreshBehaviour(nodeEnv);

    return `${osHost}${NAVIGATION_INDEX_WRITE_ALIAS}/_doc/{/payload/sys/id}?${retryRefresh}`;
}

export const createNavigationHookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.navigation);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        regexp: [
            { doc: "sys.contentType.sys.id" },
            { pattern: CONTENTFUL_NAVIGATION_MODEL_REGEX }

        ]
    }
]);

export const navigationHookBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createNavigationHookName(nodeEnv),
    hookUrl: createNavigationHookUrl(host, nodeEnv),
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv),
    active: true,
    payload: NAVIGATION_HOOK_CUSTOM_PAYLOAD
});
