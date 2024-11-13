import { Product } from '@/drizzle/drizzle';

export type ProductType = typeof Product.$inferSelect;
