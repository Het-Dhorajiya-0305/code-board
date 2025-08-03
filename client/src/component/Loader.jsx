import React from 'react'
import {ClipLoader}  from 'react-spinners';

function Loader() {
  return (
    <div className='absolute flex items-center justify-center bg-gray-400 opacity-50 top-0 w-full h-full left-0 rounded-lg'><ClipLoader size={25} ></ClipLoader></div>
  )
}

export default Loader