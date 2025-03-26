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
  const [imageUrl, setImageUrl] = useState(""); // Stores S3 URL of uploaded image
  const [fileUrl, setFileUrl] = useState("");
  const [sponsors, setSponsors] = useState([]);
  const [sponsorInput, setSponsorInput] = useState("");
  const [allowMultipleSolutions, setAllowMultipleSolutions] = useState(false);

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
    setFileUrl("");
    setSelectedFileAttachment(null);
    setUploadedFileName(""); 
    document.getElementById("fileUploadInput").value = "";
  };

  const handleRemoveImage = () => {
    setImageUrl(""); // ✅ **Clear S3 image URL**
    setPreviewImage(null);
    setUploadedImageName("");
    document.getElementById("imageUploadInput").value = "";
  };
  

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
  
    if (!file) return;
  
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }
    setUploadedImageName(file.name);
    // **Show preview before upload**
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result); // Set preview image
    };
    reader.readAsDataURL(file);
  
    // **Upload Image to S3**
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (imageUrl) {
        await removeFileFromS3(imageUrl);
      }
      const response = await fileUpload(formData); // Upload to S3
      console.log(response);
  
      const uploadedUrl = response?.imageUrl || response?.fileUrl; // Handle both cases
      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
        setPreviewImage(URL.createObjectURL(file));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed.");
      }
    } catch (error) {
      console.error("Image Upload Error:", error);
      toast.error("Image upload failed.");
    }
  };
  

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
  
    if (!file) return;
  
    setUploadedFileName(file.name); // Show file name before upload
  
    // **Upload File to S3**
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (fileUrl) {
        await removeFileFromS3(fileUrl);
      }
  
      const response = await fileUpload(formData); // Upload file to S3
  
      if (response?.fileUrl) {
        setFileUrl(response.fileUrl); // Store S3 URL instead of file
        toast.success("File uploaded successfully!");
      } else {
        toast.error("File upload failed.");
      }
    } catch (error) {
      console.error("File Upload Error:", error);
      toast.error("File upload failed.");
    }
  };
  const handleAddSponsor = () => {
    if (sponsorInput.trim()) {
      setSponsors([...sponsors, sponsorInput.trim()]);
      setSponsorInput("");
    }
  };
  
  // Function to remove a sponsor
  const handleRemoveSponsor = (index) => {
    setSponsors(sponsors.filter((_, i) => i !== index));
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
    if (!imageUrl) {
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

    try {
      // **Upload Image to S3**
      // let imageUrl = "";
      // if (selectedImage) {
      //   const imageFormData = new FormData();
      //   imageFormData.append("file", selectedImage);
      //   const imageResponse = await fileUpload(imageFormData);
  
      //   if (imageResponse?.fileUrl) {
      //     imageUrl = imageResponse.fileUrl;
      //   } else {
      //     throw new Error("Failed to upload banner image.");
      //   }
      // }
  
      // // **Upload File Attachment to S3**
      // let fileUrl = "";
      // if (selectedFileAttachment) {
      //   const fileFormData = new FormData();
      //   fileFormData.append("file", selectedFileAttachment);
      //   const fileResponse = await fileUpload(fileFormData);
  
      //   if (fileResponse?.fileUrl) {
      //     fileUrl = fileResponse.fileUrl;
      //   } else {
      //     throw new Error("Failed to upload file attachment.");
      //   }
      // }
      const formData = {
        title: hackathonName,
        description,
        context: context,
        problem_statement: problemStatement,
        start_date: startDate,
        end_date: submissionDeadline,
        is_public: hackathonType === "Public",
        passkey: hackathonType === "Private" ? passKey : "",
        grade: eligibility,
        judging_parameters: selectedParameters,
        image_url: imageUrl, // ✅ S3 URL
        file_attachment_url: fileUrl, // ✅ S3 URL
        custom_prompt: additionalInstructions,
        sponsors, // ✅ Sending sponsors as an array
        allow_multiple_solutions: allowMultipleSolutions,
      };
      console.log(formData);
      const response = await createHackathon(formData, navigate);
      if (response?.hackathon?._id) { // ✅ **Check if Hackathon ID exists in response**
        toast.success("Hackathon created successfully!");
        console.log("Hackathon Created:", response);
        navigate(`/hackathon/${response.hackathon._id}`); // ✅ **Redirect to View Hackathon**
      } else {
        throw new Error("Hackathon ID not found in response.");
      }
    } catch (error) {
      // console.log(response);
      console.error("Hackathon Creation Error:", error);
      toast.error(error.error || "Failed to create hackathon.");
    } finally{
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {step === 1 ? "Create a Hackathon" : "Configure Evaluation"}
          </h2>
          <div className="flex justify-center">
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
              <div 
                className={`bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`}
              ></div>
            </div>
          </div>
        </div>
  
        {/* Form Content */}
        {step === 1 ? (
          <form onSubmit={handleNextStep} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hackathon Name */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Hackathon Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter Hackathon name"
                  value={hackathonName}
                  onChange={(e) => setHackathonName(e.target.value)}
                  required
                />
              </div>
  
              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]"
                  placeholder="What is this hackathon about..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
  
              {/* Problem Statement */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Problem Statement <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]"
                  placeholder="Describe the problem participants will solve..."
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  required
                />
              </div>
  
              {/* Context */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Context <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]"
                  placeholder="Provide background information..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  required
                />
              </div>
  
              {/* Eligibility */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Eligibility <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  required
                >
                  <option value="">Select eligibility</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i+1} value={`${i+1}th`}>{i+1}{getOrdinalSuffix(i+1)} Grade</option>
                  ))}
                  <option value="UG">Undergraduate (UG)</option>
                  <option value="PG">Postgraduate (PG)</option>
                </select>
              </div>
  
              {/* File Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Relevant Files
                </label>
                <div className="flex items-center gap-2">
                  <label 
                    htmlFor="fileUploadInput"
                    className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors"
                  >
                    <span>Choose File</span>
                    <input
                      type="file"
                      id="fileUploadInput"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {fileUrl && (
                    <div className="flex items-center gap-2">
                      <a 
                        href={fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline text-sm truncate max-w-[120px]"
                        title={uploadedFileName}
                      >
                        {uploadedFileName}
                      </a>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-red-500 hover:text-red-700"
                        title="Remove file"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
  
              {/* Banner Upload */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Banner (Image)
                </label>
                <div className="flex flex-col gap-3">
                  <label 
                    htmlFor="imageUploadInput"
                    className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors w-fit"
                  >
                    <span>Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      id="imageUploadInput"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imageUrl && (
                    <div className="flex items-start gap-4">
                      <img 
                        src={imageUrl} 
                        alt="Banner preview" 
                        className="w-full max-w-xs h-auto rounded-lg border border-gray-200" 
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-red-500 hover:text-red-700 mt-2"
                        title="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
  
              {/* Dates */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={today}
                  required
                />
              </div>
  
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Submission Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={submissionDeadline}
                  onChange={(e) => setSubmissionDeadline(e.target.value)}
                  min={startDate || today}
                  required
                />
              </div>
            </div>
  
            {/* Navigation */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center"
              >
                Continue to Parameters
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hackathon Type Toggle */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Hackathon Type
                </label>
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-lg ${hackathonType === 'Public' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-500'} transition-colors`}>
                    Public
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={hackathonType === "Private"}
                      onChange={() => setHackathonType(hackathonType === "Public" ? "Private" : "Public")}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                  <div className={`px-4 py-2 rounded-lg ${hackathonType === 'Private' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-500'} transition-colors`}>
                    Private
                  </div>
                </div>
              </div>
  
              {/* Passkey Input */}
              {hackathonType === "Private" && (
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Passkey <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter passkey for private access"
                    value={passKey}
                    onChange={(e) => setPassKey(e.target.value)}
                    required
                  />
                </div>
              )}
  
              {/* Sponsors */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Sponsors
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter sponsor name"
                    value={sponsorInput}
                    onChange={(e) => setSponsorInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddSponsor}
                    className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    disabled={!sponsorInput.trim()}
                  >
                    Add
                  </button>
                </div>
                {sponsors.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sponsors.map((sponsor, index) => (
                      <div 
                        key={index} 
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-800 rounded-full flex items-center text-sm"
                      >
                        {sponsor}
                        <button
                          type="button"
                          onClick={() => handleRemoveSponsor(index)}
                          className="ml-2 text-indigo-400 hover:text-indigo-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
  
              {/* Evaluation Parameters */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Evaluation Parameters <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    onChange={handleSelectChange}
                    defaultValue=""
                  >
                    <option value="" disabled>Choose a parameter</option>
                    {suggestedParameters.map((param, index) => (
                      <option key={index} value={param}>{param}</option>
                    ))}
                    <option value="Other">Other (Custom)</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleSelectChange}
                    className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
  
                {/* Other Parameter Input */}
                {showOtherInput && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Specify custom parameter"
                      value={otherParameter}
                      onChange={(e) => setOtherParameter(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleAddOtherParameter}
                      className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                      disabled={!otherParameter.trim()}
                    >
                      Add
                    </button>
                  </div>
                )}
  
                {/* Selected Parameters */}
                {selectedParameters.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Parameters:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedParameters.map((param, index) => (
                        <div
                          key={index}
                          className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full flex items-center text-sm"
                        >
                          {param}
                          <button
                            type="button"
                            onClick={() => handleRemoveParameter(param)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
  
              {/* Additional Instructions */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Instructions
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
                  placeholder="Enter any additional details for participants..."
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                />
              </div>
  
              {/* Multiple Solutions Toggle */}
              <div className="space-y-2 md:col-span-2 flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="allowMultipleSolutions"
                    checked={allowMultipleSolutions}
                    onChange={() => setAllowMultipleSolutions(!allowMultipleSolutions)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
                <label 
                  htmlFor="allowMultipleSolutions" 
                  className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Allow Multiple Solutions per Participant
                </label>
              </div>
            </div>
  
            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              <button
                type="submit"
                className={`px-6 py-3 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Hackathon...
                  </>
                ) : (
                  <>
                    Create Hackathon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
function getOrdinalSuffix(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
export default CreateHackathonForm;