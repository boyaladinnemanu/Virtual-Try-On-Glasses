// DefaultContext.js
import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

const DefaultContext = createContext();

export const DefaultProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [token,setToken] = useState(null);

  const addToCart = (item) => {
    const isInCart = cartItems.some((cartItem) => cartItem._id === item._id);
    if (!isInCart) setCartItems([...cartItems, { ...item, quantity: 1 }]);
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  

  const incrementCartItemQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementCartItemQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const addToOrders = (cartItems, customerDetails) => {
    const newOrder = {
      customerDetails,
      cartItems,
      paymentMethod: customerDetails.paymentMethod || "Cash on Delivery",
    };
    setOrders([...orders, newOrder]);
  };

  // const fetchOrders = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:3001/orders');
  //     setOrders(response.data);
  //   } catch (error) {
  //     console.error('Error fetching orders:', error);
  //   }
  // };

  return (
    <DefaultContext.Provider
      value={{
        cartItems,
        addToCart,
        setCartItems,
        removeItem,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
        orders,
        addToOrders,
        // fetchOrders,
        token,
        setToken,
      }}
    >
      {children}
    </DefaultContext.Provider>
  );
};

export default DefaultContext;