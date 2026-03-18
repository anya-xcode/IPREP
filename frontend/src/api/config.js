const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const IS_PRODUCTION = import.meta.env.PROD;

export { API_URL, IS_PRODUCTION };
export default API_URL;
