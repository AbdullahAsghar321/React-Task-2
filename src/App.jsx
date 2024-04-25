import { useEffect, useState } from "react";
import "./App1.css";

function App() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [theme, setTheme] = useState("light"); // "light" or "dark"
  const [sortMethod, setSortMethod] = useState("id"); // "id", "name", "price"
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch("../products.json");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleDelete(id) {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
  }

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortMethod === "id") return a.id - b.id;
    if (sortMethod === "name") return a.name.localeCompare(b.name);
    if (sortMethod === "price") return a.price - b.price;
    return 0;
  });

  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className={`app ${theme}`}>
      <button onClick={toggleTheme} className="theme-button">
        Toggle {theme === "light" ? "Dark" : "Light"} Mode
      </button>

      <select onChange={(e) => setSortMethod(e.target.value)} className="sort-dropdown">
        <option value="id">Sort by ID</option>
        <option value="name">Sort by Name</option>
        <option value="price">Sort by Price</option>
      </select>

      {error && <div className="error">{error}</div>}

      <ul>
        {currentProducts.map((product) => (
          <li className="li" key={product.id}>
            <h1 className="Id">Product ID: {product.id}</h1>
            <h1>Product: {product.name}</h1>
            <h1>Brand: {product.brand}</h1>
            <h1>Category: {product.category}</h1>
            <h1>Price: ${product.price}</h1>
            <h1>{product.inStock ? "In Stock" : "Out of Stock"}</h1>

            <div className="button">
              <button onClick={() => handleDelete(product.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
          disabled={currentPage * productsPerPage >= products.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
