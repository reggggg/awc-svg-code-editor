import axios from 'axios';

const strapi = axios.create({
	baseURL: import.meta.env.VITE_STRAPI_API_URL,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
})

const strapi_auth = axios.create({
	baseURL: import.meta.env.VITE_STRAPI_API_URL,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
})

strapi_auth.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export {
	strapi,
	strapi_auth
}

