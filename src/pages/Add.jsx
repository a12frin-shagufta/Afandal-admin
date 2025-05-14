import React, { useState } from 'react';
import { FaCloudUploadAlt } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({ token, setToken }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestSeller] = useState(false);
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please log in as admin");
      navigate("/");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('bestseller', bestseller);
      formData.append('stock', stock);

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Add Product Response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message || "Product added successfully");
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
        setSizes([]);
        setBestSeller(false);
        setStock(0);
      } else {
        toast.success(response.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error);
      if (error.response?.status === 401) {
        toast.error("Unauthorized: Please log in again");
        setToken("");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        toast.error(error.response?.data?.message || "Failed to add product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img src={!image1 ? `assets/images/upload_area.png` : URL.createObjectURL(image1)} alt="" className='w-20' />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id='image1' hidden />
          </label>
          <label htmlFor="image2">
            <img src={!image2 ? `assets/images/upload_area.png` : URL.createObjectURL(image2)} alt="" className='w-20' />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id='image2' hidden />
          </label>
          <label htmlFor="image3">
            <img src={!image3 ? `assets/images/upload_area.png` : URL.createObjectURL(image3)} alt="" className='w-20' />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id='image3' hidden />
          </label>
          <label htmlFor="image4">
            <img src={!image4 ? `assets/images/upload_area.png` : URL.createObjectURL(image4)} alt="" className='w-20' />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id='image4' hidden />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className='mb-2'>Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 border rounded' type="text" placeholder='Type here' required />
      </div>

      <div className="w-full">
        <p className='mb-2'>Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 border rounded' placeholder='Write content here' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 border rounded sm:w-[120px]' type="number" placeholder='25' required />
        </div>

        <div>
          <p className='mb-2'>Stock Quantity</p>
          <input 
            onChange={(e) => setStock(e.target.value)} 
            value={stock} 
            className='w-full px-3 py-2 border rounded sm:w-[120px]' 
            type="number" 
            placeholder='0' 
            min="0"
            required
          />
        </div>
      </div>

      <div className='flex gap-3'>
        <p className='mb-2'>Product Sizes</p>
        <div onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"])}>
          <p className={`${sizes.includes("S") ? "bg-orange-300" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>S</p>
        </div>
        <div onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"])}>
          <p className={`${sizes.includes("M") ? "bg-orange-300" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>M</p>
        </div>
        <div onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"])}>
          <p className={`${sizes.includes("L") ? "bg-orange-300" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>L</p>
        </div>
        <div onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"])}>
          <p className={`${sizes.includes("XL") ? "bg-orange-300" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XL</p>
        </div>
        <div onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"])}>
          <p className={`${sizes.includes("XXL") ? "bg-orange-300" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XXL</p>
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input type="checkbox" id='bestseller' checked={bestseller} onChange={(e) => setBestSeller(prev => !prev)} />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button type='submit' disabled={loading} className={`w-28 py-3 mt-4 bg-gray-800 text-white rounded-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-400'}`}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default Add;

