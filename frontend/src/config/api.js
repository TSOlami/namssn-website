const API_BASE = import.meta.env.VITE_REACT_APP_API_URL ?? '';
const RESOURCES_BASE = import.meta.env.VITE_RESOURCES_URL ?? (API_BASE ? `${API_BASE.replace(/\/$/, '')}/api/v1/users/resources/` : '/api/v1/users/resources/');

export const getApiUrl = (path) => {
  const p = path.startsWith('/') ? path : `/${path}`;
  return API_BASE ? `${API_BASE.replace(/\/$/, '')}${p}` : p;
};

export const getResourcesUrl = () => RESOURCES_BASE;
export { API_BASE, RESOURCES_BASE };
