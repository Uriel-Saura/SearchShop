import React, { useState, useEffect } from "react";
import { products } from "./products";
import jsPDF from "jspdf";

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [myList, setMyList] = useState([]);
  const [isListVisible, setIsListVisible] = useState(false);

  const handleSearch = () => {
    const searchTermLower = searchTerm.toLowerCase().trim();
    if (!searchTermLower) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setResults(shuffled.slice(0, 5));
      return;
    }
    const filteredResults = products.filter(product =>
      product.name.toLowerCase().includes(searchTermLower)
    );
    setResults(filteredResults);
  };

  const handleAddToList = (product) => {
    const existingItem = myList.find((item) => item.name === product.name);
    if (existingItem) {
      setMyList(
        myList.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setMyList([...myList, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveFromList = (product) => {
    setMyList(myList.filter(item => item !== product));
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const dateString = currentDate.toLocaleString();

    doc.setFontSize(16);
    doc.text(`Lista de productos (descargada el: ${dateString})`, 10, 10);

    let startY = 30;
    doc.setFontSize(12);
    doc.text('No.', 10, startY);
    doc.text('Producto', 30, startY);
    doc.text('Precio', 150, startY);

    startY += 10;
    myList.forEach((item, index) => {
      doc.text(String(index + 1), 10, startY);
      doc.text(item.name, 30, startY);
      doc.text(`$${item.price.toFixed(2)}`, 150, startY);
      startY += 10;
    });

    // Agregar total
    const total = myList.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
    doc.text(`Total: $${total}`, 10, startY + 10);

    // Guardar PDF con fecha
    const formattedDate = currentDate.toISOString().split('T')[0];
    doc.save(`Venta_${formattedDate}.pdf`);
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
                Agregar
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

      {/* Botón para descargar en PDF */}
      <button
        onClick={handleDownloadPDF}
        className="mt-4 ml-2 p-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-colors"
      >
        Descargar PDF
      </button>

      {isListVisible && (
        <div className="mt-4">
          <ul className="bg-white rounded-lg shadow divide-y divide-gray-200">
            {myList.length > 0 ? (
              myList.map((item, idx) => (
                <li key={idx} className="p-3 hover:bg-blue-100 transition-colors flex justify-between items-center">
                  {item.name} - ${item.price} x {item.quantity}
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
            {myList.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
