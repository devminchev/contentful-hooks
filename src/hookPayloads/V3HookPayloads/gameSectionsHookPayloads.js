import { GAMES_SECTION_INDEX_WRITE_ALIAS } from "../common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from '../common/shared.js';
import { pickHookTopic, createHookName } from '../../utils.js';
import { WEBHOOK_SUFFIXES } from '../../constants/webhookTextParts.js';

const CONTENTFUL_GAME_SECTIONS_MODEL_REGEX = '^(igGridASection|igGridBSection|igGridCSection|igGridDSection|igGridESection|igGridFSection|igGridGSection|igCarouselA|igCarouselB|igJackpotsSection|igJackpotSectionsBlock|igSearchResults|igDfgSection|igGameShuffle)$';

export const GAME_SECTIONS_HOOK_CUSTOM_PAYLOAD = {
    id: "{/payload/sys/id}",
    contentType: "{/payload/sys/contentType/sys/id}",
    entryTitle: "{/payload/fields/entryTitle}",
    platformVisibility: "{/payload/fields/platformVisibility}",
    sessionVisibility: "{/payload/fields/sessionVisibility}",
    environmentVisibility: "{/payload/fields/environmentVisibility}",
    name: "{/payload/fields/name}",
    venture: "{/payload/fields/venture}",
    classification: "{/payload/fields/classification}",
    cmsEnv: "{/payload/sys/environment/sys/id}",
    updatedAt: "{/payload/sys/updatedAt}",
    title: "{/payload/fields/title}",
    slug: "{/payload/fields/slug}",
    games: "{/payload/fields/games}",
    game: "{/payload/fields/game}",
    sectionTruncation: "{/payload/fields/sectionTruncation}",
    layoutType: "{/payload/fields/layoutType}",
    viewAllActionText: "{/payload/fields/viewAllActionText}",
    viewAllType: "{/payload/fields/viewAllType}",
    viewAllAction: "{/payload/fields/viewAllAction}",
    expandedSectionLayoutType: "{/payload/fields/expandedSectionLayoutType}",
    image: "{/payload/fields/image}",
    mediaLoggedIn: "{/payload/fields/mediaLoggedIn}",
    mediaLoggedOut: "{/payload/fields/mediaLoggedOut}",
    jackpotType: "{/payload/fields/jackpotType}",
    headlessJackpot: "{/payload/fields/headlessJackpot}",
    headerImage: "{/payload/fields/headerImage}",
    backgroundImage: "{/payload/fields/backgroundImage}",
    headerImageBynder: "{/payload/fields/headerImageBynder}",
    backgroundImageBynder: "{/payload/fields/backgroundImageBynder}",
    pot1ImageBynder: "{/payload/fields/pot1ImageBynder}",
    pot2ImageBynder: "{/payload/fields/pot2ImageBynder}",
    pot3ImageBynder: "{/payload/fields/pot3ImageBynder}",
    pot4ImageBynder: "{/payload/fields/pot4ImageBynder}",
    pot1Image: "{/payload/fields/pot1Image}",
    pot2Image: "{/payload/fields/pot2Image}",
    pot3Image: "{/payload/fields/pot3Image}",
    pot4Image: "{/payload/fields/pot4Image}",
    jackpots: "{/payload/fields/jackpots}",
    media: "{/payload/fields/media}",
    dynamicBackground: "{/payload/fields/dynamicBackground}",
    dynamicLogo: "{/payload/fields/dynamicLogo}",
    bynderMedia: "{/payload/fields/bynderMedia}",
    bynderDynamicBackground: "{/payload/fields/bynderDynamicBackground}",
    bynderDynamicLogo: "{/payload/fields/bynderDynamicLogo}",
    link: "{/payload/fields/link}"
};
export const createGameSectionsHookUrl = (osHost, nodeEnv = 'dev') => {
    const retryRefresh = setConflictRefreshBehaviour(nodeEnv);

    return `${osHost}${GAMES_SECTION_INDEX_WRITE_ALIAS}/_doc/{/payload/sys/id}?${retryRefresh}`;
}

export const createGameSectionsHookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.gameSections);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        regexp: [
            { doc: "sys.contentType.sys.id" },
            { pattern: CONTENTFUL_GAME_SECTIONS_MODEL_REGEX }

        ]
    }
]);

export const gameSectionsBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createGameSectionsHookName(nodeEnv),
    hookUrl: createGameSectionsHookUrl(host, nodeEnv),
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv),
    active: true,
    payload: GAME_SECTIONS_HOOK_CUSTOM_PAYLOAD
});
