import React from 'react';

const Navbar = ({ setToken }) => {
  return (
    <nav className="bg-white shadow-sm w-full sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 sm:px-6">
        {/* Logo with hover effect */}
        <div className="flex items-center">
          <img
            src="/assets/images/afandal.png"
            alt="Company Logo"
            className="h-12 w-auto"
          />
        </div>

        {/* Logout button with better styling and hover states */}
        <button
          onClick={() => {
            setToken('');
            localStorage.removeItem('token');
          }}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;




















// import React from 'react'

// const Navbar = ({setToken}) => {
//   return (
//     <nav className='bg-white shadow-sm w-full sticky top-0 z-50'>
//       <div className='container mx-auto flex items-center justify-between py-3 px-4 sm:px-6'>
//         {/* Logo with hover effect */}
//         <div className='flex items-center'>
//           <img 
//             src="/assets/images/afandal.png" 
//             alt="Company Logo" 
//             className='h-12 w-auto' 
//           />
//         </div>

//         {/* Logout button with better styling and hover states */}
//         <button onClick={() => setToken('')}className='bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 ' >
//           Logout
//         </button>
//       </div>
//     </nav>
//   )
// }

// export default Navbar