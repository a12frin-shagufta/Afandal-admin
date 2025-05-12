// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { backendUrl, currency } from '../App';
// import { toast } from 'react-toastify';

// const List = ({token,setToken}) => {

//   const [list, setList] = useState([]);

//   const fetchList = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/api/product/list`);
//       if (response.data.success) {
//         setList(response.data.product);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message || 'Failed to fetch product list');
//     }
//   };


// const removeProduct = async (id) => {
//    try{
//     const response = await axios.post(backendUrl + '/api/product/remove',{id} , {headers:{token}});
//     if(response.data.success){
//      toast.success(response.data.message)
//      await fetchList()
//     } else{
//         toast.error(response.data.message)
//     }
//    } catch (error){
//     console.log(error);
//     toast.error(error.message);
//    }
// }



//   useEffect(() => {
//     fetchList();
//   }, []);

//   return (
//     <>
//       <p className='mb-4 text-2xl font-semibold text-gray-800'>All Products List</p>

//       <div className='overflow-x-auto'>
//         <div className='flex flex-col gap-4'>
//           {/* Table Header */}
//           <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-4 bg-gray-100 text-sm font-semibold text-gray-600'>
//             <span>Image</span>
//             <span>Name</span>
//             <span>Price</span>
//             <span>Stock</span>
//             <span className='text-center'>Action</span>
//           </div>

//           {/* Product List */}
//           {list.length > 0 ? (
//             list.map((item, index) => (
//               <div
//                 key={index}
//                 className='grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-4 py-4 px-4 border-b border-gray-200 bg-white shadow-sm rounded-lg hover:bg-gray-50 transition-all'
//               >
//                 <div className='flex justify-center md:justify-start'>
//                   <img
//                     src={item.image[0]}
//                     alt={item.name}
//                     className='h-16 w-16 object-cover rounded-md shadow-md'
//                   />
//                 </div>

//                 <p className='text-lg font-medium text-gray-800'>{item.name}</p>
//                 <p className='text-gray-700'>{currency}{item.price}.00</p>
//                 <p className='text-gray-600'>{item.stock}</p>
//                 <div onClick={() => removeProduct(item._id)} className='text-center text-black font-semibold cursor-pointer hover:text-red-700'>
//                   X
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className='text-center py-4 text-gray-500'>No products found.</p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default List;
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token, setToken }) => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      console.log("Fetch List Response:", response.data);
      if (response.data.success) {
        setList(response.data.product);
        // toast.success(response.data.message); // Removed to avoid unnecessary toast
      } else {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to fetch product list');
    }
  };

  const removeProduct = async (id) => {
    if (!token) {
      toast.error("Please log in as admin");
      navigate("/");
      return;
    }

    try {
      console.log("Removing Product ID:", id);
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Remove Product Response:", response.data);
      if (response.data.success) {
        toast.success(response.data.message || "Product removed successfully");
        await fetchList();
      } else {
        toast.error(response.data.message || "Failed to remove product");
      }
    } catch (error) {
      console.error("Error removing product:", error.response?.data || error);
      if (error.response?.status === 401) {
        toast.error("Unauthorized: Please log in again");
        setToken("");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        toast.error(error.response?.data?.message || "Failed to remove product");
      }
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className='mb-4 text-2xl font-semibold text-gray-800'>All Products List</p>

      <div className='overflow-x-auto'>
        <div className='flex flex-col gap-4'>
          {/* Table Header */}
          <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-4 bg-gray-100 text-sm font-semibold text-gray-600'>
            <span>Image</span>
            <span>Name</span>
            <span>Price</span>
            <span>Stock</span>
            <span className='text-center'>Action</span>
          </div>

          {/* Product List */}
          {list.length > 0 ? (
            list.map((item, index) => (
              <div
                key={index}
                className='grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-4 py-4 px-4 border-b border-gray-200 bg-white shadow-sm rounded-lg hover:bg-gray-50 transition-all'
              >
                <div className='flex justify-center md:justify-start'>
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className='h-16 w-16 object-cover rounded-md shadow-md'
                    onError={(e) => (e.target.src = '/placeholder.jpg')}
                  />
                </div>

                <p className='text-lg font-medium text-gray-800'>{item.name}</p>
                <p className='text-gray-700'>{currency}{item.price}.00</p>
                <p className='text-gray-600'>{item.stock}</p>
                <div
                  onClick={() => removeProduct(item._id)}
                  className='text-center text-black font-semibold cursor-pointer hover:text-red-700'
                >
                  X
                </div>
              </div>
            ))
          ) : (
            <p className='text-center py-4 text-gray-500'>No products found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default List;