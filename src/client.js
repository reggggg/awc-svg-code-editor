import axios from 'axios';

export const strapi = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_API_URL,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
})

export const strapi_auth = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_API_URL,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		Authorization: `Bearer ${localStorage.getItem('token')}`
	},
})

