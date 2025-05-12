import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendUrl, currency } from '../App';

const Offer = ({ token, setToken }) => {
  const [offerData, setOfferData] = useState({
    title: "",
    discountPercent: "",
    validTill: "",
    applicableProducts: [],
    applyToAllProducts: false,
  });
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOffersAndProducts = async () => {
      try {
        const [offersResponse, productsResponse] = await Promise.all([
          axios.get(`${backendUrl}/api/offer/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/api/product/list`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        const fetchedOffers = offersResponse.data.offers || [];
        setOffers(fetchedOffers);
  
        let productList = productsResponse.data.products || [];
  
        // Apply active offers
        const activeOffers = fetchedOffers.filter((offer) => new Date(offer.validTill) > new Date());
        productList = productList.map((product) => {
          let finalPrice = product.price;
          activeOffers.forEach((offer) => {
            if (
              offer.applyToAllProducts ||
              offer.applicableProducts.some((p) => p._id === product._id)
            ) {
              finalPrice = finalPrice * (1 - offer.discountPercent / 100);
            }
          });
          return { ...product, finalPrice: Math.round(finalPrice * 100) / 100 };
        });
  
        setProducts(productList);
      } catch (err) {
        const status = err.response?.status;
        if (status === 401) {
          setToken("");
          localStorage.removeItem("token");
          navigate("/");
          setError("Unauthorized. Please log in again.");
        } else {
          setError("Failed to fetch products or offers.");
        }
      }
    };
  
    if (token) fetchOffersAndProducts();
  }, [token, setToken, navigate]);
  
  
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/offer/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOffers(response.data.offers || []);
      } catch (err) {
        setError(err.response?.status === 401
          ? "Unauthorized: Please log in again to fetch offers"
          : err.response?.status === 404
          ? "Offer endpoint not found"
          : "Failed to fetch offers");
        if (err.response?.status === 401) {
          setToken("");
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };
    if (token) fetchOffers();
  }, [token, navigate, setToken]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOfferData({
      ...offerData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleProductChange = (e) => {
    if (offerData.applyToAllProducts) return;
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setOfferData({ ...offerData, applicableProducts: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      navigate("/");
      return;
    }
    try {
      const payload = {
        title: offerData.title,
        discountPercent: offerData.discountPercent,
        validTill: new Date(offerData.validTill).toISOString(),
        applyToAllProducts: offerData.applyToAllProducts,
        applicableProducts: offerData.applyToAllProducts ? [] : offerData.applicableProducts,
      };
      const response = await axios.post(`${backendUrl}/api/offer/add`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message);
      setOfferData({
        title: "",
        discountPercent: "",
        validTill: "",
        applicableProducts: [],
        applyToAllProducts: false,
      });

      const offersResponse = await axios.get(`${backendUrl}/api/offer/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers(offersResponse.data.offers || []);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Unauthorized: Please log in again");
        setToken("");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        setError(err.response?.data?.message || "Failed to add offer");
      }
    }
  };

  const handleDelete = async (id) => {
    setMessage("");
    setError("");
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      navigate("/");
      return;
    }
    try {
      const response = await axios.delete(`${backendUrl}/api/offer/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message);
      setOffers(offers.filter((offer) => offer._id !== id));
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Unauthorized: Please log in again");
        setToken("");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        setError(err.response?.data?.message || "Failed to delete offer");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Offers</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium">Offer Title</label>
          <input
            type="text"
            name="title"
            value={offerData.title}
            onChange={handleChange}
            placeholder="Enter offer title"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Discount (%)</label>
          <input
            type="number"
            name="discountPercent"
            value={offerData.discountPercent}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="1"
            max="100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Valid Till</label>
          <input
            type="date"
            name="validTill"
            value={offerData.validTill}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="applyToAllProducts"
              checked={offerData.applyToAllProducts}
              onChange={handleChange}
              className="h-4 w-4"
            />
            Apply to All Products
          </label>
        </div>

        {!offerData.applyToAllProducts && products.length > 0 && (
          <div>
            <label className="block text-sm font-medium">Applicable Products</label>
            <select
              multiple
              name="applicableProducts"
              value={offerData.applicableProducts}
              onChange={handleProductChange}
              className="w-full p-2 border rounded"
            >
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Offer
        </button>
      </form>

      {message && <p className="text-green-600 text-center mb-4">{message}</p>}
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <h3 className="text-xl font-semibold mb-4">Existing Offers</h3>
      {offers.length === 0 ? (
        <p className="text-gray-500">No offers available</p>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="p-4 border rounded flex justify-between items-center"
            >
              <div>
                <h4 className="font-medium">{offer.title}</h4>
                <p className="text-sm text-gray-600">
                  {offer.discountPercent}% off until {new Date(offer.validTill).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Applies to: {offer.applyToAllProducts
                    ? "All Products"
                    : offer.applicableProducts.map((p) => p.name).join(", ") || "None"}
                </p>
              </div>
              <button
                onClick={() => handleDelete(offer._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-xl font-semibold mt-10 mb-4">Product List (with Discounts)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="p-4 border rounded shadow">
            <h4 className="font-bold text-lg">{product.name}</h4>
            {product.finalPrice < product.price ? (
              <p className="text-sm text-green-600">
                <span className="line-through text-gray-500 mr-2">{currency}{product.price}</span>
                <span className="font-semibold">{currency}{product.finalPrice}</span>
              </p>
            ) : (
              <p className="text-sm text-gray-700">{currency}{product.price}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offer;

