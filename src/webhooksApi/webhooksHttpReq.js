export const createWebhook = async (client, payload) => {
    // console.log('FINAL PAYLOAD: ', JSON.stringify(payload, null, 2));
    try {
        const response = await client.post('/webhook_definitions', payload);
        console.log('Resource created:', response?.status);
        return response.data;
    } catch (error) {
        // console.error('Failed to create resource:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateWebhook = async (client, webhookId, payload, version) => {
    try {
        const headers = {};
        if (version) {
            headers['X-Contentful-Version'] = version;
        }
        
        const response = await client.put(`/webhook_definitions/${webhookId}`, payload, { headers });
        console.log('Resource updated:', response?.status);
        return response.data;
    } catch (error) {
        console.error('Failed to update resource:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getHooks = () => {

};
