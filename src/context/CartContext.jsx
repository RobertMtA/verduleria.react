import React, { createContext, useContext, useState } from "react";

export const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (producto) => {
    const precio = Number(producto.precio ?? producto.price ?? 0);
    const cantidad = Number(producto.cantidad ?? 1);

    setCartItems((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prev, { ...producto, precio, cantidad }];
    });
  };

  const clearCart = () => setCartItems([]);

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, cantidad) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad } : item
      )
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );
  };

  const checkout = async () => {
    try {
      for (const item of cartItems) {
        await fetch(
          import.meta.env.VITE_API_URL
            ? `${import.meta.env.VITE_API_URL}/productos/restar-stock`
            : "https://verduleria-backend-m19n.onrender.com/api/productos/restar-stock",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: item.id, cantidad: item.cantidad }),
          }
        );
      }
      clearCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateTotal,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
