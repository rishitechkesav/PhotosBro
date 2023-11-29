// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Supabase {
		Database: import('./lib/supabase-types').Database;
		SchemaName: 'public';
	}

	// interface Locals {}
	interface PageData {
		session: import('@supabase/supabase-js').Session | null;
	}
	// interface Error {}
	// interface Platform {}
}
declare module 'watermarkjs' {
	function Watermark(images: string[], options: any): any;
	namespace Watermark {
		const image: any;
	} // This is a hack to allow ES6 wildcard imports
	export = Watermark;
}
