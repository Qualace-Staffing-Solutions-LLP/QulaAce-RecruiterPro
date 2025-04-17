import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function RecruiterHome() {
  const navigate = useNavigate();
  const { rid } = useParams(); // Extract recruiter ID from URL
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState(null);
  const [leadData, setLeadData] = useState(null); 
  const [company_id, setCompanyId] = useState(null); 
  const [showActiveLeads, setshowActiveLeads] = useState(false);
  const [showInActiveLeads, setshowInActiveLeads] = useState(false); 
  const [showSearchLeads, setshowSearchLeads] = useState(false); 
  const [showUpdateLead, setshowUpdateLead] = useState(false); 
  const [showCompanyName, setShowCompanyName] = useState(null);
  const [searchLeadId, setSearchLeadId] = useState(null);
  const [activeLeads, setActiveLeads] = useState([]);
  const [inactiveLeads, setInActiveLeads] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [isInterested, setIsInterested] = useState(
    leadData?.is_interested || false
  );
  const [category, setCategory] = useState("");
  const [showCategory, setShowCategory] = useState(false);
  const [showOnboarding, setOnboarding] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [showFollowUpInput, setShowFollowUpInput] = useState(false);
  const [showActive, setshowActive] = useState(false);
  const [showCompanyId, setshowCompanyId] = useState(false);
  const [followUpText, setFollowUpText] = useState("");

  const handleinterested = async (event) => {
    try {
      const selectedValue = event.target.value === "true"; // Convert string to boolean

      // Step 1: Update is_interested in DB based on dropdown selection
      await axios.put(
        `https://qualace-recruitpro.onrender.com/api/leads/update-lead/${leadData._id}`,
        {
          is_interested: selectedValue,
        }
      );

      alert("Lead Data updated");
      setIsInterested(selectedValue);

      // Step 2: If isInterested is true, show category selection
      if (selectedValue) {
        setShowCategory(true);
      } else {
        setShowCategory(false);
      }
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const handleNotInterestedReason = async (event) => {
    try{
      const selectedValue = event.target.value; // Convert string to boolean

      // Step 1: Update is_interested in DB based on dropdown selection
      await axios.put(
        `https://qualace-recruitpro.onrender.com/api/leads/update-lead/${leadData._id}`,
        {
          not_interested_reason: selectedValue,
        }
      );
      setshowActive(true);
    }catch(error){
      console.error("Error updating Lead : ", error);
    }
  };

  const handleCategory = async (event) => {
    try {
      const selectedCategory = event.target.value; // Get selected category from dropdown

      if (showCategory && selectedCategory) {
        await axios.put(
          `https://qualace-recruitpro.onrender.com/api/leads/update-lead/${leadData._id}`,
          { category: selectedCategory }
        );
        alert("Lead category updated successfully✅!");
        setOnboarding(true);
      }
    } catch (error) {
      console.error("Error updating category", error);
    }
  };

  const handleCompanyName = async (leadId, company_name) => {
    try {
      // 1. Save in AssignedLead database (existing functionality)
      if (showCompanyName) {
        await axios.put(
          `https://qualace-recruitpro.onrender.com/api/leads/update-lead/${leadData._id}`,
          { company_name: company_name }
        );
      }
  
      // 2. Save lead into client's working_leads array
      await fetch(`https://qualace-recruitpro.onrender.com/api/clients/add-lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadId, company_name }),
      });
  
      alert("Company assigned and updated in client record✅");
    } catch (error) {
      console.error("Error assigning company:", error);
      alert("Failed to assign company");
    }
  };
  

  const handleOnboarding = async (event) =>{
    try{
      const selectedonboarding=event.target.value==="true";
      if(showOnboarding && selectedonboarding){
        await axios.put(`https://qualace-recruitpro.onrender.com/api/leads/update-lead/${leadData._id}`,{ is_onboarded: selectedonboarding })
        alert(`OnBoarding Status Updated`);
        setOnboarded(true);
        setshowCompanyId(true);
        setShowCompanyName(true);
        }  
    }catch(error){
      console.error(`Error updating OnBoarding Status ${error}`);
    }
  };

  const handleCompanyId = async () => {
    try{
      if (company_id.trim() === "") return alert("Company Id cannot be empty");

      await axios.put(`https://qualace-recruitpro.onrender.com/api/leads/update-lead/${leadData._id}`, {
        company_id: company_id,
      });

      alert("Company Id added successfully✅!");
    }catch(error){
      console.error("Error adding Company Id:", error);
    }
  };

  const handleAddFollowUp = async () => {
    try {
      if (followUpText.trim() === "") return alert("Follow-up cannot be empty");

      await axios.put(`https://qualace-recruitpro.onrender.com/api/leads/add-followup/${leadData._id}`, {
        follow_up_text: followUpText,
      });

      alert("Follow-up added successfully✅!");
      setshowActive(true);
      setFollowUpText("");
      setShowFollowUpInput(false);
    } catch (error) {
      console.error("Error adding follow-up:", error);
    }
  };

  const handleActive = async (event) => {
    try{
      const selectedCategory = event.target.value==="true"; // Get selected category from dropdown

      if (showActive && selectedCategory) {
        await axios.put(
          `https://qualace-recruitpro.onrender.com/api/leads/update-lead/${leadData._id}`,
          { is_Active: selectedCategory, rid : rid }
        );
        alert("Lead Active Status updated successfully✅!");
      }
    }catch(error){
      console.log("Error adding Active Status:", error)
    }
  };


  // Sidebar menu items
  const menuItems = ["Next Task", "Search Leads" , "My Active Leads" , "My Inactive Leads", "Update Lead" ,"Client", "Chat", "Profile"];

  // Filter menu items based on search term (case-insensitive)
  const filteredItems = menuItems.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    // Use the full URL to ensure the request reaches your API server
    fetch(`https://qualace-recruitpro.onrender.com/api/users/${rid}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        return res.json();
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [navigate, rid]);

  useEffect(() => {
    const handleResize = () => {
      // Resize logic if needed
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const nextLead = async () => {
    try {
      const response = await fetch(
        `https://qualace-recruitpro.onrender.com/api/leads/assign-lead/${rid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Lead Assigned:", data.assignedLead);
        alert("Lead assigned successfully✅!");
        setLeadData(data.assignedLead); // Store lead details in state
      } else {
        alert(data.message || "Failed to assign lead");
      }
    } catch (error) {
      console.error("Error fetching next lead:", error);
      alert("Error assigning lead");
    }
  };


  const getActiveLeads = async () => {
    try {
      const response = await fetch(
        `https://qualace-recruitpro.onrender.com/api/users/get-active-leads/${rid}`, // Replace `rid` with your recruiterId
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Active Leads:", data.activeLeads);
        setActiveLeads(data.activeLeads); // Store in state
      } else {
        alert(data.message || "Failed to fetch active leads");
      }
    } catch (error) {
      console.error("Error fetching active leads:", error);
      alert("Error fetching active leads");
    }
  };

  const fetchLeadById = async () => {
    if (!searchLeadId) return alert("Please enter Lead ID");
  
    try {
      const res = await fetch(`https://qualace-recruitpro.onrender.com/api/leads/${searchLeadId}`);
      const data = await res.json();
  
      if (res.ok) {
        setLeadData(data);
      } else {
        alert(data.message || "Lead not found");
        setLeadData(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Something went wrong");
    }
  };

  
  const getInActiveLeads = async (event) => {
    try {
      const response = await fetch(
        `https://qualace-recruitpro.onrender.com/api/users/get-inactive-leads/${rid}`, // Replace `rid` with your recruiterId
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("InActive Leads:", data.inactiveLeads);
        setInActiveLeads(data.inactiveLeads); // Store in state
      } else {
        alert(data.message || "Failed to fetch inactive leads");
      }
    } catch (error) {
      console.error("Error fetching inactive leads:", error);
      alert("Error fetching active leads");
    }
  }

  const SearchLead = async () => {
    if (!searchCriteria || !searchValue) {
      alert("Please select criteria and enter a value.");
      return;
    }
  
    try {
      const response = await fetch(`https://qualace-recruitpro.onrender.com/api/leads/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recruiterId: rid, 
          searchCriteria,
          searchValue,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setSearchResults(data.leads);
      } else {
        alert(data.message || "Search failed");
      }
    } catch (error) {
      console.error("Error searching leads:", error);
      alert("Something went wrong during search.");
    }
  };
  
  

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === "Next Task") {
      setshowActiveLeads(false);
      setshowSearchLeads(false);
      setshowInActiveLeads(false);
      setshowUpdateLead(false);
      nextLead();
    }
    if (option === "My Active Leads"){
      setLeadData(null);
      setshowInActiveLeads(false);
      setshowSearchLeads(false);
      setshowActiveLeads(true);
      setshowUpdateLead(false);
      getActiveLeads();
    } 
    if (option === "My Inactive Leads"){
      setLeadData(null);
      setshowActiveLeads(false);
      setshowSearchLeads(false);
      setshowInActiveLeads(true);
      setshowUpdateLead(false);
      getInActiveLeads();
    } 
    if (option === "Search Leads"){
      setLeadData(null);
      setshowActiveLeads(false);
      setshowInActiveLeads(false);
      setshowSearchLeads(true);
      setshowUpdateLead(false);
      SearchLead();
    } 
    if (option === "Update Lead"){
      setLeadData(null);
      setshowActiveLeads(false);
      setshowInActiveLeads(false);
      setshowSearchLeads(false);
      setshowUpdateLead(true);
    } 
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-gray-900 font-poppins relative">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center p-6 bg-white shadow-lg rounded-lg relative space-y-4 md:space-y-0">
        <div className="flex justify-center w-full md:w-auto">
          <img
            src="/Qualace.jpg"
            alt="Company Logo"
            className="w-40 h-25 rounded-lg"
          />
        </div>
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-xl font-bold text-black mb-1">
            User Type: Recruiter
          </h2>
          <h2 className="text-xl font-bold text-black mb-1">
            Email: Email Field Nahi hai
          </h2>
          <h3 className="text-xl text-gray-700 mb-1">
            Name: {userData ? userData.fullName : "Loading..."}
          </h3>
        </div>
        <button
          onClick={handleLogout}
          className="hidden md:block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg transform transition-all duration-300 hover:scale-105"
        >
          Log Out
        </button>
      </header>

      {/* Toggle button when sidebar is collapsed */}
      {!isLeftSidebarOpen && (
        <button
          onClick={() => setIsLeftSidebarOpen(true)}
          className="absolute top-[86px] left-0 z-30 p-2 bg-gray-800 text-white rounded-r-full shadow-lg hover:bg-gray-700 transition-all duration-300"
        >
          ☰
        </button>
      )}

      {/* Container for Sidebar and Main Content */}
      <div className="flex relative">
        {/* Left Sidebar */}
<div
  className={`absolute top-0 left-0 ${
    isLeftSidebarOpen ? "w-80" : "w-0"
  } h-[calc(100vh-86px)] bg-white shadow-2xl transition-all duration-500 ease-in-out overflow-hidden flex flex-col border-r border-gray-200`}
>
  {/* Inner scrollable container */}
  <div className="flex-1 overflow-y-auto">
    {/* Toggle button when sidebar is open */}
    {isLeftSidebarOpen && (
      <button
        onClick={() => setIsLeftSidebarOpen(false)}
        className="absolute top-4 right-0 mr-2 z-10 p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300"
      >
        ✖
      </button>
    )}
    
    <div className="p-4 flex flex-col gap-4 border-b border-gray-300">
      <h2 className="text-xl font-extrabold text-gray-800">
        Admin Dashboard
      </h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
      />
    </div>

    <nav className="flex flex-col p-4 space-y-2">
      {filteredItems.length > 0 ? (
        filteredItems.map((item) => (
          <button
            key={item}
            onClick={() => handleOptionSelect(item)}
            className={`p-3 text-left font-semibold rounded-md transition-all duration-300 ${
              selectedOption === item
                ? "bg-purple-500 text-white border-l-4 border-purple-500"
                : "text-gray-700 hover:border-l-4 hover:border-purple-500"
            }`}
          >
            {item}
          </button>
        ))
      ) : (
        <div className="p-3 text-left text-gray-500">
          No options found
        </div>
      )}
    </nav>
  </div>
</div>


        {/* Main Content */}
        <div className="flex-1 flex flex-col p-6 ml-0 md:ml-80 transition-all duration-500">
          <h1 className="text-2xl font-bold text-white">
            Welcome to Recruiter Dashboard
          </h1>
          {/* Additional content can go here */}
          {/* Display Lead Data in Vertical Table Format with Proper Borders */}
          {leadData && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
                Assigned Lead Details
              </h2>
              <table className="w-full border border-gray-800">
                <tbody>
                  {[
                    { label: "Lead ID", value: leadData._id },
                    { label: "Name", value: leadData.candidate_name },
                    { label: "Phone", value: leadData.phone_number },
                    { label: "Email", value: leadData.email },
                    { label: "Job City", value: leadData.job_city },
                    { label: "Job Area", value: leadData.job_area },
                    { label: "Gender", value: leadData.gender },
                    { label: "Age", value: leadData.age },
                    { label: "Candidate City", value: leadData.candidate_city },
                    { label: "Candidate Area", value: leadData.candidate_area },
                    { label: "Education", value: leadData.education },
                    { label: "Highest Degree", value: leadData.highest_degree },
                  ].map((item, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="px-4 py-2 font-semibold text-gray-700 border-r border-gray-800">
                        {item.label}
                      </td>
                      <td className="px-4 py-2 text-gray-800">{item.value}</td>
                    </tr>
                  ))}

                  {/* Is Interested Dropdown */}
                  <tr className="border-b border-gray-800">
                    <td className="px-4 py-2 font-semibold text-gray-700 border-r border-gray-800">
                      Is Interested
                    </td>
                    <td className="px-4 py-2">
                      <select
                        className="border border-gray-400 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleinterested} // Calls handleNext when value changes
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>

                  {!isInterested && (
                    <tr className="border-b border-gray-800">
                      <td className="px-4 py-2 font-semibold text-gray-700 border-r border-gray-800">
                        Reason for Not Interested
                      </td>
                      <td className="px-4 py-2">
                        <select
                          className="border border-gray-400 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={handleNotInterestedReason} // Calls handleCategory when value changes
                        >
                          <option value="">Select</option>
                          <option value="Reason 1">Reason 1</option>
                          <option value="Reason 2">Reason 2</option>
                          <option value="Reason 3">Reason 3</option>
                        </select>
                      </td>
                    </tr>
                  )}

                  {showCategory && (
                    <tr className="border-b border-gray-800">
                      <td className="px-4 py-2 font-semibold text-gray-700 border-r border-gray-800">
                        Category
                      </td>
                      <td className="px-4 py-2">
                        <select
                          className="border border-gray-400 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={handleCategory} // Calls handleCategory when value changes
                        >
                          <option value="">Select</option>
                          <option value="Rider">Rider</option>
                          <option value="Driver">Driver</option>
                          <option value="Picker Packer">Picker Packer</option>
                        </select>
                      </td>
                    </tr>
                  )}

                  {/* OnBoarding */}
                  {showOnboarding && (
                    <tr className="border-b border-gray-800">
                      <td className="px-4 py-2 font-semibold text-gray-700 border-r border-gray-800">
                        OnBoarding
                      </td>
                      <td className="px-4 py-2">
                        <select
                          className="border border-gray-400 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={handleOnboarding} // Calls handleOnbarding when value changes
                        >
                          <option value="">Select</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </td>
                    </tr>
                  )}

                  {/* Company Name */}
{showCompanyName && (
  <tr className="border-b border-gray-800">
    <td className="px-4 py-2 font-semibold text-gray-700 border-r border-gray-800">
      Company Name
    </td>
    <td className="px-4 py-2">
      <select
        className="border border-gray-400 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => handleCompanyName(leadData._id, e.target.value)} // pass leadId and selected value
      >
        <option value="">Select</option>
        <option value="Zepto">Zepto</option>
        <option value="Zomato">Zomato</option>
        <option value="Swiggy">Swiggy</option>
        <option value="Fyn">Fyn</option>
        <option value="Big Basket">Big Basket</option>
      </select>
    </td>
  </tr>
)}


                  {/* CompanyId Input and Submit */}
          {showCompanyId && (
            <tr className="border-b border-gray-800">
              <td className="px-4 py-2 font-semibold text-gray-700 border-r border-gray-800">
                Company Id
              </td>
              <td className="px-4 py-2 space-y-2">
                <textarea
                  value={company_id}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter Company Id"
                />
                <button
                  onClick={handleCompanyId}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save Company Id
                </button>
              </td>
            </tr>
          )}



                   {/* Add Follow-Up Button */}
          {onboarded && !showFollowUpInput && (
            <tr className="border-b border-gray-800">
              <td className="px-4 py-2 font-semibold text-gray-700 border-r border-gray-800">
                Follow Up
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => setShowFollowUpInput(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Follow Up
                </button>
              </td>
            </tr>
          )}

          {/* Follow-Up Input and Submit */}
          {showFollowUpInput && (
            <tr className="border-b border-gray-800">
              <td className="px-4 py-2 font-semibold text-gray-700 border-r border-gray-800">
                Follow Up Text
              </td>
              <td className="px-4 py-2 space-y-2">
                <textarea
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter follow-up details"
                />
                <button
                  onClick={handleAddFollowUp}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save Follow Up
                </button>
              </td>
            </tr>
          )}

          {/* Active */}
          {showActive && (
                    <tr className="border-b border-gray-800">
                      <td className="px-4 py-2 font-semibold text-gray-700 border-r border-gray-800">
                        Active
                      </td>
                      <td className="px-4 py-2">
                        <select
                          className="border border-gray-400 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={handleActive} // Calls handleActive when value changes
                        >
                          <option value="">Select</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </td>
                    </tr>
                  )}
                  
          {/* Close Lead */}
          {showActive && (
            <tr className="border-b border-gray-800">
              <td className="px-4 py-2 font-semibold text-gray-700 border-r border-gray-800">
                Close This Lead
              </td>
              <td className="px-4 py-2 space-y-2">
                <button
                  onClick={nextLead}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Next Lead
                </button>
              </td>
            </tr>
          )}


                </tbody>
              </table>
            </div>
          )}

          {showActiveLeads && activeLeads.length > 0 ? (
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto border-collapse border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Phone</th>
          <th className="border px-4 py-2">Email</th>
          <th className="border px-4 py-2">Category</th>
          <th className="border px-4 py-2">Company Name</th>
          <th className="border px-4 py-2">Company Id</th>
        </tr>
      </thead>
      <tbody>
        {activeLeads.map((lead) => (
          <tr key={lead._id}>
            <td className="border px-4 py-2">{lead.candidate_name}</td>
            <td className="border px-4 py-2">{lead.phone_number}</td>
            <td className="border px-4 py-2">{lead.email}</td>
            <td className="border px-4 py-2">{lead.category}</td>
            <td className="border px-4 py-2">{lead.company_name}</td>
            <td className="border px-4 py-2">{lead.company_id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  showActiveLeads && <p>No active leads found.</p>
)}

{showInActiveLeads && inactiveLeads.length > 0 ? (
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto border-collapse border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Lead Id</th>
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Phone</th>
          <th className="border px-4 py-2">is_interested</th>
          <th className="border px-4 py-2">not_interested_reason</th>
          <th className="border px-4 py-2">Category</th>
          <th className="border px-4 py-2">is_onboarded</th>
          <th className="border px-4 py-2">Company Name</th>
        </tr>
      </thead>
      <tbody>
        {inactiveLeads.map((lead) => (
          <tr key={lead._id}>
            <td className="border px-4 py-2">{lead.lead_id}</td>
            <td className="border px-4 py-2">{lead.candidate_name}</td>
            <td className="border px-4 py-2">{lead.phone_number}</td>
            <td className="border px-4 py-2">{lead.is_interested}</td>
            <td className="border px-4 py-2">{lead.not_interested_reason}</td>
            <td className="border px-4 py-2">{lead.category}</td>
            <td className="border px-4 py-2">{lead.is_onboarded}</td>
            <td className="border px-4 py-2">{lead.company_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  showInActiveLeads && <p>No Inactive leads found.</p>
)}


        {/* Search Lead */}
{showSearchLeads && (
  <div className="mt-6 p-4 bg-white rounded shadow">
    <h2 className="text-xl font-semibold mb-4">🔍 Search Lead</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <select
        className="border px-3 py-2 rounded"
        value={searchCriteria}
        onChange={(e) => setSearchCriteria(e.target.value)}
      >
        <option value="">Select Search Criteria</option>
        <option value="lead_id">Lead ID</option>
        <option value="candidate_name">Candidate Name</option>
        <option value="phone_number">Phone Number</option>
        <option value="email">Email</option>
        <option value="job_city">Job City</option>
        <option value="is_interested">Is Interested</option>
        <option value="category">Category</option>
        <option value="is_onboarded">Is Onboarded</option>
        <option value="company_name">Company Name</option>
      </select>

      {["is_interested", "is_onboarded"].includes(searchCriteria) ? (
        <select
          className="border px-3 py-2 rounded"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      ) : searchCriteria === "category" ? (
        <select
          className="border px-3 py-2 rounded"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="rider">Rider</option>
          <option value="driver">Driver</option>
          <option value="picker packer">Picker Packer</option>
        </select>
      ) : (
        <input
          type="text"
          className="border px-3 py-2 rounded"
          placeholder="Enter value"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      )}
    </div>

    <button
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
      onClick={SearchLead}
    >
      Search
    </button>

    {/* Display Search Results */}
{searchResults.length > 0 && (
  <div className="overflow-x-auto mt-6">
    <table className="min-w-full table-auto border-collapse border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Lead Id</th>
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Phone</th>
          <th className="border px-4 py-2">Email</th>
          <th className="border px-4 py-2">Job City</th>
          <th className="border px-4 py-2">Category</th>
          <th className="border px-4 py-2">Is Interested</th>
          <th className="border px-4 py-2">Is Onboarded</th>
          <th className="border px-4 py-2">Company Name</th>
          <th className="border px-4 py-2">Follow Ups</th>
        </tr>
      </thead>
      <tbody>
        {searchResults.map((lead) => (
          <tr key={lead._id}>
            <td className="border px-4 py-2">{lead.lead_id}</td>
            <td className="border px-4 py-2">{lead.candidate_name}</td>
            <td className="border px-4 py-2">{lead.phone_number}</td>
            <td className="border px-4 py-2">{lead.email}</td>
            <td className="border px-4 py-2">{lead.job_city}</td>
            <td className="border px-4 py-2">{lead.category}</td>
            <td className="border px-4 py-2">{lead.is_interested ? "Yes" : "No"}</td>
            <td className="border px-4 py-2">{lead.is_onboarded ? "Yes" : "No"}</td>
            <td className="border px-4 py-2">{lead.company_name}</td>
            <td className="border px-4 py-2">
              {lead.follow_ups && lead.follow_ups.length > 0 ? (
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  {lead.follow_ups.map((fup, index) => (
                    <li key={index}>
                      {fup.text} <br />
                      <span className="text-gray-500 text-xs">
                        ({new Date(fup.date).toLocaleDateString()})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-400 italic">No follow-ups</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

  </div>
)}

        {/* Update a Lead */}
        {showUpdateLead && (
  <div className="mt-6 p-4 bg-white rounded shadow max-w-xl mx-auto">
    <h2 className="text-xl font-semibold mb-4">🔄 Update Lead</h2>

    <div className="flex items-center gap-4 mb-4">
      <input
        type="text"
        placeholder="Enter Lead ID"
        className="border px-3 py-2 rounded w-full"
        value={searchLeadId}
        onChange={(e) => setSearchLeadId(e.target.value)}
      />
      <button
        onClick={fetchLeadById}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
      >
        Search
      </button>
    </div>
  </div>
)}



        </div>
      </div>
    </div>
  );
}

export default RecruiterHome;
