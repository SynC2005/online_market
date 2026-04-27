export const ALL_CATEGORIES_LABEL = "Semua";

export function getUniqueProductCategories(products) {
  const categories = products
    .map((product) => product.category)
    .filter(Boolean);

  return [ALL_CATEGORIES_LABEL, ...new Set(categories)];
}

export function formatProductPrice(price) {
  if (typeof price === "number") {
    return `$${price.toFixed(2)}`;
  }

  if (typeof price === "string" && price.trim()) {
    return price;
  }

  return "$0.00";
}

export function buildProductPayload(formData) {
  return {
    name: formData.name.trim(),
    category: formData.category.trim().toUpperCase(),
    price: formData.price.trim(),
    quantity: Number.parseInt(formData.quantity, 10),
    description: formData.description.trim(),
    image: formData.image.trim(),
  };
}

export function isProductFormComplete(formData) {
  return Boolean(
    formData.name &&
      formData.category &&
      formData.price &&
      formData.quantity &&
      formData.image,
  );
}

