import React, { useState, useEffect } from "react";
import { products } from "./products";

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [myList, setMyList] = useState([]);
  const [isListVisible, setIsListVisible] = useState(false);

  const handleSearch = () => {
    const searchTermLower = searchTerm.toLowerCase().trim();
    if (!searchTermLower) {
      setResults(products);
      return;
    }
    const filteredResults = products.filter(product =>
      product.name.toLowerCase().includes(searchTermLower)
    );
    setResults(filteredResults);
  };

  const handleAddToList = (product) => {
    setMyList([...myList, product]);
  };

  const handleRemoveFromList = (product) => {
    setMyList(myList.filter(item => item !== product));
  };

  useEffect(() => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    setResults(shuffled.slice(0, 5));
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-6 text-center">Store Price Search</h1>
      <div className="flex items-center space-x-2 mb-6">
        <input
          type="text"
          placeholder="Buscar un producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="p-3 bg-black text-white font-bold rounded-r-lg hover:bg-gray-800 hover:text-white transition-colors"
        >
          Buscar
        </button>
      </div>
      {results.length > 0 ? (
        <ul className="bg-white rounded-lg shadow divide-y divide-gray-">
          {results.map((product, index) => (
            <li
              key={index}
              className="p-3 hover:bg-blue-100 transition-colors flex justify-between items-center"
            >
              {product.name} - ${product.price}
              <button
                onClick={() => handleAddToList(product)}
                className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Agregar a lista
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No se encontraron productos</p>
      )}

      <button
        onClick={() => setIsListVisible(!isListVisible)}
        className="mt-4 p-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition-colors"
      >
        {isListVisible ? "Ocultar la lista" : "Ver mi lista"}
      </button>

      {isListVisible && (
        <div className="mt-4">
          <ul className="bg-white rounded-lg shadow divide-y divide-gray-200">
            {myList.length > 0 ? (
              myList.map((item, idx) => (
                <li key={idx} className="p-3 hover:bg-blue-100 transition-colors flex justify-between items-center">
                  {item.name} - ${item.price}
                  <button
                    onClick={() => handleRemoveFromList(item)}
                    className="ml-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Quitar
                  </button>
                </li>
              ))
            ) : (
              <li className="p-3 text-gray-500">Lista vacía</li>
            )}
          </ul>
          <div className="p-3 font-bold">
            Total: $
            {myList.reduce((acc, item) => acc + item.price, 0).toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
