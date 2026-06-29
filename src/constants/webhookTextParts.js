// Webhook suffixes for name matching and creation
export const WEBHOOK_SUFFIXES = {
    // V2 webhooks
    'gameV2': '[Update] OpenSearch - gameV2',
    'siteGameV2': '[Update] OpenSearch - siteGameV2', 
    'sections': '[Update] OpenSearch - section,legendaryJackpots,suggestedForYou',
    'personalisedSections': '[Update] OpenSearch - personalisedGamesSection models',
    'suggestedGames': '[Update] OpenSearch - lobbySuggestedGames',
    'layouts': '[Update] OpenSearch - layout, miniGames',
    'ventures': '[Update] OpenSearch - ventures',
    'categories': '[Update] OpenSearch - categories, category',
    
    // V3 webhooks
    'navigation': '[Update] OpenSearch - navigation, links, quickLinks',
    'view': '[Update] OpenSearch - view, miniGames',
    'gameSections': '[Update] OpenSearch - game-sections',
    'marketingSections': '[Update] OpenSearch - marketing-sections',
    'mlSections': '[Update] OpenSearch - ml sections',
    'mlDefaults': '[Update] OpenSearch - ml defaults',
    'gamesV3': '[Update] OpenSearch - V3 gameV2',
    'gamesV4': '[Update] [Lambda] OpenSearch - V3 gameV2 and siteGameV2',
    'siteGamesV3': '[Update] OpenSearch - V3 siteGameV2',
    'themes': '[Update] OpenSearch - theme',
    
    // Delete webhooks
    'generalDelete': '[Delete] OpenSearch - General',
    'gameV2Delete': '[Delete] OpenSearch - GameV2',
    'generalDeleteV3': '[Delete] OpenSearch - General V3',
    'gameV2DeleteV3': '[Delete] OpenSearch - GameV2 V3',
    'archivedGamesDelete': '[Delete] OpenSearch - Delete from Archive on Publish'
};

// Webhook type to version mapping
export const WEBHOOK_TYPE_VERSIONS = {
    // V2 webhooks
    'gameV2': 'v2',
    'siteGameV2': 'v2',
    'sections': 'v2',
    'personalisedSections': 'v2',
    'suggestedGames': 'v2',
    'layouts': 'v2',
    'venturesV2': 'v2',
    'categories': 'v2',
    
    // V3 webhooks
    'navigation': 'v3',
    'view': 'v3',
    'gameSections': 'v3',
    'marketingSections': 'v3',
    'mlSections': 'v3',
    'mlDefaults': 'v3',
    'gamesV3': 'v3',
    'gamesV4': 'v3',
    'siteGamesV3': 'v3',
    'themes': 'v3',
    'venturesV3': 'v3',
    
    // Delete webhooks
    'generalDelete': 'v2',
    'gameV2Delete': 'v2',
    'generalDeleteV3': 'v3',
    'gameV2DeleteV3': 'v3',
    'archivedGamesDelete': 'v3'
};

// Helper function to extract suffix from webhook name
export const extractSuffixFromWebhookName = (webhookName) => {
    // Pattern: [Lobby] [ENV] suffix
    const match = webhookName.match(/\[Lobby\] \[[A-Z]+\] (.+)/);
    return match ? match[1] : null;
};

// Helper function to identify webhook type by suffix
export const identifyWebhookTypeBySuffix = (suffix, targetVersion = null) => {
    // Handle ventures special case (has version suffix)
    if (suffix.startsWith('[Update] OpenSearch - ventures ')) {
        const version = suffix.includes('V3') ? 'v3' : 'v2';
        if (targetVersion) {
            return targetVersion === version ? (version === 'v3' ? 'venturesV3' : 'venturesV2') : null;
        }
        return version === 'v3' ? 'venturesV3' : 'venturesV2';
    }
    
    // Find matching webhook type
    for (const [type, expectedSuffix] of Object.entries(WEBHOOK_SUFFIXES)) {
        if (expectedSuffix === suffix) {
            // If target version specified, check if this type matches using the explicit version mapping
            if (targetVersion) {
                const typeVersion = WEBHOOK_TYPE_VERSIONS[type];
                if (typeVersion === targetVersion) {
                    return type;
                }
            } else {
                return type;
            }
        }
    }
    
    return null;
}; 
