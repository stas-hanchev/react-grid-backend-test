import { Product } from '../models/product.js';
import { getSubtreeIds } from '../services/categories.js';
import { parseSort, SORT_COLLATION } from '../services/sorting.js';

export const getProducts = async (req, res) => {
    const { page = 1, perPage = 20, category, categoryId, sort } = req.query;

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);
    const skip = (pageNumber - 1) * perPageNumber;

    const filter = {};
    const sortBy = {};

    if (category) {
        filter.category = category;
    }

    if (categoryId) {
        filter.categoryId = { $in: await getSubtreeIds(Number(categoryId)) };
    }

    if (sort) {
        Object.assign(sortBy, parseSort(sort));
    }

    sortBy._id = 1;

    const [totalItems, products] = await Promise.all([
        Product.countDocuments(filter),
        Product.find(filter)
            .collation(SORT_COLLATION)
            .sort(sortBy)
            .skip(skip)
            .limit(perPageNumber),
    ]);

    res.status(200).json({
        page: pageNumber,
        perPage: perPageNumber,
        totalItems,
        totalPages: Math.ceil(totalItems / perPageNumber),
        products,
    });
};
