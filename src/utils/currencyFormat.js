export const formatIDR = (number) => {
  if (typeof number !== "number") {
    return "Invalid Input";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};
