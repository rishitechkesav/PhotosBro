import { writable, get } from 'svelte/store';

export function getBaseUrl() {
	console.log(window.location.protocol + '//' + window.location.host);
	return window.location.protocol + '//' + window.location.host;
}

export function getID() {
	return Math.random().toString(16).slice(2);
}

export const messages = writable<
	{ message: string; id: string; type: 'info' | 'error'; timeoutID: NodeJS.Timeout | null }[]
>([]);

export function showError(e: string | Error | unknown) {
	if (e instanceof Error) {
		return showMessage(e.message, 'error');
	} else if (typeof e == 'string') {
		return showMessage(e, 'error');
	} else if (typeof e === 'object' && e && 'message' in e && typeof e.message === 'string') {
		return showMessage(e.message, 'error');
	} else {
		return null;
	}
}

function setMessageTimeout(id: string) {
	const timeoutID = setTimeout(() => {
		removeMessage(id);
	}, 5000);
	return timeoutID;
}

export function showMessage(message: string, type: 'info' | 'error'): string {
	const currentMessages = get(messages);
	const id = getID();
	messages.set([...currentMessages, { message, type, id, timeoutID: setMessageTimeout(id) }]);

	return id;
}

export function stopMessageTimeout(id: string) {
	const currentMessages = get(messages);
	const message = currentMessages.find((message) => message.id === id);
	if (message && message.timeoutID) {
		clearTimeout(message.timeoutID);
		message.timeoutID = null;
	}
	messages.set(currentMessages);
}

export function resetMessageTimeout(id: string) {
	const currentMessages = get(messages);
	const message = currentMessages.find((message) => message.id === id);
	if (message) {
		if (message.timeoutID) {
			clearTimeout(message.timeoutID);
		}
		message.timeoutID = setMessageTimeout(message.id);
	}
	messages.set(currentMessages);
}

export function showInfo(message: string) {
	return showMessage(message, 'info');
}

export function resetMessages() {
	messages.set([]);
}

export function removeMessage(id: string) {
	const currentMessages = get(messages);
	messages.set([...currentMessages.filter((message) => message.id !== id)]);
}
