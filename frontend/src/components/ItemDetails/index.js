import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import GlassesTryOn from "../GlassesTryOn";
import DefaultContext from "../../context/DefaultContext";
import "./index.css";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(DefaultContext);
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState(id);
  const [stopFaceDetection, setStopFaceDetection] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, itemResponse] = await Promise.all([
          axios.get("http://localhost:3003/getItem"),
          axios.get(`http://localhost:3003/getItem/${id}`),
        ]);
        setItems(itemsResponse.data);
        setItem(itemResponse.data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleItemSelect = (itemId) => {
    setSelectedItemId(itemId);
    setItem(items.find((item) => item._id === itemId));
  };

  const handleBuyNow = () => {
    addToCart(item);
    setStopFaceDetection((prev) => !prev);
    navigate("/cart");
  };

  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (!item) {
    return <p>Item not found</p>;
  }

  return (
    <div className="item-details-container">
      <div className="side-scroll">
        {items.map((sideItem) => (
          <div
            key={sideItem._id}
            className={`side-item ${selectedItemId === sideItem._id ? "highlighted" : ""}`}
            onClick={() => handleItemSelect(sideItem._id)}
          >
            <img src={sideItem.imageUrl} alt={sideItem.name} className="side-item-image" />
            <p className="side-item-name">{sideItem.name}</p>
          </div>
        ))}
      </div>
      
      <GlassesTryOn imageUrl={item.imageUrl} key={item._id} stopFaceDetection={stopFaceDetection} />
      
      <div className="btn-container">
        <button className="buy-now-button" onClick={handleBuyNow}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ItemDetails;
