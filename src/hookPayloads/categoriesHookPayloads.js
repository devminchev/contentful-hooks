import { CATEGORIES_INDEX_WRITE_ALIAS } from "./common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from './common/shared.js';
import { pickHookTopic, createHookName } from '../utils.js';
import { WEBHOOK_SUFFIXES } from '../constants/webhookTextParts.js';

const CONTENTFUL_CATEGORIES_MODEL_REGEX = '^(categories|category)$';

export const CATEGORIES_HOOK_CUSTOM_PAYLOAD = {
    id: "{/payload/sys/id}",
    contentType: "{/payload/sys/contentType/sys/id}",
    entryTitle: "{/payload/fields/entryTitle}",
    categories: "{/payload/fields/categories}",
    venture: "{/payload/fields/venture}",
    partner: "{/payload/fields/partner}",
    native: "{/payload/fields/native}",
    title: "{/payload/fields/title}",
    name: "{/payload/fields/name}",
    slug: "{/payload/fields/slug}",
    nameId: "{/payload/fields/id}",
    url: "{/payload/fields/url}",
    backgroundColor: "{/payload/fields/backgroundColor}",
    backgroundImgUrl: "{/payload/fields/backgroundImgUrl}",
    icons: "{/payload/fields/icons}",
    cmsEnv: "{/payload/sys/environment/sys/id}",
    environment: "{/payload/fields/environment/en-GB}",
    createdAt: "{/payload/sys/createdAt}",
    updatedAt: "{/payload/sys/updatedAt}"
};
export const createCategoriesHookUrl = (osHost, nodeEnv = 'dev') => {
    const retryRefresh = setConflictRefreshBehaviour(nodeEnv);

    return `${osHost}${CATEGORIES_INDEX_WRITE_ALIAS}/_doc/{/payload/sys/id}?${retryRefresh}`;
}

export const createCategoriesHookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.categories);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        regexp: [
            {doc: "sys.contentType.sys.id"},
            {pattern: CONTENTFUL_CATEGORIES_MODEL_REGEX}
            
        ]
    }
]);

export const categoriesHookBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createCategoriesHookName(nodeEnv), 
    hookUrl: createCategoriesHookUrl(host, nodeEnv), 
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv), 
    active: true,
    payload: CATEGORIES_HOOK_CUSTOM_PAYLOAD
});
