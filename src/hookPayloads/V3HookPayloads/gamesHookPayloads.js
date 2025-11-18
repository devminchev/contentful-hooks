import { IG_GAMES_V2_WRITE_ALIAS } from "../common/osIndexes.js";
import { sharedEnvFilter, setConflictRefreshBehaviour } from '../common/shared.js';
import { pickHookTopic, createHookName } from '../../utils.js';
import { WEBHOOK_SUFFIXES } from '../../constants/webhookTextParts.js';
import { GAME_V2_MODEL } from '../common/contentfulModels.js';

export const GAME_V2_HOOK_CUSTOM_PAYLOAD = {
    game_to_sitegame: {"name": "game"},
    game: {
        id: "{/payload/sys/id}",
        contentType: "{/payload/sys/contentType/sys/id}",
        entryTitle: "{/payload/fields/entryTitle}",
        howToPlayContent: "{/payload/fields/howToPlayContent}",
        imgUrlPattern: "{/payload/fields/imgUrlPattern}",
        infoImgUrlPattern: "{/payload/fields/infoImgUrlPattern}",
        infoDetails: "{/payload/fields/infoDetails}",
        introductionContent: "{/payload/fields/introductionContent}",
        loggedOutImgUrlPattern: "{/payload/fields/loggedOutImgUrlPattern}",
        maxBet: "{/payload/fields/maxBet}",
        minBet: "{/payload/fields/minBet}",
        progressiveJackpot: "{/payload/fields/progressiveJackpot}",
        representativeColor: "{/payload/fields/representativeColor}",
        title: "{/payload/fields/title}",
        launchCode: "{/payload/fields/launchCode}",
        gamePlatformConfig: "{/payload/fields/gamePlatformConfig}",
        funPanelBackgroundImage: "{/payload/fields/funPanelBackgroundImage}",
        funPanelDefaultCategory: "{/payload/fields/funPanelDefaultCategory}",
        funPanelEnabled: "{/payload/fields/funPanelEnabled}",
        operatorBarDisabled: "{/payload/fields/operatorBarDisabled}",
        rgpEnabled: "{/payload/fields/rgpEnabled}",
        vendor: "{/payload/fields/vendor}",
        platformVisibility: "{/payload/fields/platformVisibility}",
        tags: "{/payload/fields/tags}",
        meta: "{/payload/fields/meta}",
        nativeRequirement: "{/payload/fields/nativeRequirement}",
        videoUrlPattern: "{/payload/fields/videoUrlPattern}",
        dfgWeeklyImgUrlPattern: "{/payload/fields/dfgWeeklyImgUrlPattern}",
        webComponentData: "{/payload/fields/webComponentData}",
        showNetPosition: "{/payload/fields/showNetPosition}",
        cmsEnv: "{/payload/sys/environment/sys/id}",
        createdAt: "{/payload/fields/createdAt}",
        updatedAt: "{/payload/sys/updatedAt}",
        bynderDFGWeeklyImage: "{/payload/fields/bynderDFGWeeklyImage}",
        bynderGameInfoGameTile: "{/payload/fields/bynderGameInfoGameTile}",
        bynderLoggedOutGameTile: "{/payload/fields/bynderLoggedOutGameTile}",
        bynderLoggedInGameTile: "{/payload/fields/bynderLoggedInGameTile}",
        bynderVideoGameTile: "{/payload/fields/bynderVideoGameTile}",
        bynderFunPanelBackgroundImage: "{/payload/fields/bynderFunPanelBackgroundImage}",
        animationMedia: "{/payload/fields/animationMedia}",
        loggedOutAnimationMedia: "{/payload/fields/loggedOutAnimationMedia}",
        foregroundLogoMedia: "{/payload/fields/foregroundLogoMedia}",
        loggedOutForegroundLogoMedia: "{/payload/fields/loggedOutForegroundLogoMedia}",
        backgroundMedia: "{/payload/fields/backgroundMedia}",
        loggedOutBackgroundMedia: "{/payload/fields/loggedOutBackgroundMedia}"
    }
};
export const createGameV2HookUrl = (osHost, nodeEnv = 'dev') => {

    const retryRefresh = setConflictRefreshBehaviour(nodeEnv);

    return `${osHost}${IG_GAMES_V2_WRITE_ALIAS}/_doc/{/payload/sys/id}?${retryRefresh}`;
}

export const createGameV2HookName = (nodeEnv) => createHookName(nodeEnv, WEBHOOK_SUFFIXES.gamesV3);

export const createFilters = (contentfulEnv) => ([
    sharedEnvFilter(contentfulEnv),
    {
        equals: [
            {doc: "sys.contentType.sys.id"},
            GAME_V2_MODEL
        ]
    }
]);

export const gamesHookBodyParams = (nodeEnv, host, contentfulEnv) => ({
    hookName: createGameV2HookName(nodeEnv), 
    hookUrl: createGameV2HookUrl(host, nodeEnv), 
    ...pickHookTopic(nodeEnv),
    filters: createFilters(contentfulEnv), 
    active: true,
    payload: GAME_V2_HOOK_CUSTOM_PAYLOAD
});
