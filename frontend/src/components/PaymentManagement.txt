import  { useState } from 'react';
import { useCreateAdminPaymentMutation, useUpdateAdminPaymentMutation, useDeleteAdminPaymentMutation } from '../redux/index';

const AdminPaymentManagement = () => {
  const [createFormData, setCreateFormData] = useState({
    category: '',
    session: '',
    price: '',
    transactionReference: '',
  });

  const [updateFormData, setUpdateFormData] = useState({
    id: '', // The payment ID to update
    category: '',
    session: '',
    price: '',
    transactionReference: '',
  });

  const [deleteFormData, setDeleteFormData] = useState({
    id: '', // The payment ID to delete
  });

  const { mutate: createPayment } = useCreateAdminPaymentMutation();
  const { mutate: updatePayment } = useUpdateAdminPaymentMutation();
  const { mutate: deletePayment } = useDeleteAdminPaymentMutation();

  const handleCreatePayment = (e) => {
    e.preventDefault();
    createPayment(createFormData);
    // Clear the form data or show a success message
  };

  const handleUpdatePayment = (e) => {
    e.preventDefault();
    updatePayment(updateFormData);
    // Clear the form data or show a success message
  };

  const handleDeletePayment = (e) => {
    e.preventDefault();
    deletePayment(deleteFormData);
    // Clear the form data or show a success message
  };

  return (
    <div>
      <h2>Create Payment</h2>
      <form onSubmit={handleCreatePayment}>
        {/* Input fields for creating a payment */}
        <input
          type="text"
          placeholder="Category"
          value={createFormData.category}
          onChange={(e) => setCreateFormData({ ...createFormData, category: e.target.value })}
        />
        {/* Add similar input fields for session, price, and transaction reference */}
        <button type="submit">Create Payment</button>
      </form>

      <h2>Update Payment</h2>
      <form onSubmit={handleUpdatePayment}>
        {/* Input fields for updating a payment */}
        <input
          type="text"
          placeholder="Payment ID to update"
          value={updateFormData.id}
          onChange={(e) => setUpdateFormData({ ...updateFormData, id: e.target.value })}
        />
        {/* Add similar input fields for category, session, price, and transaction reference */}
        <button type="submit">Update Payment</button>
      </form>

      <h2>Delete Payment</h2>
      <form onSubmit={handleDeletePayment}>
        {/* Input field for deleting a payment by ID */}
        <input
          type="text"
          placeholder="Payment ID to delete"
          value={deleteFormData.id}
          onChange={(e) => setDeleteFormData({ ...deleteFormData, id: e.target.value })}
        />
        <button type="submit">Delete Payment</button>
      </form>
    </div>
  );
};

export default AdminPaymentManagement;
