export const getProducts = async (req, res) => {
  try {
    const { page = 1, perPage = 20, category } = req.query;

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);
    const skip = (pageNumber - 1) * perPageNumber;

    // Default query without category filter
    if (!category) {
      const [totalItems, products] = await Promise.all([
        Product.countDocuments(),
        Product.find().sort({ _id: 1 }).skip(skip).limit(perPageNumber),
      ]);

      return res.status(200).json({
        page: pageNumber,
        perPage: perPageNumber,
        totalItems,
        totalPages: Math.ceil(totalItems / perPageNumber),
        products,
      });
    }

    // Aggregation pipeline filtered by category
    const pipeline = [
      { $match: { category } },
      { $sort: { _id: 1 } },
      {
        $facet: {
          metadata: [{ $count: 'totalItems' }],
          products: [{ $skip: skip }, { $limit: perPageNumber }],
        },
      },
    ];

    const result = await Product.aggregate(pipeline);

    const totalItems = result[0].metadata[0]?.totalItems || 0;
    const products = result[0].products || [];

    return res.status(200).json({
      page: pageNumber,
      perPage: perPageNumber,
      totalItems,
      totalPages: Math.ceil(totalItems / perPageNumber),
      products,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
