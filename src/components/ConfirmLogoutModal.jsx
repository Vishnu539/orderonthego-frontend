import "./ConfirmLogoutModal.css";

const ConfirmLogoutModal = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to log out?</p>

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;