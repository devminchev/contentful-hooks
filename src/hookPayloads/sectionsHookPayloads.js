import { SECTIONS_INDEX_WRITE_ALIAS } from "./common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from './common/shared.js';
import { pickHookTopic, createHookName } from '../utils.js';
import { WEBHOOK_SUFFIXES } from '../constants/webhookTextParts.js';

const CONTENTFUL_SECTIONS_MODEL_REGEXP = '^(section|legendaryJackpotsSection|gamesFeatureSection)$';

export const SECTIONS_HOOK_CUSTOM_PAYLOAD = {
    id: "{/payload/sys/id}",
    contentType: "{/payload/sys/contentType/sys/id}",
    entryTitle: "{/payload/fields/entryTitle}",
    games: "{/payload/fields/games}",
    name: "{/payload/fields/name}",
    type: "{/payload/fields/type}",
    show: "{/payload/fields/show}",
    className: "{/payload/fields/className}",
    carousel: "{/payload/fields/carousel}",
    header: "{/payload/fields/header}",
    title: "{/payload/fields/title}",
    href: "{/payload/fields/href}",
    videoUrl: "{/payload/fields/videoUrl}",
    image: "{/payload/fields/image}",
    highlightColor: "{/payload/fields/highlightColor}",
    sizes: "{/payload/fields/sizes}",
    slides: "{/payload/fields/slides}",
    style: "{/payload/fields/style}",
    tileSize: "{/payload/fields/tileSize}",
    cmsEnv: "{/payload/sys/environment/sys/id}",
    provider: "{/payload/fields/provider}",
    updatedAt: "{/payload/sys/updatedAt}",
    priorityOverride: "{/payload/fields/priorityOverride}"
};
export const createSectionsHookUrl = (osHost, nodeEnv='dev') => {
    const retryRefresh = setConflictRefreshBehaviour(nodeEnv);

    return `${osHost}${SECTIONS_INDEX_WRITE_ALIAS}/_doc/{/payload/sys/id}?${retryRefresh}`;
}

export const createSectionsHookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.sections);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        regexp: [
            {doc: "sys.contentType.sys.id"},
            {pattern: CONTENTFUL_SECTIONS_MODEL_REGEXP}
        ]
    }
]);

export const sectionsHookBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createSectionsHookName(nodeEnv), 
    hookUrl: createSectionsHookUrl(host, nodeEnv), 
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv), 
    active: true,
    payload: SECTIONS_HOOK_CUSTOM_PAYLOAD
});
