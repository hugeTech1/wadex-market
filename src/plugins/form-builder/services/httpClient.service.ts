import { fetchConfig } from "../../../services/config.service";

let BASE_URL = '';
let defaultHeaders: HeadersInit = {};

const initConfig = async () => {
    const CONFIG = await fetchConfig();
    BASE_URL = CONFIG.API_BASE_URL;
    const PUBLIC_KEY = CONFIG.WDX_PUBLIC_KEY;
    const WDX_LOG_REQUEST = CONFIG.WDX_LOG_REQUEST === 'true';

    defaultHeaders = {
        'Content-Type': 'application/json',
        'wdx-public-key': PUBLIC_KEY ?? '',
        'wdx-log-request': WDX_LOG_REQUEST.toString(),
    };
};

// Helper to ensure config is loaded
let isConfigLoaded = false;
const ensureConfig = async () => {
    if (!isConfigLoaded) {
        await initConfig();
        isConfigLoaded = true;
    }
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Unexpected error occurred');
    }
    return response.json();
};

const httpClient = {
    get: async <T>(url: string): Promise<T> => {
        await ensureConfig();
        const response = await fetch(`${BASE_URL}${url}`, {
            headers: defaultHeaders,
        });
        return handleResponse(response);
    },

    post: async <T>(url: string, data: any): Promise<T> => {
        await ensureConfig();
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    put: async <T>(url: string, data: any): Promise<T> => {
        await ensureConfig();
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'PUT',
            headers: defaultHeaders,
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    delete: async <T>(url: string): Promise<T> => {
        await ensureConfig();
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'DELETE',
            headers: defaultHeaders,
        });
        return handleResponse(response);
    },
};

export default httpClient;