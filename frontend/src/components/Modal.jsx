const Modal = ({ isOpen, onClose, children }) => {
    return (
      <div className={`modal-overlay ${isOpen ? 'modal-open' : ''}`}>
        {isOpen && (
          <div className="modal-content">
            <button className="modal-close-button" onClick={onClose}>
              Close
            </button>
            {children}
          </div>
        )}
      </div>
    );
  };
  
  export default Modal;