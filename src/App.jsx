import React from "react";
import Interface from "./pages/Interface.jsx";
import Image from "./assets/imgs/pp4.webp";

const App = () => {
  return (
    <main className="w-full min-h-screen">
      {/* Option 1: Remove background image completely for cleaner look */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <Interface />
      </div>
    </main>
  );
};

export default App;