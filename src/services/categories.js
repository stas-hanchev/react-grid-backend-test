import { Category } from '../models/category.js';

export const getSubtreeIds = async (categoryId) => {
  const categories = await Category.find({}, { id: 1, parentId: 1, _id: 0 }).lean();

  const childrenByParent = new Map();

  for (const { id, parentId } of categories) {
    const siblings = childrenByParent.get(parentId) ?? [];
    siblings.push(id);
    childrenByParent.set(parentId, siblings);
  }

  const ids = [];
  const stack = [categoryId];

  while (stack.length > 0) {
    const current = stack.pop();
    ids.push(current);
    stack.push(...(childrenByParent.get(current) ?? []));
  }

  return ids;
};
