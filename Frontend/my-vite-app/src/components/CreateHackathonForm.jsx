import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createHackathon } from "../apis/hackathonapi";
import { fileUpload } from "../apis/uploadAPi";

const CreateHackathonForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 State
  const [hackathonName, setHackathonName] = useState("");
  const [description, setDescription] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [context, setContext] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [startDate, setStartDate] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // Banner Image
  const [previewImage, setPreviewImage] = useState(null); // Preview for the image
  const [selectedFileAttachment, setSelectedFileAttachment] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(""); 
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [dateError, setDateError] = useState("");

  // Step 2 State
  const suggestedParameters = ["Innovation", "Complexity", "Technical Skill", "Presentation"];
  const [selectedParameters, setSelectedParameters] = useState([]);
  const [otherParameter, setOtherParameter] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [hackathonType, setHackathonType] = useState("Public");
  const [passKey, setPassKey] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // Validate dates whenever either start date or deadline changes
  useEffect(() => {
    if (startDate && submissionDeadline) {
      const start = new Date(startDate);
      const deadline = new Date(submissionDeadline);

      if (deadline < start) {
        toast.error("Submission deadline cannot be before the start date");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  }, [startDate, submissionDeadline]);

  const handleRemoveFile = () => {
    setSelectedFileAttachment(null);
    setUploadedFileName(""); 
    document.getElementById("fileUploadInput").value = "";
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setUploadedImageName("");
    document.getElementById("imageUploadInput").value = "";
  };
  

  const handleImageChange = async(e) => {
    const file = e.target.files[0];

    const fresponse = await fileUpload(file);
    console.log(fresponse);
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed.");
        return;
      }
  
      setSelectedImage(file);
      setUploadedImageName(file.name); 
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFileAttachment(file);
    setUploadedFileName(file.name);
  };


  const handleNextStep = (e) => {
    e.preventDefault();

    if (!hackathonName.trim()) {
      toast.error("Please fill out hackathon name");
      return;
    }
    if (!description.trim()) {
      toast.error("Please fill out description.");
      return;
    }
    if (!eligibility) {
      toast.error("Please mention eligibility.");
      return;
    }
    if (!startDate) {
      toast.error("Please specify start date.");
      return;
    }
    if (!submissionDeadline) {
      toast.error("Please specify end date.");
      return;
    }
    // if (!selectedImage) { 
    //   toast.error("Please upload a banner image.");
    //   return;
    // }
    if (dateError) {
      toast.error(dateError);
      return;
    }

    setStep(2);
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setShowOtherInput(true);
    } else if (!selectedParameters.includes(value) && value !== "") {
      setSelectedParameters([...selectedParameters, value]);
    }
  };

  const handleAddOtherParameter = () => {
    if (otherParameter.trim() !== "") {
      setSelectedParameters([...selectedParameters, otherParameter.trim()]);
      setOtherParameter("");
      setShowOtherInput(false);
    } else {
      toast.error("Please enter a parameter before adding.");
    }
  };

  const handleRemoveParameter = (param) => {
    setSelectedParameters(selectedParameters.filter((p) => p !== param));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("authToken");
    console.log("Token Retrieved:", token); 

    if (!token) {
      toast.error("Authentication error. Please log in again.");
      navigate("/login");
      setLoading(false); 
      return;
    }
    if (!selectedImage) {
      toast.error("Banner image is required to create a hackathon.");
      setLoading(false);
      return;
    }


    if (selectedParameters.length === 0) {
      toast.error("Please select at least one evaluation parameter.");
      setLoading(false);
      return;
    }

    if (hackathonType === "Private" && !passKey.trim()) {
      toast.error("Passkey is required for Private Hackathons.");
      return;
    }

    const formData = new FormData();
    formData.append("title", hackathonName);
    formData.append("description", description);
    formData.append("start_date", startDate);
    formData.append("end_date", submissionDeadline);
    formData.append("is_public", hackathonType === "Public");
    formData.append("passkey", hackathonType === "Private" ? passKey : "");
    formData.append("grade", eligibility);
    formData.append("judging_parameters", JSON.stringify(selectedParameters));
    // formData.append("additional_instructions", additionalInstructions);

  // **Appending Banner Image**
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

  // **Appending File Attachment**
    if (selectedFileAttachment) {
      formData.append("file_attachment", selectedFileAttachment);
    }

    try {
      const response = await createHackathon(formData, navigate);
      toast.success("Hackathon created successfully!");
      console.log("Hackathon Created:", response);
      navigate("/dashboard");
    } catch (error) {
      console.error("Hackathon Creation Error:", error);
      toast.error(error.error || "Failed to create hackathon.");
    } finally{
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen w-full p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        {step === 1 ? "Create a Hackathon" : "Select Hackathon Parameters"}
      </h2>
      {step === 1 ? (
        <form onSubmit={handleNextStep} className="grid grid-cols-2 gap-6 bg-white p-8 shadow-lg rounded-lg mb-20">
          {/* Hackathon Name */}
          <div className="space-y">
            <label className="block font-medium">
              Hackathon Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-md"
              placeholder="Enter Hackathon name"
              value={hackathonName}
              onChange={(e) => setHackathonName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2 col-span-2">
            <label className="block font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-3 border rounded-md"
              placeholder="What is this hackathon about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="block font-medium">
              Problem Statement <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-3 border rounded-md"
              placeholder="Give your Problem Statement"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label className="block font-medium">
              Context<span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-3 border rounded-md"
              placeholder="What is this hackathon about..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">
              Hackathon Eligibility<span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-3 border rounded-md"
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
            >
              <option value="">Select</option>
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="3rd">3rd</option>
              <option value="4th">4th</option>
              <option value="5th">5th</option>
              <option value="6th">6th</option>
              <option value="7th">7th</option>
              <option value="8th">8th</option>
              <option value="9th">9th</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
              <option value="UG">Undergraduate (UG)</option>
              <option value="PG">Postgraduate (PG)</option>
            </select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
  <label className="block font-medium">Relevant Files (If Any)</label>
  <input
    type="file"
    id="fileUploadInput"
    onChange={handleFileChange}
    className="p-2 border rounded-md"
  />
  {uploadedFileName && (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-gray-700">{uploadedFileName}</span>
      <button
        onClick={handleRemoveFile}
        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
      >
        Remove
      </button>
    </div>
  )}
</div>



<div className="space-y-2 col-span-2">
  <label className="block font-medium">Upload Banner (Image Files Only)</label>
  <input
    type="file"
    accept="image/*"
    id="imageUploadInput"
    onChange={handleImageChange}
    className="p-2 border rounded-md"
  />

  {/* Show Preview & Remove Button */}
  {previewImage && (
    <div className="mt-2 flex items-center gap-4">
      <img src={previewImage} alt="Preview" className="w-40 h-auto rounded-md border" />
      <button
        onClick={handleRemoveImage}
        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
      >
        Remove
      </button>
    </div>
  )}
</div>





          {/* Start Date */}
          <div className="space-y-2">
            <label className="block font-medium">
              Start Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full p-3 border rounded-md"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={today}
            />
          </div>

          {/* Submission Deadline */}
          <div className="space-y-2">
            <label className="block font-medium">
              Submission Deadline<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full p-3 border rounded-md"
              value={submissionDeadline}
              onChange={(e) => setSubmissionDeadline(e.target.value)}
              min={startDate || today}
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next Step
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 bg-white p-8 shadow-lg rounded-lg">
          {/* Hackathon Type Toggle */}
          <div className="space-y-2 col-span-2">
            <label className="block font-medium">Hackathon Type</label>
            <div className="flex items-center gap-3">
              <span>Public</span>
              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={hackathonType === "Private"}
                  onChange={() =>
                    setHackathonType(hackathonType === "Public" ? "Private" : "Public")
                  }
                />
                <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-7 after:content-[''] after:absolute after:w-6 after:h-6 after:bg-white after:rounded-full after:transition-all"></div>
              </label>
              <span>Private</span>
            </div>
          </div>

          {/* Passkey Input for Private Hackathon */}
          {hackathonType === "Private" && (
            <div className="space-y-2 col-span-2">
              <label className="block font-medium">Enter Passkey</label>
              <input
                type="password"
                className="w-full p-3 border rounded-md"
                placeholder="Enter passkey"
                value={passKey}
                onChange={(e) => setPassKey(e.target.value)}
                required
              />
            </div>
          )}

          {/* Select Parameters */}
          <div className="space-y-2 col-span-2">
            <label className="block font-medium">Select Parameters</label>
            <select
              className="w-full p-3 border rounded-md"
              onChange={handleSelectChange}
              defaultValue=""
            >
              <option value="" disabled selected>
                Choose a parameter
              </option>
              {suggestedParameters.map((param, index) => (
                <option key={index} value={param}>
                  {param}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Input for Other Parameter */}
          {showOtherInput && (
            <div className="flex gap-2 col-span-2">
              <input
                type="text"
                className="w-full p-3 border rounded-md"
                placeholder="Specify other parameter"
                value={otherParameter}
                onChange={(e) => setOtherParameter(e.target.value)}
              />
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleAddOtherParameter}
              >
                Add
              </button>
            </div>
          )}

          {/* Display Selected Parameters */}
          {selectedParameters.length > 0 && (
            <div className="col-span-2">
              <h3 className="font-medium">Selected Parameters:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedParameters.map((param, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-gray-200 rounded-md flex items-center"
                  >
                    {param}
                    <button
                      type="button"
                      className="ml-2 text-red-500"
                      onClick={() => handleRemoveParameter(param)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 col-span-2">
            <label className="block font-medium">
              Additional Instructions (Optional)
            </label>
            <textarea
              className="w-full p-3 border rounded-md"
              placeholder="Enter any additional details..."
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Previous Page
            </button>
            <button
              type="submit"
              className={`px-6 py-3 rounded-md text-white ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateHackathonForm;