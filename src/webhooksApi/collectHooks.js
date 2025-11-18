const OWNED_WEBHOOK_IDENTIFIER = 'lobby-openSearch';

export const getOwnedWebhooks = async (client) => {
    const response = await client.get('/webhook_definitions?limit=200');
    const ownedHooks = findOwn(response.data);
    return ownedHooks;
}

export const findOwn = (hookPayload) => {
    if (hookPayload.items.length <= 0) {
        return []
    }

    const ownedWebhooks = hookPayload.items.filter(hook => {
        // Check if there are any headers matching your criteria
        const ownedHeaders = hook?.headers.filter(item => 
            item.key === 'X-unique-own-identifier' && item.value === OWNED_WEBHOOK_IDENTIFIER
        ); 
        // Return true if there are any matching headers
        return ownedHeaders.length > 0;
    }).map(item => ({
        id: item.sys.id,
        name: item.name,
        headers: item.headers
    }));   

    return ownedWebhooks;
};

export const findByEnv = (ownedHooks = [], envIdentifier = '[DEV]') => {
    return ownedHooks.filter(hook => hook.name.includes(envIdentifier));
};

export const extractWebhookIds = (filteredHooks = []) => {
    return filteredHooks.map(hook => hook.id);
};
