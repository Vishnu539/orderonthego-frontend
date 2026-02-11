import { useState } from "react";
import { addProduct } from "../../api/restaurant.api";

const AddProduct = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) return alert("Image is required");

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", form.name);
      data.append("price", form.price);
      data.append("category", form.category);
      data.append("image", form.image);

      await addProduct(data);

      // ✅ RESET FORM
      setForm({
        name: "",
        price: "",
        category: "",
        image: null,
      });

      e.target.reset(); // clears file input

      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      {/* SECTION 1 */}
      <div className="form-group">
        <label>Product Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Chicken Biryani"
          required
        />
      </div>

      {/* SECTION 2 */}
      <div className="form-row">
        <div className="form-group">
          <label>Price</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="₹"
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Main course"
            required
          />
        </div>
      </div>

      {/* SECTION 3 */}
      <div className="form-group">
        <label>Product Image</label>
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </div>

      {/* ACTION */}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProduct;