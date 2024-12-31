// App.js
import React,{useState,createContext} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Cart from "./components/Cart";
import ItemDetails from "./components/ItemDetails";
import GlassesTryOn from "./components/GlassesTryOn";
import Orders from "./components/Orders";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { DefaultProvider } from "./context/DefaultContext";

const App = () => {
  
  return (
  
    <DefaultProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/item/:id" element={<ProtectedRoute><ItemDetails /></ProtectedRoute>} />
          <Route path="/try-on/:imageUrl" element={<ProtectedRoute><GlassesTryOn /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/registration-form" element={<Register />} />
        </Routes>
      </Router>
    </DefaultProvider>
  
  );
};

export default App;
