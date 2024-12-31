import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './index.css'; // Add your styles here

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = Cookies.get("userId"); // Retrieve user ID from cookies
        if (!userId) {
          setError("You must be logged in to view orders.");
          return;
        }
  
        // Pass the user ID as a query parameter
        const response = await axios.get(`http://localhost:3003/orders?userId=${userId}`);
        console.log("orders");
        console.log(userId);
        console.log(response);
        setOrders(response.data); // Store the fetched orders
      } catch (err) {
        setError('Failed to fetch orders'); // Handle error
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };
  
    fetchOrders();
  }, []);

  

  // Handle loading and error states
  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">Your Orders</h1>
      {orders.length === 0 ? (
  <p className="no-orders">No orders placed yet.</p>
) : (
  orders.map((order, index) => (
    <div className="order-card" key={order._id}>
      <div className="order-header">
        <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="order-details">
        <p><strong>Name:</strong> {order.customerDetails.name}</p>
        <p><strong>Address:</strong> {order.customerDetails.address}</p>
        <p><strong>Phone:</strong> {order.customerDetails.phone}</p>
        <p><strong>Pincode:</strong> {order.customerDetails.pincode}</p>
      </div>
      <h4 className="items-title">Items:</h4>
      <ul className="order-items-list">
        {order.cartItems.map((item) => (
          <li className="order-item" key={item._id}>
            <img src={item.imageUrl} alt={item.name} className="order-item-image" />
            <div className="order-item-info">
              <span className="order-item-name">{item.name}</span>
              <span className="order-item-quantity">x{item.quantity}</span>
              <span className="order-item-price">₹{item.price}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="payment-info">
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
      </div>
    </div>
  ))
)}

    </div>
  );
};

export default Orders;
