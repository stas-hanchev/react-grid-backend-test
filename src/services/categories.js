import { Product } from '../models/product.js';
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

export const withLiveStats = async (categories) => {
  const rows = await Product.aggregate([
    {
      $group: {
        _id: '$categoryId',
        productCount: { $sum: 1 },
        totalStock: { $sum: '$stock.quantity' },
        priceSum: { $sum: '$price' },
      },
    },
  ]);

  const byId = new Map(
    categories.map((category) => [
      category.id,
      { ...category, productCount: 0, totalStock: 0, priceSum: 0 },
    ]),
  );

  for (const row of rows) {
    let node = byId.get(row._id);

    while (node) {
      node.productCount += row.productCount;
      node.totalStock += row.totalStock;
      node.priceSum += row.priceSum;
      node = byId.get(node.parentId);
    }
  }

  return [...byId.values()].map(({ priceSum, ...category }) => ({
    ...category,
    avgPrice: category.productCount
      ? Math.round((priceSum / category.productCount) * 100) / 100
      : 0,
  }));
};
