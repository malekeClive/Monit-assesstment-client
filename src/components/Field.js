import React from "react";

export default function Field({ labelName, children }) {
  return (
    <fieldset className="flex items-center justify-between">
      <label className="flex-1">{labelName}</label>
      <div className="flex-[3]">{children}</div>
    </fieldset>
  );
}
