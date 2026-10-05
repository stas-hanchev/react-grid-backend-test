export const SEARCH_FIELDS = [
  'sku',
  'name',
  'brand',
  'category',
  'subcategory',
  'categoryLeaf',
];

const MAX_TERMS = 5;

export const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const buildSearchFilter = (search) => {
  const terms = search.trim().split(/\s+/).filter(Boolean).slice(0, MAX_TERMS);

  if (terms.length === 0) return null;

  return {
    $and: terms.map((term) => {
      const pattern = escapeRegex(term);

      return {
        $or: SEARCH_FIELDS.map((field) => ({
          [field]: { $regex: pattern, $options: 'i' },
        })),
      };
    }),
  };
};
