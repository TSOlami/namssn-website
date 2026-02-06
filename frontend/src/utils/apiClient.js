import axios from 'axios';

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_REACT_APP_API_URL,
	timeout: 30000,
	withCredentials: true,
});

// Simple in-flight request deduplication to avoid duplicate network calls
const pendingRequests = new Map();

const getRequestKey = (config) => {
	const { method, url, params, data } = config;
	return JSON.stringify({
		method: (method || 'get').toLowerCase(),
		url,
		params: params ?? null,
		data: typeof data === 'string' ? data : data ?? null,
	});
};

const rawRequest = apiClient.request.bind(apiClient);

apiClient.request = (config) => {
	const key = getRequestKey(config);

	if (pendingRequests.has(key)) {
		return pendingRequests.get(key);
	}

	const requestPromise = rawRequest(config).finally(() => {
		pendingRequests.delete(key);
	});

	pendingRequests.set(key, requestPromise);
	return requestPromise;
};

// Basic automatic retry for transient network failures on idempotent GET requests
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const config = error.config;

		if (!config) {
			return Promise.reject(error);
		}

		const method = (config.method || 'get').toLowerCase();
		if (method !== 'get') {
			return Promise.reject(error);
		}

		const status = error.response?.status;
		const isNetworkError = !error.response;
		const isTimeoutError = error.code === 'ECONNABORTED';

		if (!isNetworkError && !isTimeoutError && (!status || status < 500)) {
			return Promise.reject(error);
		}

		config.__retryCount = config.__retryCount || 0;
		if (config.__retryCount >= 2) {
			return Promise.reject(error);
		}

		config.__retryCount += 1;

		// Simple exponential backoff
		const delayMs = 500 * 2 ** (config.__retryCount - 1);
		await new Promise((resolve) => setTimeout(resolve, delayMs));

		return apiClient(config);
	}
);

export default apiClient;

