import React, { useState, useEffect } from 'react';

export default function Sales({ salesItems, setSalesItems, inventoryItems, setInventoryItems }) {
  const [formData, setFormData] = useState({
    description: '',
    quantity: '',
    price: '',
  });

  // Automatically set price when description changes
  useEffect(() => {
    const item = inventoryItems.find((i) => i.description === formData.description);
    if (item) {
      setFormData((prev) => ({ ...prev, price: item.price.toString() }));
    } else {
      setFormData((prev) => ({ ...prev, price: '' }));
    }
  }, [formData.description, inventoryItems]);

  const totalAmount = () => {
    const q = parseInt(formData.quantity);
    const p = parseFloat(formData.price);
    if (!isNaN(q) && !isNaN(p)) return (q * p).toFixed(2);
    return '0.00';
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSale = () => {
    if (!formData.quantity || !formData.description || !formData.price) {
      alert('Please fill all fields');
      return;
    }

    const quantityToSell = parseInt(formData.quantity);
    const itemIndex = inventoryItems.findIndex((i) => i.description === formData.description);

    if (itemIndex === -1) {
      alert('Item not found in inventory');
      return;
    }

    if (inventoryItems[itemIndex].quantity < quantityToSell) {
      alert('Not enough quantity in inventory');
      return;
    }

    // Deduct quantity from inventory
    const updatedInventory = [...inventoryItems];
    updatedInventory[itemIndex].quantity -= quantityToSell;
    setInventoryItems(updatedInventory);

    // Add to sales list
    const newSale = {
      id: Date.now(),
      description: formData.description,
      quantity: quantityToSell,
      price: parseFloat(formData.price),
      totalAmount: parseFloat(totalAmount()),
    };

    setSalesItems([...salesItems, newSale]);

    setFormData({ description: '', quantity: '', price: '' });
  };

  const handleDeleteSale = (id) => {
    const saleToRemove = salesItems.find((sale) => sale.id === id);
    if (!saleToRemove) return;

    // Add back quantity to inventory
    const inventoryIndex = inventoryItems.findIndex(
      (item) => item.description === saleToRemove.description
    );
    if (inventoryIndex >= 0) {
      const updatedInventory = [...inventoryItems];
      updatedInventory[inventoryIndex].quantity += saleToRemove.quantity;
      setInventoryItems(updatedInventory);
    }

    setSalesItems(salesItems.filter((sale) => sale.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Sales</h2>

      <div style={{ marginBottom: '20px' }}>
        <select
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={{ marginRight: '10px', width: '250px' }}
        >
          <option value="">Select Item</option>
          {inventoryItems.map((item) => (
            <option key={item.id} value={item.description}>
              {item.description} (Available: {item.quantity})
            </option>
          ))}
        </select>
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          style={{ marginRight: '10px', width: '80px' }}
          min="1"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          readOnly
          style={{ marginRight: '10px', width: '80px', backgroundColor: '#f0f0f0' }}
        />
        <input
          type="text"
          placeholder="Total Amount"
          value={totalAmount()}
          readOnly
          style={{ marginRight: '10px', width: '120px', backgroundColor: '#f0f0f0' }}
        />
        <button onClick={handleAddSale}>Add Sale</button>
      </div>

      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#ddd' }}>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salesItems.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No sales added yet.
              </td>
            </tr>
          ) : (
            salesItems.map(({ id, description, quantity, price, totalAmount }) => (
              <tr key={id}>
                <td>{description}</td>
                <td>{quantity}</td>
                <td>{price.toFixed(2)}</td>
                <td>{totalAmount.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleDeleteSale(id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
