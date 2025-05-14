import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (isOtpMode && isOtpSent) {
        // Verify OTP
        const response = await axios.post(backendUrl + '/api/user/verify-otp', { email, otp });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Logged in successfully');
        } else {
          toast.error(response.data.message);
        }
      } else if (isOtpMode) {
        // Request OTP
        await axios.post(backendUrl + '/api/user/send-otp', { email });
        toast.success('OTP sent to your email');
        setIsOtpSent(true);
      } else {
        // Password-based login
        const response = await axios.post(backendUrl + '/api/user/admin', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Logged in successfully');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden p-8 transition-all duration-300 hover:shadow-lg"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <p
              style={{ fontFamily: 'var(--font-pacifico)' }}
              className="text-3xl text-gray-800 font-medium"
            >
              Admin panel
            </p>
            <hr className="border-none h-[3px] w-12 bg-orange-500 rounded-full" />
          </div>
          <h3 className="text-2xl font-serif font-light">
            <span className="text-orange-500 font-medium">AFANDAL| </span> Elevate Your Style
          </h3>
        </div>

        <div className="space-y-5">
          <input
            type="email"
            required
            className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />

          {isOtpMode ? (
            isOtpSent ? (
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
            ) : null
          ) : (
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          )}

          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 mt-6"
          >
            {isOtpMode ? (isOtpSent ? 'Verify OTP' : 'Send OTP') : 'Login'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOtpMode(!isOtpMode);
              setIsOtpSent(false);
              setOtp('');
              setPassword('');
            }}
            className="w-full text-orange-500 hover:text-orange-600 font-medium py-2"
          >
            {isOtpMode ? 'Switch to Password Login' : 'Login with OTP'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;


// import React, { useState } from 'react'
// import axios from 'axios'
// import { backendUrl } from '../App'
// import { toast } from 'react-toastify'

// const Login = ({setToken}) => {

//     const [email , setEmail] = useState('')
//     const [password , setPassword] = useState('')

    

//     const onSubmitHandler = async (e) => {
//       try{
//         e.preventDefault();
//        const response = await axios.post(backendUrl + '/api/user/admin',{email,password})
//        if(response.data.success){
//        setToken(response.data.token)
//        localStorage.setItem("adminToken", response.data.token) // Save it
//        } else{
//         toast.error(response.data.message)
//        }

//       } catch (error) {
//       console.log(error)
//       toast.error(error.message)
//       }
//     }
  
//   return (
//     <div className=" min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <form onSubmit={onSubmitHandler}
       
//         className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden p-8 transition-all duration-300 hover:shadow-lg"
//       >
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center gap-3 mb-4">
//             <p 
//               style={{ fontFamily: 'var(--font-pacifico)' }}  
//               className="text-3xl text-gray-800 font-medium"
//             >
//               Admin panel
//             </p>
//             <hr className='border-none h-[3px] w-12 bg-orange-500 rounded-full' />
//           </div>
//           <h3 className="text-2xl font-serif font-light">
//               <span className="text-orange-500 font-medium">  AFANDAL| </span>  Elevate Your Style
//             </h3>
//         </div>
        
//         <div className="space-y-5">
        
          
          
          
//           <input 
//             type="email" 
//             required  
//             className='w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all' 
//             placeholder='Email' 
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//           />
          
//           <input 
//             type="password" 
//             required  
//             className='w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all' 
//             placeholder='Password' 
//             onChange={(e) => setPassword(e.target.value)}
//             value={password}
//           />
          
        
          
//           <button 
//             type="submit"
//             className='w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 mt-6'
//           >
//            Login in 
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default Login