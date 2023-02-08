import React from "react";

export default function BaseLayout({ children }) {

  return (
    <div className="relative flex flex-col justify-center mt-8 p-12 overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl shadow-rose-600/40 ring ring-2 ring-purple-600 lg:max-w-xl">
        {children}
      </div>
    </div>
  );
}
