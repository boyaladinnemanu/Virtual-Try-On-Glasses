import { useState, useContext, useEffect } from "react";
import axios from "axios";
import DefaultContext from "../../context/DefaultContext";
import Cookies from 'js-cookie';
import "./index.css";

const Cart = () => {
  const { cartItems = [], setCartItems, removeItem } = useContext(DefaultContext);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");
const userId = Cookies.get('userId');
  // Debugging: Check if cartItems and setCartItems are correct
  useEffect(() => {
    console.log("Cart Items: ", cartItems);
    console.log("setCartItems function: ", setCartItems);
  }, [cartItems, setCartItems]);

  const handlePlaceOrder = async () => {
    // Check if all fields are filled out
    if (!name || !phone || !address || !pincode || !paymentMethod) {
      setError("Please fill out all fields.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      const orderData = {
        customerDetails: { name, phone, address, pincode },
        cartItems,
        paymentMethod,
        userId,
      };

      // Log order data for debugging
      console.log("Order data being sent:", orderData);

      // Send the order data to the backend to save in the database
      const response = await axios.post("http://localhost:3003/orders", orderData);

      if (response.status === 201) {
        setCartItems([]); // Clear cart after placing order
        alert("Order placed successfully!");
      } else {
        alert("Something went wrong. Try again.");
      }
    } catch (error) {
      // Log error details for debugging
      console.error("Failed to place order:", error);
      alert(`Failed to place order. Error: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td><img src={item.imageUrl} alt={item.name} className="cart-item-image" /></td>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button onClick={() => removeItem(item._id)} className="remove-item-btn">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="order-form-container">
            <h2 className="order-form-title">Shipping Details</h2>
            <div className="form-inputs">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="input-field"
              />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="select-field"
              >
                <option value="">Select Payment Method</option>
                <option value="COD">Cash on Delivery</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="Online">Online Payment</option>
              </select>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="form-actions">
              <button onClick={handlePlaceOrder} className="place-order-btn">Place Order</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
