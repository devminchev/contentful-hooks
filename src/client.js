import axios from 'axios';

// Function to create an Axios client with predefined configuration
export const createAxiosClient = (token, contentfulSpace) =>  {
    const baseURL = contentfulSpace;

    const client = axios.create({
        baseURL: baseURL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/vnd.contentful.management.v1+json',
            'Accept': 'application/json',
            // Additional headers can be added here
        }
    });

    return client;
}
