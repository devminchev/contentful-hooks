import { MARKETING_SECTIONS_WRITE_ALIAS } from "../common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from '../common/shared.js';
import { pickHookTopic, createHookName } from '../../utils.js';
import { WEBHOOK_SUFFIXES } from '../../constants/webhookTextParts.js';

const CONTENTFUL_MARKETING_SECTIONS_MODEL_REGEX = '^(igMarketingSection|igBanner|igBrazePromosSection|igPromotionsGrid|igContentPlaceholder)$';

export const MARKETING_SECTIONS_HOOK_CUSTOM_PAYLOAD = {
    id: "{/payload/sys/id}",
    contentType: "{/payload/sys/contentType/sys/id}",
    entryTitle: "{/payload/fields/entryTitle}",
    platformVisibility: "{/payload/fields/platformVisibility}",
    sessionVisibility: "{/payload/fields/sessionVisibility}",
    environmentVisibility: "{/payload/fields/environmentVisibility}",
    cmsEnv: "{/payload/sys/environment/sys/id}",
    updatedAt: "{/payload/sys/updatedAt}",
    venture: "{/payload/fields/venture}",
    title: "{/payload/fields/title}",
    classification: "{/payload/fields/classification}",
    layoutType: "{/payload/fields/layoutType}",
    viewAllActionText: "{/payload/fields/viewAllActionText}",
    viewAllType: "{/payload/fields/viewAllType}",
    viewAllAction: "{/payload/fields/viewAllAction}",
    banners: "{/payload/fields/banners}",
    bynderMedia: "{/payload/fields/bynderMedia}",
    imageUrl: "{/payload/fields/imageUrl}",
    videoUrl: "{/payload/fields/videoUrl}",
    representativeColor: "{/payload/fields/representativeColor}",
    bannerLink: "{/payload/fields/bannerLink}",
    displayType: "{/payload/fields/displayType}",
    displaySize: "{/payload/fields/displaySize}",
    placeholderType: "{/payload/fields/placeholderType}"

};
export const createMarketingSectionsHookUrl = (osHost, nodeEnv = 'dev') => {
    const retryRefresh = setConflictRefreshBehaviour(nodeEnv);

    return `${osHost}${MARKETING_SECTIONS_WRITE_ALIAS}/_doc/{/payload/sys/id}?${retryRefresh}`;
}

export const createMarketingSectionsHookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.marketingSections);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        regexp: [
            { doc: "sys.contentType.sys.id" },
            { pattern: CONTENTFUL_MARKETING_SECTIONS_MODEL_REGEX }

        ]
    }
]);

export const marketingSectionsHookBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createMarketingSectionsHookName(nodeEnv),
    hookUrl: createMarketingSectionsHookUrl(host, nodeEnv),
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv),
    active: true,
    payload: MARKETING_SECTIONS_HOOK_CUSTOM_PAYLOAD
});
