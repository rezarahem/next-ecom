'use client';

import { handleError } from '@/lib/handle-error';
import { ProductBaseType, ProductType } from '@/query';
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  use,
  useEffect,
  useCallback,
} from 'react';
import toast from 'react-hot-toast';

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount: number | null;
  inventory: number;
  buyLimit: number;
  thumb: string;
  pending: boolean;
};

type Cart = {
  cartId: number | undefined;
  userId: number | undefined;
  price: number;
  discount: number;
  product: Product[];
  pending: boolean;
  isMounted: boolean;
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
  clearCart: () => void;
};

type Props = {
  children: React.ReactNode;
};

const CartCtx = createContext<Cart | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartCtx);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [cartId, setCartId] = useState<number | undefined>(undefined);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [productState, setProductState] = useState<Product[]>([]);
  const [cartPending, setCartPending] = useState(false);

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  useEffect(() => {
    const fetchInitialCart = async () => {
      try {
        // const initialCart = await GetCartData();
        // setCourseState(initialCart.courses ?? []);
        // setCartId(initialCart.cartId);
        // setUserId(initialCart.userId);
      } catch (error) {
        handleError(error as any);
      }
    };

    if (isMounted) {
      fetchInitialCart();
    }
  }, [isMounted]);

  const price = productState.reduce((t, p) => t + p.price, 0);

  const specialPrice = productState.reduce((t, p) => t + (p.discount ?? 0), 0);

  const clearCart = useCallback(async () => {
    try {
      const prev = productState;
      setProductState([]);
    } catch (error) {
      handleError(error as any);
    }
  }, [setProductState, cartId, productState]);

  const value = useMemo(
    () => ({
      cartId,
      userId,
      price,
      specialPrice,
      cartPending,
      isMounted,
      courses: courseState,
      addCourse,
      removeCourse,
      clearCart,
    }),
    [
      courseState,
      cartId,
      cartPending,
      isMounted,
      price,
      specialPrice,
      userId,
      addCourse,
      clearCart,
      removeCourse,
    ],
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
};
