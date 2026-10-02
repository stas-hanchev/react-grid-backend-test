import { model, Schema } from 'mongoose';

export const PRODUCT_STATUSES = [
  'active',
  'draft',
  'out_of_stock',
  'discontinued',
];

const productSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },

    category: { type: String, required: true, trim: true },
    subcategory: { type: String, required: true, trim: true },
    categoryLeaf: { type: String, required: true, trim: true },
    categoryId: { type: Number, required: true },

    status: { type: String, enum: PRODUCT_STATUSES, default: 'draft' },
    owner: { type: String, required: true, trim: true },

    currency: { type: String, default: 'USD' },
    price: { type: Number, required: true, min: 0 },
    cost: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },

    stock: {
      quantity: { type: Number, default: 0, min: 0 },
      reserved: { type: Number, default: 0, min: 0 },
      reorderLevel: { type: Number, default: 0, min: 0 },
      warehouse: { type: String, trim: true },
    },

    sales: {
      unitsSold: { type: Number, default: 0, min: 0 },
      revenue: { type: Number, default: 0, min: 0 },
      lastMonthUnits: { type: Number, default: 0, min: 0 },
    },

    rating: { type: Number, min: 1, max: 5, default: null },
    reviewsCount: { type: Number, default: 0, min: 0 },

    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isTaxable: { type: Boolean, default: true },

    supplier: {
      name: { type: String, trim: true },
      country: { type: String, trim: true },
      contactEmail: { type: String, trim: true },
    },

    dimensions: {
      widthCm: Number,
      heightCm: Number,
      depthCm: Number,
      weightKg: Number,
    },

    tags: { type: [String], default: [] },
    description: { type: String, default: null },

    specs: {
      type: [
        {
          _id: false,
          key: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
      default: [],
    },

    reviews: {
      type: [
        {
          _id: false,
          author: { type: String, required: true },
          rating: { type: Number, required: true, min: 1, max: 5 },
          comment: { type: String, required: true },
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    releaseDate: { type: Date },
    lastRestockedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Product = model('Product', productSchema);
