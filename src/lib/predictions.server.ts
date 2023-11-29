export function getLimitedQuantity(quantity: number) {
	if (quantity > 20) {
		quantity = 50;
	}
	if (quantity < 0) {
		quantity = 0;
	}
	return quantity;
}
