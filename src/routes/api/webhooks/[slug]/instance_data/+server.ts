import type { RequestHandler } from './$types';
import { error as svelteError } from '@sveltejs/kit';
import { supabaseClientAdmin } from '$lib/db.server';
import JSZip from 'jszip';

export const GET: RequestHandler = async (event) => {
	try {
		const userID = event.params.slug;

		if (!userID) {
			throw new Error('ID not valid');
		}

		const { data: photos, error } = await supabaseClientAdmin.storage
			.from('photos-for-training')
			.list(userID);

		if (error) {
			throw new Error("Can't list photos", { cause: error });
		}

		if (photos.length == 0 || photos.length > 100) {
			throw new Error('Wrong photos number');
		}

		const zip = new JSZip();

		for (const image of photos) {
			const { data: photo, error } = await supabaseClientAdmin.storage
				.from('photos-for-training')
				.download(userID + '/' + image.name);
			if (error) {
				throw new Error("Can't download photo", { cause: error });
			}
			if (photo) {
				zip.file(image.name, Buffer.from(await photo.arrayBuffer()));
			}
		}

		return new Response(await zip.generateAsync({ type: 'uint8array' }), {
			headers: {
				'Content-Type': 'application/zip',
				'Content-Disposition': 'attachment; filename="images.zip"'
			}
		});
	} catch (error) {
		console.error(error);
		if (error instanceof Error) {
			console.error(error.cause);
			throw svelteError(500, { message: error.message });
		}
		throw svelteError(500);
	}
};
