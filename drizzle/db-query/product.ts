import { Product } from '../drizzle';

export type ProductType = typeof Product.$inferSelect;
