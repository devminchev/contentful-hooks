import { IG_GAMES_V2_WRITE_ALIAS } from "../common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from '../common/shared.js';
import { pickHookTopic, createHookName } from '../../utils.js';
import { WEBHOOK_SUFFIXES } from '../../constants/webhookTextParts.js';
import { GAME_V2_MODEL, SITE_GAME_V2_MODEL } from '../common/contentfulModels.js';

/* Single Lambda webhook for both gameV2 and siteGameV2 entries.
    gameV2 and siteGameV2 share the `games-v3` index (alias `games-v2-w`) as an
    OpenSearch parent/child join on `game_to_sitegame`: a game is the parent and a
    siteGame is its child. The two models have different field shapes, and the join
    value differs per model (`{name:"game"}` vs `{name:"sitegame", parent:<gameId>}`),
    so neither the join field nor a per-model PUT URL can be expressed statically here.
    Instead this payload forwards both blocks and the Lambda derives the join field,
    the routing key, and the index write per content type (see PostGamesPayloadFunction).

    Shared entry/system metadata (id, contentType, cmsEnv, cmsChangeVersion, createdAt,
    updatedAt) is sent ONCE at the top level rather than duplicated inside both blocks —
    otherwise a gameV2 entry's payload would show a misleading `siteGame.contentType: "gameV2"`.
    The Lambda merges these top-level fields into whichever block matches sys.contentType.

    As with the other multi-model hooks (navigation, game-sections), Contentful drops
    JSON pointers that don't resolve for the firing entry, so each block only carries
    the fields that exist on the entry that triggered the hook.
*/
export const GAME_V2_HOOK_CUSTOM_PAYLOAD = {
    "id": "{/payload/sys/id}",
    "contentType": "{/payload/sys/contentType/sys/id}",
    "cmsEnv": "{/payload/sys/environment/sys/id}",
    "cmsChangeVersion": "{/payload/sys/version}",
    "createdAt": "{/payload/sys/createdAt}",
    "updatedAt": "{/payload/sys/updatedAt}",
    "entity": {
        "kind": "{/payload/sys/contentType/sys/id}",
        "metadataTags": "{/payload/metadata/tags}",
        "payloadFields": "{/payload/fields}",
        "derived": {
            "gameId": "{/payload/fields/game/en-GB/sys/id}"
        }
    }
};

export const createGameV2HookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.gamesV4);

// Match both gameV2 and siteGameV2 so a single Lambda hook handles the parent/child pair,
// following the regex-filter pattern used by the navigation and game-sections hooks.
const CONTENTFUL_GAME_MODELS_REGEX = `^(${GAME_V2_MODEL}|${SITE_GAME_V2_MODEL})$`;

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        regexp: [
            { doc: "sys.contentType.sys.id" },
            { pattern: CONTENTFUL_GAME_MODELS_REGEX }
        ]
    }
]);

export const gamesHookLambdaBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createGameV2HookName(nodeEnv),
    hookUrl: host,
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv),
    active: true,
    payload: GAME_V2_HOOK_CUSTOM_PAYLOAD
});
