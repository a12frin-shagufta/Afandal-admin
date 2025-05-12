import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FcShipped } from 'react-icons/fc';

const Orders = ({ token, setToken }) => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const statusMap = {
    'Order Placed': 'pending',
    Packing: 'packing',
    'Out for Delivery': 'out for delivery',
    Delivered: 'delivered',
    Cancelled: 'cancelled',
  };

  const statusColors = {
    pending: 'bg-yellow-500',
    packing: 'bg-orange-500',
    'out for delivery': 'bg-blue-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
  };

  const fetchAllOrders = async () => {
    if (!token) {
      toast.error('Please log in as admin');
      navigate('/');
      return;
    }

    try {
      console.log('Fetching orders with token:', token); // Debug
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('API Response:', response.data);
      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        toast.error(response.data.message);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error);
      if (error.response?.status === 401) {
        toast.error('Unauthorized: Please log in again');
        if (typeof setToken === 'function') {
          setToken('');
          localStorage.removeItem('token');
        }
        navigate('/');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch orders');
        setOrders([]);
      }
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const status = statusMap[event.target.value] || event.target.value.toLowerCase();
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success('Status updated');
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error.response?.data || error);
      if (error.response?.status === 401) {
        toast.error('Unauthorized: Please log in again');
        if (typeof setToken === 'function') {
          setToken('');
          localStorage.removeItem('token');
        }
        navigate('/');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update status');
      }
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Admin Order Page</h3>
      {orders.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No orders found.</p>
      ) : (
        <div>
          {orders.map((order, index) => (
            <div
              key={`order-${index}`}
              style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '20px',
                marginBottom: '20px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <FcShipped size={32} style={{ marginRight: '10px' }} />
                <h4 style={{ margin: 0 }}>Order #{order._id}</h4>
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                <img
                  src={order.items[0]?.imageUrl || 'https://i.pinimg.com/736x/4f/11/e6/4f11e623f48c7cb463ea2f60deea1e40.jpg'}
                  alt={order.items[0]?.name || 'Order'}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
                  onError={(e) => (e.target.src = 'https://i.pinimg.com/736x/4f/11/e6/4f11e623f48c7cb463ea2f60deea1e40.jpg')}
                />
                <div>
                  {order.items.map((item, i) => (
                    <p key={`item-${i}`} style={{ margin: '5px 0' }}>
                      {item.name} x {item.quantity} <span>({item.size})</span>
                    </p>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <strong>Customer:</strong> {order.address.firstName} {order.address.lastName}
                <br />
                <strong>Address:</strong> {order.address.street}, {order.address.city},{' '}
                {order.address.state}, {order.address.country}, {order.address.zipcode}
                <br />
                <strong>Phone:</strong> {order.address.phone}
              </div>

              <div style={{ marginBottom: '10px' }}>
                <p>
                  <strong>Items:</strong> {order.items.length}
                </p>
                <p>
                  <strong>Method:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Payment:</strong> {order.payment ? 'Done ✅' : 'Pending ❌'}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}
                </p>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <strong>Total:</strong> {currency} {order.amount}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className='relative'>
                  <div
                    className={`w-3 h-3 rounded-full ${statusColors[order.status.toLowerCase()] || 'bg-gray-500'} animate-pulse`}
                  ></div>
                  <div
                    className={`w-3 h-3 rounded-full ${statusColors[order.status.toLowerCase()] || 'bg-gray-500'} absolute top-0 opacity-75 animate-ping`}
                  ></div>
                </div>
                <label>
                  <strong>Status:</strong>
                </label>
                <select
                  value={Object.keys(statusMap).find((key) => statusMap[key] === order.status.toLowerCase()) || order.status}
                  onChange={(event) => statusHandler(event, order._id)}
                  style={{
                    padding: '5px 10px',
                    marginLeft: '10px',
                    borderRadius: '5px',
                    border: '1px solid #aaa',
                  }}
                >
                  <option value='Order Placed'>Order Placed</option>
                  <option value='Packing'>Packing</option>
                  <option value='Out for Delivery'>Out for Delivery</option>
                  <option value='Delivered'>Delivered</option>
                  <option value='Cancelled'>Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { backendUrl, currency } from '../App';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { FcShipped } from 'react-icons/fc';

// const Orders = ({ token }) => {
//   const [orders, setOrders] = useState([]);

//   // Status mapping: frontend -> backend
//   const statusMap = {
//     'Order Placed': 'pending',
//     Packing: 'packing',
//     'Out for Delivery': 'out for delivery',
//     Delivered: 'delivered',
//     Cancelled: 'cancelled'
//   };

//   // Status colors
//   const statusColors = {
//     pending: 'bg-yellow-500',
//     packing: 'bg-orange-500',
//     'out for delivery': 'bg-blue-500',
//     delivered: 'bg-green-500',
//     cancelled: 'bg-red-500'
//   };

//   const fetchAllOrders = async () => {
//     if (!token) {
//       console.log("No token found, skipping order fetch");
//       toast.error("Please log in as admin");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${backendUrl}/api/order/list`,
//         {},
//         { headers: { token } }
//       );
//       console.log("API Response:", response.data);
//       if (response.data.success) {
//         setOrders(response.data.orders || []);
//       } else {
//         toast.error(response.data.message);
//         setOrders([]);
//       }
//     } catch (error) {
//       console.error("Error fetching orders:", error.response?.data || error.message);
//       toast.error(error.response?.data?.message || "Failed to fetch orders");
//       setOrders([]);
//     }
//   };

//   const statusHandler = async (event, orderId) => {
//     try {
//       const status = statusMap[event.target.value] || event.target.value.toLowerCase();
//       const response = await axios.post(
//         `${backendUrl}/api/order/status`,
//         { orderId, status },
//         { headers: { token } }
//       );
//       if (response.data.success) {
//         toast.success("Status updated");
//         await fetchAllOrders();
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error updating status:", error.response?.data || error.message);
//       toast.error(error.response?.data?.message || "Failed to update status");
//     }
//   };

//   useEffect(() => {
//     fetchAllOrders();
//   }, [token]);

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Admin Order Page</h3>
//       {orders.length === 0 ? (
//         <p style={{ textAlign: 'center', color: '#666' }}>No orders found.</p>
//       ) : (
//         <div>
//           {orders.map((order, index) => (
//             <div
//               key={`order-${index}`}
//               style={{
//                 border: '1px solid #ccc',
//                 borderRadius: '10px',
//                 padding: '20px',
//                 marginBottom: '20px',
//                 backgroundColor: '#f9f9f9',
//                 boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//               }}
//             >
//               <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//                 <FcShipped size={32} style={{ marginRight: '10px' }} />
//                 <h4 style={{ margin: 0 }}>Order #{order._id}</h4>
//               </div>

//               <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
//                 <img
//                   src={order.items[0]?.imageUrl || 'https://i.pinimg.com/736x/4f/11/e6/4f11e623f48c7cb463ea2f60deea1e40.jpg'}
//                   alt={order.items[0]?.name || 'Order'}
//                   style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
//                   onError={(e) => (e.target.src = 'https://i.pinimg.com/736x/4f/11/e6/4f11e623f48c7cb463ea2f60deea1e40.jpg')}
//                 />
//                 <div>
//                   {order.items.map((item, i) => (
//                     <p key={`item-${i}`} style={{ margin: '5px 0' }}>
//                       {item.name} x {item.quantity} <span>({item.size})</span>
//                     </p>
//                   ))}
//                 </div>
//               </div>

//               <div style={{ marginBottom: '10px' }}>
//                 <strong>Customer:</strong> {order.address.firstName} {order.address.lastName}
//                 <br />
//                 <strong>Address:</strong> {order.address.street}, {order.address.city},{' '}
//                 {order.address.state}, {order.address.country}, {order.address.zipcode}
//                 <br />
//                 <strong>Phone:</strong> {order.address.phone}
//               </div>

//               <div style={{ marginBottom: '10px' }}>
//                 <p>
//                   <strong>Items:</strong> {order.items.length}
//                 </p>
//                 <p>
//                   <strong>Method:</strong> {order.paymentMethod}
//                 </p>
//                 <p>
//                   <strong>Payment:</strong> {order.payment ? 'Done ✅' : 'Pending ❌'}
//                 </p>
//                 <p>
//                   <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}
//                 </p>
//               </div>

//               <div style={{ marginBottom: '10px' }}>
//                 <strong>Total:</strong> {currency} {order.amount}
//               </div>

//               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                 <div className="relative">
//                   <div
//                     className={`w-3 h-3 rounded-full ${statusColors[order.status.toLowerCase()]} animate-pulse`}
//                   ></div>
//                   <div
//                     className={`w-3 h-3 rounded-full ${statusColors[order.status.toLowerCase()]} absolute top-0 opacity-75 animate-ping`}
//                   ></div>
//                 </div>
//                 <label>
//                   <strong>Status:</strong>
//                 </label>
//                 <select
//                   value={Object.keys(statusMap).find(
//                     (key) => statusMap[key] === order.status.toLowerCase()
//                   ) || order.status}
//                   onChange={(event) => statusHandler(event, order._id)}
//                   style={{
//                     padding: '5px 10px',
//                     marginLeft: '10px',
//                     borderRadius: '5px',
//                     border: '1px solid #aaa',
//                   }}
//                 >
//                   <option value="Order Placed">Order Placed</option>
//                   <option value="Packing">Packing</option>
//                   <option value="Out for Delivery">Out for Delivery</option>
//                   <option value="Delivered">Delivered</option>
//                   <option value="Cancelled">Cancelled</option>
//                 </select>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;
