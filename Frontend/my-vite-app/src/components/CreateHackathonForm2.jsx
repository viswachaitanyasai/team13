import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateHackathonForm2 = () => {
    const navigate=useNavigate();
  const [hackathonName, setHackathonName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [fileAttachments, setFileAttachments] = useState(null);
//   const [sponsors, setSponsors] = useState("");
//   const [allowMultiple, setAllowMultiple] = useState(false);

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      hackathonName,
      description,
      image,
      duration,
      startDate,
      submissionDeadline,
      fileAttachments,
      sponsors,
      allowMultiple,
    };
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="min-h-screen w-full p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-7000">Choose Parameter</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 bg-white p-8 shadow-lg rounded-lg">
        {/* Hackathon Name */}
        <div className="space-y">
          <label className="block font-medium">Hackathon Name <span className="text-red-500">*</span></label>
          <input type="text" className="w-full p-3 border rounded-md" placeholder="Enter Hackathon name" value={hackathonName} onChange={(e) => setHackathonName(e.target.value)} required />
        </div>

        {/* Description */}
        <div className="space-y-2 col-span-2">
          <label className="block font-medium">Description <span className="text-red-500">*</span></label>
          <textarea className="w-full p-3 border rounded-md" placeholder="What is this hackathon about..." value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="space-y-2 col-span-2">
          <label className="block font-medium">Problem Statement <span className="text-red-500">*</span></label>
          <textarea className="w-full p-3 border rounded-md" placeholder="Give your Problem Statement" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="space-y-2 col-span-2">
          <label className="block font-medium">Context<span className="text-red-500">*</span></label>
          <textarea className="w-full p-3 border rounded-md" placeholder="What is this hackathon about..." value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Hackathon is for <span className="text-red-500">*</span></label>
          <select className="w-full p-3 border rounded-md" required>
            <option value="">Select</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="5th Year">5th Year</option>
            <option value="UG">Undergraduate (UG)</option>
            <option value="PG">Postgraduate (PG)</option>
          </select>
        </div>
        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block font-medium">Relevant Files(If Any)</label>
          <input type="file" onChange={(e) => handleFileChange(e, setImage)} className="p-2 border rounded-md" />
        </div>
        {/* Start Date */}
        <div className="space-y-2">
          <label className="block font-medium">Start Date</label>
          <input type="date" className="w-full p-3 border rounded-md" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        {/* Submission Deadline */}
        <div className="space-y-2">
          <label className="block font-medium">Submission Deadline</label>
          <input type="date" className="w-full p-3 border rounded-md" value={submissionDeadline} onChange={(e) => setSubmissionDeadline(e.target.value)} />
        </div>

        {/* File Attachments */}
        <div className="space-y-2">
          <label className="block font-medium">File Attachments</label>
          <input type="file" onChange={(e) => handleFileChange(e, setFileAttachments)} className="p-2 border rounded-md" />
        </div>

        {/* Sponsors */}
        {/* <div className="space-y-2">
          <label className="block font-medium">Sponsors</label>
          <input type="text" className="w-full p-3 border rounded-md" placeholder="Enter sponsor names" value={sponsors} onChange={(e) => setSponsors(e.target.value)} />
        </div> */}

       
        {/* Buttons */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button onClick={()=>navigate("/create-hackathon2")}  type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateHackathonForm2;