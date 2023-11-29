import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '$lib/locales/en';
//import it from '$lib/locales/it';
import { createI18nStore } from 'svelte-i18next';

const resources = {
	en
	//it
};

export const availableLanguages = Object.keys(resources);

i18next.use(LanguageDetector).init({
	interpolation: {
		escapeValue: false // not needed for svelte as it escapes by default
	},
	detection: {
		order: ['querystring', 'localStorage', 'navigator'],
		caches: ['localStorage'],
		lookupQuerystring: 'lng',
		lookupLocalStorage: 'locale'
	},
	resources,
	defaultNS: 'common',
	fallbackLng: 'en'
});

export const i18n = createI18nStore(i18next);
