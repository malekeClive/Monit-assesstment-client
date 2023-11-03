import React from "react";

export default function Modal({ open, close, title, children }) {
  return (
    <>
      {open && (
        <div
          onClick={close}
          className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center bg-black bg-opacity-30"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white shadow-2xl rounded w-[50%] min-h-[30%]"
          >
            <button onClick={close} className="absolute right-4 top-2 text-lg">
              &#10006;
            </button>
            <h1 className="text-2xl mb-6 bg-primary rounded-tl text-white inline-block pl-4 pr-10 py-3 font-medium">
              {title}
            </h1>
            <div className="ml-6 mr-10">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
