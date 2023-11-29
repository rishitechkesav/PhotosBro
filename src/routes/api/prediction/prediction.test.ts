import { getLimitedQuantity } from '$lib/predictions.server';
import { describe, expect, it } from 'vitest';

describe('Test limited quantity', () => {
	it('sample test which should be true', () => {
		expect(getLimitedQuantity(10)).toBe(10);
		expect(getLimitedQuantity(25)).toBe(20);
		expect(getLimitedQuantity(-10)).toBe(0);
		expect(getLimitedQuantity(15)).toBe(15);
		expect(getLimitedQuantity(7)).toBe(7);
	});
});
