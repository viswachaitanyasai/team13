import React from "react";

const HackathonModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
//   const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default HackathonModal;
