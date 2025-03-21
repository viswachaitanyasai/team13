import React, { useState, useEffect } from "react";

const CreateHackathon = ({ onClose }) => {
  const [hackathonName, setHackathonName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [fileAttachments, setFileAttachments] = useState(null);
  const [sponsors, setSponsors] = useState("");
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [dateError, setDateError] = useState("");

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  // Check if required fields are filled
  const isCreateDisabled = 
    hackathonName.trim() === "" || 
    description.trim() === "" || 
    dateError !== "";

  // Validate dates whenever either start date or deadline changes
  useEffect(() => {
    if (startDate && submissionDeadline) {
      const start = new Date(startDate);
      const deadline = new Date(submissionDeadline);
      
      if (deadline <= start) {
        setDateError("Submission deadline must be after the start date");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  }, [startDate, submissionDeadline]);

  const handleCancel = () => {
    setHackathonName("");
    setDescription("");
    setImage(null);
    setDuration("");
    setStartDate("");
    setSubmissionDeadline("");
    setFileAttachments(null);
    setSponsors("");
    setAllowMultiple(false);
    setDateError("");
    if (onClose) onClose();
  };

  const handleCreate = () => {
    // Implement your create functionality here
    console.log({
      hackathonName,
      description,
      image,
      duration,
      startDate,
      submissionDeadline,
      fileAttachments,
      sponsors,
      allowMultiple
    });
    
    // Close the modal after creating
    handleCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-4xl mx-auto rounded-lg shadow-lg p-6 relative my-8 max-h-[90vh] overflow-y-auto">
        {/* Professional Close Button */}
        <button 
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={handleCancel}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-gray-700">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 pb-2 border-b">Create Hackathon</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
          {/* Hackathon Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Hackathon Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter Hackathon name"
              value={hackathonName}
              onChange={(e) => setHackathonName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[80px]"
              placeholder="What is this hackathon about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <div className="flex items-center">
              <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Choose File</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => setImage(e.target.files[0])} 
                />
              </label>
              <span className="ml-3 text-sm text-gray-500">
                {image ? image.name : "No file chosen"}
              </span>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              placeholder="Enter duration (e.g., 48 hours)" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)} 
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <div className="relative">
              <input 
                type="date" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                min={today} // Disable dates before today
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submission Deadline */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Submission Deadline</label>
            <div className="relative">
              <input 
                type="date" 
                className={`w-full px-4 py-2 border ${dateError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                value={submissionDeadline} 
                onChange={(e) => setSubmissionDeadline(e.target.value)}
                min={startDate || today} // Disable dates before start date or today if no start date
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {dateError && <p className="text-red-500 text-xs mt-1">{dateError}</p>}
          </div>

          {/* File Attachments */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">File Attachments</label>
            <div className="flex items-center">
              <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span className="text-sm">Choose File</span>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => setFileAttachments(e.target.files[0])} 
                />
              </label>
              <span className="ml-3 text-sm text-gray-500">
                {fileAttachments ? fileAttachments.name : "No file chosen"}
              </span>
            </div>
          </div>

          {/* Sponsors */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sponsors</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              placeholder="Enter sponsor names" 
              value={sponsors} 
              onChange={(e) => setSponsors(e.target.value)} 
            />
          </div>
        </div>

        {/* Allow Multiple Submissions */}
        <div className="mt-6">
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              checked={allowMultiple} 
              onChange={(e) => setAllowMultiple(e.target.checked)} 
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-4 w-4" 
            />
            <span className="ml-2 text-sm text-gray-700">Allow Multiple Submissions</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
          <button 
            className="px-6 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            className={`px-6 py-2 rounded-md text-white ${isCreateDisabled ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} transition-colors`} 
            disabled={isCreateDisabled}
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateHackathon;