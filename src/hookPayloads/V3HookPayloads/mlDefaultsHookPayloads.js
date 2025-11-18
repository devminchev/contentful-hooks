import { ML_PERSONALISED_DEFAULTS_WRITE_ALIAS } from "../common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from '../common/shared.js';
import { pickHookTopic, createHookName } from '../../utils.js';
import { WEBHOOK_SUFFIXES } from '../../constants/webhookTextParts.js';
import { ML_DEFAULTS_MODEL} from '../common/contentfulModels.js';


const CONTENTFUL_ML_DEFAULTS_MODEL_REGEX = `^(${ML_DEFAULTS_MODEL})$`;

export const ML_DEFAULTS_HOOK_CUSTOM_PAYLOAD = {
    id: "{/payload/sys/id}",
    contentType: "{/payload/sys/contentType/sys/id}",
    entryTitle: "{/payload/fields/entryTitle}",
    venture: "{/payload/fields/venture}",
    games: "{/payload/fields/games}",
    environmentVisibility: "{/payload/fields/environmentVisibility}",
    cmsEnv: "{/payload/sys/environment/sys/id}",
    updatedAt: "{/payload/sys/updatedAt}"
};
export const createMlDefaultsHookUrl = (osHost, nodeEnv = 'dev') => {
    const retryRefresh = setConflictRefreshBehaviour(nodeEnv);

    return `${osHost}${ML_PERSONALISED_DEFAULTS_WRITE_ALIAS}/_doc/{/payload/sys/id}?${retryRefresh}`;
}

export const createMlDefaultsHookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.mlDefaults);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        regexp: [
            { doc: "sys.contentType.sys.id" },
            { pattern: CONTENTFUL_ML_DEFAULTS_MODEL_REGEX }

        ]
    }
]);

export const mlDefaultsHookBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createMlDefaultsHookName(nodeEnv),
    hookUrl: createMlDefaultsHookUrl(host, nodeEnv),
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv),
    active: true,
    payload: ML_DEFAULTS_HOOK_CUSTOM_PAYLOAD
});
