"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalCents: number;
  totalItems: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "egtech_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [carregado, setCarregado] = useState(false);

  // Carrega do localStorage só no cliente (não usar no build/SSR)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage indisponível (ex: modo privado) — segue com carrinho vazio
    }
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignora falha ao salvar
    }
  }, [items, carregado]);

  const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
    setItems((atual) => {
      const existente = atual.find((i) => i.productId === item.productId);
      if (existente) {
        return atual.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...atual, { ...item, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((atual) => atual.filter((i) => i.productId !== productId));
  };

  const setQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((atual) =>
      atual.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const clear = () => setItems([]);

  const totalCents = useMemo(
    () => items.reduce((soma, i) => soma + i.priceCents * i.quantity, 0),
    [items]
  );
  const totalItems = useMemo(
    () => items.reduce((soma, i) => soma + i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQuantity, clear, totalCents, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}

export { formatarPreco } from "@/lib/format";
