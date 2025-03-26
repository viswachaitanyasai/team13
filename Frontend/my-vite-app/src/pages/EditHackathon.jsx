import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { editHackathon, getHackathonById } from "../apis/hackathonapi";
import { fileUpload } from "../apis/uploadAPi";

const EditHackathon = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    context: "", 
    problem_statement: "",
    start_date: "",
    end_date: "",
    is_public: true,
    passkey: "",
    grade: "",
    image_url: "",
    file_attachment_url: "",
    custom_prompt: "",
  });

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const response = await getHackathonById(hackathonId);
        setHackathon(response);

        // Pre-fill form with existing data
        setFormData({
          title: response.title || "",
          description: response.description || "",
          context: response.context || "", 
          problem_statement: response.problem_statement || "", 
          start_date: response.start_date.split("T")[0] || "",
          end_date: response.end_date.split("T")[0] || "",
          is_public: response.is_public || true,
          passkey: response.passkey || "",
          grade: response.grade || "",
          image_url: response.image_url || "",
          file_attachment_url: response.file_attachment_url || "",
          custom_prompt: response.custom_prompt || "",
        });
      } catch (error) {
        toast.error(error.error || "Failed to load hackathon details.");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [hackathonId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fileUpload(formData);
      console.log(response);
      if (response?.fileUrl) {
        setFormData((prev) => ({ ...prev, image_url: response.fileUrl }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed.");
      }
    } catch (error) {
      toast.error("Error uploading image.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fileUpload(formData);
      if (response?.fileUrl) {
        setFormData((prev) => ({ ...prev, file_attachment_url: response.fileUrl }));
        toast.success("File uploaded successfully!");
      } else {
        toast.error("File upload failed.");
      }
    } catch (error) {
      toast.error("Error uploading file.");
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image_url: "" }));
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, file_attachment_url: "" }));
  };

  const handleSubmit = async (e) => {
    const token= localStorage.getItem("authToken");
    e.preventDefault();
    setLoading(true);

    if (!formData.image_url) {
      toast.error("A banner image is required.");
      setLoading(false);
      return;
    }

    try {
      await editHackathon(hackathonId, formData, token);
      toast.success("Hackathon updated successfully!");
      navigate(`/hackathon/${hackathonId}`);
    } catch (error) {
      toast.error(error.error || "Failed to update hackathon.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-400 text-center mt-10">Loading hackathon details...</p>;
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-900 p-6 text-white w-full">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-orange-400 mb-4">Edit Hackathon</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block font-medium">Context</label>
            <textarea
                name="context"
                value={formData.context}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md bg-gray-700 text-white"
            />
            </div>
            <div>
            <label className="block font-medium">Problem Statement</label>
            <textarea
                name="problem_statement"
                value={formData.problem_statement}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md bg-gray-700 text-white"
            />
            </div>
          <div>
            <label className="block font-medium">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block font-medium">End Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block font-medium">Additional Instructions</label>
            <textarea
                name="custom_prompt"
                value={formData.custom_prompt}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md bg-gray-700 text-white"
            />
            </div>

          {/* Existing Image Preview & Upload */}
          <div>
            <label className="block font-medium">Hackathon Banner</label>
            {formData.image_url ? (
              <div className="flex items-center gap-4 mt-2">
                <img src={formData.image_url} alt="Banner" className="w-40 h-auto rounded-md border" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <input type="file" onChange={handleImageUpload} className="p-2 border rounded-md bg-gray-700 text-white" />
            )}
          </div>

          {/* Existing File Preview & Upload */}
          <div>
            <label className="block font-medium">Attached File</label>
            {formData.file_attachment_url ? (
              <div className="flex items-center gap-4 mt-2">
                <a href={formData.file_attachment_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                  View File
                </a>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <input type="file" onChange={handleFileUpload} className="p-2 border rounded-md bg-gray-700 text-white" />
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate(`/hackathon/${hackathonId}`)}
              className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.image_url}
              className={`px-6 py-3 text-white rounded-md ${formData.image_url ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 cursor-not-allowed"}`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHackathon;
