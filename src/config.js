export const getConfig = () => ({
    eu: {
        dev: {
            OS_HOST: process.env.DEV_OS_HOST || "https://hvlu29zfm3.execute-api.eu-west-1.amazonaws.com/Dev/lobby/",
            OS_USER: process.env.DEV_OS_USER,
            OS_PASS: process.env.DEV_OS_PASS,
            CONTENTFUL_ENV: process.env.DEV_CONTENTFUL_ENV || 'dev',
            CONTENTFUL_API_TOKEN: process.env.DEV_EU_CONTENTFUL_BEARER_TOKEN,
            CONTENTFUL_SPACE: process.env.DEV_EU_CONTENTFUL_SPACE
        },
        stg: {
            OS_HOST: process.env.STG_OS_HOST,
            OS_USER: process.env.STG_OS_USER,
            OS_PASS: process.env.STG_OS_PASS,
            CONTENTFUL_ENV: process.env.STG_CONTENTFUL_ENV || 'dev',
            CONTENTFUL_API_TOKEN: process.env.STG_EU_CONTENTFUL_BEARER_TOKEN,
            CONTENTFUL_SPACE: process.env.STG_EU_CONTENTFUL_SPACE
        },
        prod: {
            OS_HOST: process.env.PROD_OS_HOST,
            OS_USER: process.env.PROD_OS_USER,
            OS_PASS: process.env.PROD_OS_PASS,
            CONTENTFUL_ENV: process.env.PROD_CONTENTFUL_ENV || 'master',
            CONTENTFUL_API_TOKEN: process.env.PROD_EU_CONTENTFUL_BEARER_TOKEN,
            CONTENTFUL_SPACE: process.env.PROD_EU_CONTENTFUL_SPACE
        }
    },
    na: {
        dev: {
            OS_HOST: process.env.NA_DEV_OS_HOST || "https://usgxlsqtv7.execute-api.us-east-1.amazonaws.com/Dev/lobby-us/",
            OS_USER: process.env.NA_DEV_OS_USER,
            OS_PASS: process.env.NA_DEV_OS_PASS,
            CONTENTFUL_ENV: process.env.NA_DEV_CONTENTFUL_ENV || 'dev',
            CONTENTFUL_API_TOKEN: process.env.NA_DEV_CONTENTFUL_BEARER_TOKEN,
            CONTENTFUL_SPACE: process.env.NA_DEV_CONTENTFUL_SPACE
        },
        stg: {
            OS_HOST: process.env.NA_STG_OS_HOST,
            OS_USER: process.env.NA_STG_OS_USER,
            OS_PASS: process.env.NA_STG_OS_PASS,
            CONTENTFUL_ENV: process.env.NA_STG_CONTENTFUL_ENV || 'dev',
            CONTENTFUL_API_TOKEN: process.env.NA_STG_CONTENTFUL_BEARER_TOKEN,
            CONTENTFUL_SPACE: process.env.NA_STG_CONTENTFUL_SPACE
        },
        prod: {
            OS_HOST: process.env.NA_PROD_OS_HOST,
            OS_USER: process.env.NA_PROD_OS_USER,
            OS_PASS: process.env.NA_PROD_OS_PASS,
            CONTENTFUL_ENV: process.env.NA_PROD_CONTENTFUL_ENV || 'master',
            CONTENTFUL_API_TOKEN: process.env.NA_PROD_CONTENTFUL_BEARER_TOKEN,
            CONTENTFUL_SPACE: process.env.NA_PROD_CONTENTFUL_SPACE
        }
    }
    
});
