export const SORT_FIELDS = {
  sku: 'sku',
  name: 'name',
  brand: 'brand',
  category: 'category',
  price: 'price',
  discountPercent: 'discountPercent',
  stockQuantity: 'stock.quantity',
  rating: 'rating',
  createdAt: 'createdAt',
};

export const SORT_COLLATION = { locale: 'uk', strength: 2 };

export const parseSort = (sort) => {
  const result = {};

  for (const part of sort.split(',')) {
    const [column, direction, ...rest] = part.split(':');
    const isValid =
      rest.length === 0 &&
      Object.hasOwn(SORT_FIELDS, column) &&
      (direction === 'asc' || direction === 'desc') &&
      !Object.hasOwn(result, SORT_FIELDS[column]);

    if (!isValid) return null;

    result[SORT_FIELDS[column]] = direction === 'asc' ? 1 : -1;
  }

  return result;
};
