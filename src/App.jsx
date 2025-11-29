import React from "react";
import Interface from "./pages/Interface.jsx";
import Image from "./assets/imgs/pp4.webp";

const App = () => {
  return (
    <main className=' w-[100%] h-fit  flex justify-center items-center '>
      <div className=' absolute inset-0 w-full h-full -z-10 '>
        <img
          src={Image}
          alt=''
          className='absolute inset-0 w-full h-[350vh] lg:h-full -z-10  '
        />
        <div className=' absolute inset-0 bg-black/85 w-full h-full '></div>
      </div>
      <Interface />
    </main>
  );
};

export default App;
