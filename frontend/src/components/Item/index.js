import { useNavigate } from "react-router-dom";
import "./index.css";

const Item = ({ itemDetails }) => {
  const { name, price, imageUrl, isAvailable, _id } = itemDetails;
  const navigate = useNavigate();

  const viewItemDetails = () => {
    // Navigate to ItemDetails with the item's id as a URL parameter
    navigate(`/item/${_id}`);
  };

  return (
    <li className="item-card">
      <img src={imageUrl} alt={name} className="item-image" />
      <div className="item-info">
        <h1 className="item-name">{name}</h1>
        <div className="price-container">
          <span className="currency">₹</span>
          <span className="price">{price}</span>
        </div>
        <button
          type="button"
          className={`add-to-cart-button ${!isAvailable && "disabled"}`}
          onClick={isAvailable ? viewItemDetails : null}
          disabled={!isAvailable}
        >
          {isAvailable ? "Buy Now" : "Unavailable"}
        </button>
      </div>
    </li>
  );
};

export default Item;
