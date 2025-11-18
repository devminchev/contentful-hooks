import dotenv from 'dotenv';
import { getConfig } from './config.js';
import { encodeBase64Creds, validateConfig } from './utils.js';
import { createWebhooksOnEnv, createV3WebhooksOnEnv } from './webhooksApi/webhookMethods.js';
import { createAxiosClient } from './client.js';
import { deleteWebhooks } from './webhooksApi/deleteingWebhooks.js';
import { updateWebhooks, updateV3Webhooks } from './webhooksApi/updateWebhooks.js';
import { Command } from 'commander';

dotenv.config();
const program = new Command();

const getEnvSettings = () => {
    const environment = process.env.NODE_ENV || 'dev';
    const jurisdiction = process.env.JURISDICTION || 'eu';
    const currentConfig = getConfig()[jurisdiction][environment];

    validateConfig(currentConfig);

    const {
        OS_HOST: osHost,
        CONTENTFUL_ENV: contentfulEnv,
        OS_USER: osUser,
        OS_PASS: osPass,
        CONTENTFUL_API_TOKEN: apiToken,
        CONTENTFUL_SPACE: contentfulSpace
    } = currentConfig;


    return { environment, osHost, contentfulEnv, osUser, osPass, apiToken, contentfulSpace };
}


const updateWebhooksFunction = async (envSettings, options) => {
    const credentials = encodeBase64Creds(envSettings.osUser, envSettings.osPass);
    const client = createAxiosClient(envSettings.apiToken, envSettings.contentfulSpace);
    

    const envSettingsWithCredentials = { ...envSettings, credentials };
    
    await updateWebhooks(client, options, envSettingsWithCredentials);
};


const updateV3WebhooksFunction = async (envSettings, options) => {
    const credentials = encodeBase64Creds(envSettings.osUser, envSettings.osPass);
    const client = createAxiosClient(envSettings.apiToken, envSettings.contentfulSpace);
    

    const envSettingsWithCredentials = { ...envSettings, credentials };
    
    await updateV3Webhooks(client, options, envSettingsWithCredentials);
};

// Define the init function first
const init = async (operation, options = {}) => {
    try {
        const envSettings = getEnvSettings();
        const credentials = encodeBase64Creds(envSettings.osUser, envSettings.osPass);
        const client = createAxiosClient(envSettings.apiToken, envSettings.contentfulSpace);
        
        switch (operation) {
            case 'create':
                await createWebhooksOnEnv({ environment: envSettings.environment, osHost: envSettings.osHost, contentfulEnv: envSettings.contentfulEnv, credentials, client });
                break;
            case 'create-v3':
                    await createV3WebhooksOnEnv({ environment: envSettings.environment, osHost: envSettings.osHost, contentfulEnv: envSettings.contentfulEnv, credentials, client });
                    break;
            case 'delete':
                await deleteWebhooks(client, options);
                break;
            case 'update':
                await updateWebhooksFunction(envSettings, options);
                break;
            case 'update-v3':
                await updateV3WebhooksFunction(envSettings, options);
                break;
            default:
                console.log(`Unknown operation '${operation}' specified.`);
                process.exit(1);
        }
    } catch (error) {
        console.error("ERROR:", error?.message ? error.message : error);
    }
};

program
    .name('contentful-hooks')
    .description('A CLI tool for managing the iGaming lobby contentful hooks')
    .version('1.0.0');

program.command('create')
    .description('Create webhooks')
    .action(() => {
        init('create');
    });

program.command('create-v3')
.description('Create webhooks for V3')
.action(() => {
    init('create-v3');
});

program.command('update')
    .description('Update V2 webhooks by ID')
    .option('--ids <webhookIds>', 'Comma-separated list of webhook IDs to update')
    .action((options) => {
        init('update', options);
    });

program.command('update-v3')
    .description('Update V3 webhooks by ID')
    .option('--ids <webhookIds>', 'Comma-separated list of webhook IDs to update')
    .action((options) => {
        init('update-v3', options);
    });

program.command('delete')
    .description('Delete webhooks')
    .option('--one <webhookId>', 'Delete a single webhook by webhookId') // Capture webhookId from the terminal
    .option('--env <environment>', 'Delete a set of webhooks based on provided environment. Allowed values: [DEV], [STG], [PROD]', (value) => {
        const validEnvs = ['[DEV]', '[STG]', '[PROD]'];
        if (!validEnvs.includes(value)) {
            throw new Error(`Invalid environment: ${value}. Allowed values are ${validEnvs.join(', ')}`);
        }
        return value;
    })
    .option('--all', 'Delete all owned webhooks')
    .action((options) => {
        init('delete', options); // Pass options to the init function
    });

// Parsing command-line arguments
program.parse(process.argv);
