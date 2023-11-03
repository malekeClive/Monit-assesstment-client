import React from "react";

export default function Card({ title, children }) {
  return (
    <div className="shadow-lg rounded">
      <h1 className="text-2xl mb-6 bg-primary rounded-tl text-white inline-block pl-4 pr-10 py-3 font-medium">
        {title}
      </h1>
      {children}
    </div>
  );
}
