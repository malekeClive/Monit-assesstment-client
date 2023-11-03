import React from "react";
import { useNavigate } from "react-router-dom";

export default function Back() {
  const navigate = useNavigate();
  return (
    <div className="mb-4">
      <button
        className="text-primary border-b-[1px] border-b-transparent hover:border-b-primary font-medium"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </div>
  );
}
