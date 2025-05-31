import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Inventory({ inventoryItems, setInventoryItems }) {
  const [formData, setFormData] = useState({
    quantity: '',
    description: '',
    price: '',
    previousPrice: '',
  });

  const [editingItemId, setEditingItemId] = useState(null); // 👈 New state

  const totalAmount = () => {
    const q = parseFloat(formData.quantity);
    const p = parseFloat(formData.price);
    if (!isNaN(q) && !isNaN(p)) return (q * p).toFixed(2);
    return '0.00';
  };

  const handleDownloadPDF = (item) => {
    const doc = new jsPDF();

    doc.text('Inventory Item Report', 14, 15);

    doc.autoTable({
      head: [['Quantity', 'Description', 'Previous Price', 'Price', 'Total Amount']],
      body: [[
        item.quantity,
        item.description,
        item.previousPrice !== null ? item.previousPrice : '-',
        item.price,
        item.totalAmount.toFixed(2),
      ]],
      startY: 25,
    });

    doc.save(`${item.description}_Inventory.pdf`);
  };


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddOrUpdate = () => {
    if (!formData.quantity || !formData.description || !formData.price) {
      alert('Please fill all fields');
      return;
    }

    if (editingItemId !== null) {
      // 🔄 Update existing item
      const updatedItems = inventoryItems.map((item) =>
        item.id === editingItemId
          ? {
            ...item,
            quantity: parseInt(formData.quantity),
            description: formData.description,
            previousPrice: formData.price, // 👈 store old price
            price: parseFloat(formData.price),
            totalAmount: parseFloat(totalAmount()),
          }
          : item
      );
      setInventoryItems(updatedItems);
      setEditingItemId(null); // reset edit mode
    } else {
      // ➕ Add new item
      const existingIndex = inventoryItems.findIndex(
        (item) => item.description === formData.description
      );

      if (existingIndex >= 0) {
        const updatedItems = [...inventoryItems];
        updatedItems[existingIndex].quantity =
          parseInt(updatedItems[existingIndex].quantity) +
          parseInt(formData.quantity);
        setInventoryItems(updatedItems);
      } else {
        const newItem = {
          id: Date.now(),
          quantity: parseInt(formData.quantity),
          description: formData.description,
          price: parseFloat(formData.price),
          previousPrice: parseFloat(formData.previousPrice), // 👈 no previous price initially
          totalAmount: parseFloat(totalAmount()),
        };
        setInventoryItems([...inventoryItems, newItem]);
      }
    }

    setFormData({ quantity: '', description: '', price: '' });
  };

  const handleDelete = (id) => {
    setInventoryItems(inventoryItems.filter((item) => item.id !== id));
    if (editingItemId === id) {
      setEditingItemId(null);
      setFormData({ quantity: '', description: '', price: '', previousPrice: '' });
    }
  };

  const handleUpdate = (id) => {
    const itemToEdit = inventoryItems.find((item) => item.id === id);
    if (itemToEdit) {
      setFormData({
        quantity: itemToEdit.quantity.toString(),
        description: itemToEdit.description,
        price: itemToEdit.price.toString(),
      });
      setEditingItemId(id);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Inventory</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          style={{ marginRight: '10px', width: '250px' }}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          name="previousPrice"
          placeholder="Previous Price"
          value={formData.previousPrice}
          // readOnly
          onChange={handleChange}
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Total Amount"
          value={totalAmount()}
          readOnly
          style={{ marginRight: '10px', width: '120px', backgroundColor: '#f0f0f0' }}
        />
        <button onClick={handleAddOrUpdate}>
          {editingItemId !== null ? 'Update Item' : 'Add'}
        </button>
      </div>

      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        style={{ width: '100%', borderCollapse: 'collapse' }}
      >
        <thead>
          <tr style={{ backgroundColor: '#ddd' }}>
            <th>Quantity</th>
            <th>Description</th>
            <th>Previous Price</th>
            <th>Price</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No items added yet.
              </td>
            </tr>
          )}
          {inventoryItems.map(({ id, quantity, description, previousPrice, price, totalAmount }) => (
            <tr key={id}>
              <td>{quantity}</td>
              <td>{description}</td>
              <th>{previousPrice}</th>
              <td>{price}</td>
              <td>{totalAmount.toFixed(2)}</td>
              <td> 
                <button onClick={() => handleUpdate(id)} style={{ marginRight: '10px' }}>
                  Update
                </button>
                <button onClick={() => handleDelete(id)}>Delete</button>
              <button  style={{ marginRight: '10px' }} onClick={() => handleDownloadPDF({
                id, quantity, description, previousPrice, price, totalAmount
              })}>
                Download PDF
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
