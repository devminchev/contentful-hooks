import { ML_PERSONALISED_SECTIONS_WRITE_ALIAS } from "../common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from '../common/shared.js';
import { pickHookTopic, createHookName } from '../../utils.js';
import { WEBHOOK_SUFFIXES } from '../../constants/webhookTextParts.js';
import { ML_SECTION_COLLAB_MODEL, ML_SECTION_SIMILARITY_MODEL} from '../common/contentfulModels.js';


const CONTENTFUL_ML_SECTIONS_MODEL_REGEX = `^(${ML_SECTION_COLLAB_MODEL}|${ML_SECTION_SIMILARITY_MODEL})$`;

export const ML_SECTIONS_HOOK_CUSTOM_PAYLOAD = {
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
    slug: "{/payload/fields/slug}",
    games: "{/payload/fields/games}",
    layoutType: "{/payload/fields/layoutType}",
    type: "{/payload/fields/type}",
    layoutType: "{/payload/fields/layoutType}",
    layoutType: "{/payload/fields/layoutType}",
    viewAllActionText: "{/payload/fields/viewAllActionText}",
    viewAllType: "{/payload/fields/viewAllType}",
    viewAllAction: "{/payload/fields/viewAllAction}",
    expandedSectionLayoutType: "{/payload/fields/expandedSectionLayoutType}",
    
};
export const createMlSectionsHookUrl = (osHost, nodeEnv = 'dev') => {
    const retryRefresh = setConflictRefreshBehaviour(nodeEnv);

    return `${osHost}${ML_PERSONALISED_SECTIONS_WRITE_ALIAS}/_doc/{/payload/sys/id}?${retryRefresh}`;
}

export const createMlSectionsHookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.mlSections);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        regexp: [
            { doc: "sys.contentType.sys.id" },
            { pattern: CONTENTFUL_ML_SECTIONS_MODEL_REGEX }

        ]
    }
]);

export const mlSectionsBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createMlSectionsHookName(nodeEnv),
    hookUrl: createMlSectionsHookUrl(host, nodeEnv),
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv),
    active: true,
    payload: ML_SECTIONS_HOOK_CUSTOM_PAYLOAD
});
