import type en from './en';

export default {
	common: {
		uploadYourPhotos: 'Carica le tue foto',
		payment: 'Pagamento',
		trainTheAI: "Addestra l'IA"
	}
} as { common: Record<keyof typeof en.common, string> };
