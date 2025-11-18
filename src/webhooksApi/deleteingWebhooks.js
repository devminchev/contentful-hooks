import { getOwnedWebhooks, findByEnv } from './collectHooks.js';

const OPERATION = 'delete';

export const deleteWebhooks = async (client, options) => {
    const { one: webhookId, env: environment, all } = options;

    const ownedWebhooks = await getOwnedWebhooks(client);

    switch (true) {
        case !!webhookId:
            console.log(`Deleting single webhook with ID: ${webhookId}`);
            await deleteByID(client, webhookId);
            break;
        case !!environment:
            console.log(`Deleting webhooks for environment: ${environment}`);
            await deleteByEnv(client, ownedWebhooks, environment);
            break;
        case !!all:
            console.log('Deleting all owned webhooks');
            await deleteAllOwned(client, ownedWebhooks);
            break;
        default:
            console.log('No valid delete option specified. Use --one <webhookId>, --env <environment>, or --all.');
            process.exit(1);
    }
};

export const deleteByID = async (client, webhookId) => {
    try {
        const response = await client.delete(`/webhook_definitions/${webhookId}`);

        console.log(`Successfully deleted webhook with ID: ${webhookId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to delete webhook with ID ${webhookId}:`, error.message);
    }

};

export const deleteByEnv = async (client, ownedHooks, envIdentifier) => {
    try {
        const ownedForEnv = findByEnv(ownedHooks, envIdentifier);

        if (ownedForEnv.length === 0) {
            console.log(`No webhooks found for environment: ${envIdentifier}`);
            return;
        }

        console.log(`Found ${ownedForEnv.length} number of hooks defined for ${envIdentifier} environment. Proceeding to delete....`)
        // Delete each webhook by ID
        for (const webhook of ownedForEnv) {
            console.log(`Deleting ${webhook.name} with id ${webhook.id}`);
            await deleteByID(client, webhook.id);
        }

        console.log(`All webhooks for environment ${envIdentifier} have been deleted successfully.`);
    } catch (error) {
        console.error(`Failed to delete webhooks for environment ${envIdentifier}:`, error.message);
    }
};

export const deleteAllOwned = async (client, ownedHooks) => {
    try {

        if (ownedHooks.length === 0) {
            console.log(`No webhooks found.`);
            return;
        }

        // Delete each webhook by ID
        for (const webhook of ownedHooks) {
            console.log(`Deleting ${webhook.name} with id ${webhook.id}`);
            await deleteByID(client, webhook.id);
        }

        console.log(`All webhooks have been deleted successfully.`);
    } catch (error) {
        console.error(`Failed to delete webhooks: `, error.message);
    }
};
