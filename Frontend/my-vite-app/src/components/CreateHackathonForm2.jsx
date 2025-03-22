import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ParameterSelection = () => {
  const navigate = useNavigate();
  const suggestedParameters = ["Innovation", "Complexity", "Technical Skill", "Presentation"];
  const [selectedParameters, setSelectedParameters] = useState([]);
  const [otherParameter, setOtherParameter] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [hackathonType, setHackathonType] = useState("Public");
  const [passKey, setPassKey] = useState("");

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setShowOtherInput(true);
    } else if (!selectedParameters.includes(value)) {
      setSelectedParameters([...selectedParameters, value]);
    }
  };

  const handleAddOtherParameter = () => {
    if (otherParameter.trim() !== "") {
      setSelectedParameters([...selectedParameters, otherParameter.trim()]);
      setOtherParameter("");
      setShowOtherInput(false);
    }
  };

  const handleRemoveParameter = (param) => {
    setSelectedParameters(selectedParameters.filter((p) => p !== param));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted with Parameters:", selectedParameters, hackathonType, passKey);
  };

  return (
    <div className="min-h-screen w-full p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Select Hackathon Parameters</h2>
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
          <select className="w-full p-3 border rounded-md" onChange={handleSelectChange}>
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

        {/* Buttons */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/create-hackathon")}
            className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Prev
          </button>
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParameterSelection;
