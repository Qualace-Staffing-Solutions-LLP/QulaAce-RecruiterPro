import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Title,
} from 'chart.js';

import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Title
);



function AdminHome() {
  const navigate = useNavigate();
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [recruiterId, setRecruiterId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setshowAddForm] = useState(false);
  const [showUpdateForm, setshowUpdateForm] = useState(false);
  const [showDeleteForm, setshowDeleteForm] = useState(false);
  const [showSearchForm, setshowSearchForm] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showSearchLeads, setshowSearchLeads] = useState(false);
  const [showAddLeads, setshowAddLeadsForm] = useState(false);
  const [showSendTask, setshowSendTask] = useState(false);
  const [taskRecruiterId, setTaskRecruiterId] = useState('');
  const [taskLeadId, setTaskLeadId] = useState('');
  const [leadData, setLeadData] = useState(null); 
  const [activeCount, setActiveCount] = useState(0);
const [inactiveCount, setInactiveCount] = useState(0);
const [pendingCount, setPendingCount] = useState(0);
const [recruiterStats, setRecruiterStats] = useState([]); // Array of recruiters with assigned & active counts
const [leadTimeline, setLeadTimeline] = useState([]);     // Array of lead count per date
const [clientDistribution, setClientDistribution] = useState([]); // for Client graph
  const [searchResults, setSearchResults] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [showclientdetails, setshowclientdetails] = useState(false); 
  const [showRecruiterdetails, setshowRecruiterdetails] = useState(false); 
  const [showPendingLeads, setshowPendingLeads] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [pendingLeads, setPendingLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [leadsFile, setLeadsFile] = useState(null);
  const [recruiterData, setRecruiterData] = useState(null);
  const [formData, setFormData] = useState({
      fullName: "",
      mobileNumber: "",
      city: "",
      qualification: "",
      type: "",
      recruiterId: "",
      password: "",
    });
  
    const [errors, setErrors] = useState({});
  
    const cities = [
      "Mumbai",
      "Delhi",
      "Bangalore",
      "Pune",
      "Chennai",
      "Kolkata",
      "Hyderabad",
      "Ahmedabad",
      "Jaipur",
      "Ballarpur",
      "Chandrapur",
      "Surat",
      "Chandigarh",
      "Lucknow",
      "Indore",
      "Patna",
    ];


    useEffect(() => {
      const fetchPendingLeads = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/leads/pending-leads');
          console.log("Pending leads data:", res.data);
          setPendingLeads(res.data);
        } catch (err) {
          console.error("Error fetching pending leads:", err);
        }
      };
    
      if (showPendingLeads) {
        fetchPendingLeads();
      }
    }, [showPendingLeads]);

    

    useEffect(() => {
      const fetchDashboardStats = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/leads/dashboard-stats");
          const { active, inactive, pending, recruiters, timeline } = res.data;
    
          setActiveCount(active);
          setInactiveCount(inactive);
          setPendingCount(pending);
          setRecruiterStats(recruiters);
          setLeadTimeline(timeline);
    
          if (!Array.isArray(recruiters) || recruiters.length === 0) {
            console.log("No recruiter stats available");
          }
    
          if (!Array.isArray(timeline) || timeline.length === 0) {
            console.log("No lead timeline available");
          }
        } catch (error) {
          console.error("Dashboard error:", error);
        }
      };
    
      const fetchClientDistribution = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/clients/lead-distribution");
          setClientDistribution(res.data);
        } catch (error) {
          console.error("Client distribution fetch error:", error);
        }
      };
    
      if (showAnalysis) {
        fetchDashboardStats();
        fetchClientDistribution();
      }
    }, [showAnalysis]);
    
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: "" })); // Clear specific field error
      };

      const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) {
          newErrors.fullName = "Full name is required.";
        }
        if (!/^\d{10}$/.test(formData.mobileNumber)) {
          newErrors.mobileNumber = "Mobile number must be 10 digits.";
        }
        if (!formData.city) {
          newErrors.city = "City is required.";
        }
        if (!formData.qualification.trim()) {
          newErrors.qualification = "Qualification is required.";
        }
        if (!formData.type) {
          newErrors.type = "Type is required.";
        }
        if (!formData.recruiterId.trim()) {
          newErrors.recruiterId = "Recruiter ID is required.";
        }
        if (formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters.";
        }
        return newErrors;
      };  


  // Sidebar menu items
  const menuItems = ["Send Task","Add Leads", "Search Lead", "Pending Leads", "Search Recruiter" , "Add Recruiter", "Update Recruiter", "Delete Recruiter", "Recruiters", "Clients", "Chat", "Profile"];

  
  
  
  // Filter menu items based on search term (case-insensitive)
  const filteredItems = menuItems.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const AddRecruiter = async (e) => {
    e.preventDefault(); // Prevent form default submission
  
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/users/create", formData);
  
      if (response.status === 200 || response.status === 201) {
        alert("User created successfully✅");
        setFormData({
          fullName: "",
          mobileNumber: "",
          city: "",
          qualification: "",
          type: "",
          recruiterId: "",
          password: "",
        });
      } else {
        alert(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  
  const handleSendTask = async () => {
    if (!taskRecruiterId || !taskLeadId) {
      alert("Please fill both Recruiter ID and Lead ID.");
      return;
    }
  
    try {
      const res = await axios.post('http://localhost:5000/api/admin/send-task', {
        recruiterId: taskRecruiterId,
        leadId: taskLeadId,
      });
  
      if (res.data.success) {
        alert("✅ Task assigned successfully!");
        setTaskLeadId('');
        setTaskRecruiterId('');
      } else {
        alert(res.data.message || "Failed to assign task.");
      }
    } catch (err) {
      console.error("Send Task Error:", err);
      alert("❌ Server error. Failed to send task.");
    }
  };
  

  

  const UpdateRecruiter = async (e) => {
    e.preventDefault();
    try {
      const { password, ...updateData } = formData;
      // Only include password if it's not empty
      const payload = password ? { ...updateData, password } : updateData;
  
      const response = await fetch(`http://localhost:5000/api/users/${formData.recruiterId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert("Employee details updated successfully✅");
        setFormData({
          recruiterId: "",
          fullName: "",
          mobileNumber: "",
          city: "",
          qualification: "",
          type: "",
          password: "",
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  
  
  const handleDelete = async () => {
    if (!recruiterId.trim()) {
      alert("Please enter a valid Recruiter ID");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/users/${recruiterId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        alert("Employee deleted successfully✅");
        setRecruiterId("");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleSearch = async () => {
    if (!searchCriteria || !searchValue) {
      alert("Please select a criteria and enter a value.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/users/search?criteria=${searchCriteria}&value=${searchValue}`);
      const data = await response.json();
  
      if (response.ok) {
        setRecruiterData(data);
      } else {
        alert(`Error: ${data.message}`);
        setRecruiterData(null);
      }
    } catch (error) {
      console.error("Error searching recruiter:", error);
      alert("Something went wrong. Please try again.");
    }
  };


  

  
  
  function LeadTable({ leads }) {
    if (!leads || leads.length === 0) {
      return <p className="text-gray-600">No leads found.</p>;
    }
  
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 text-sm text-black bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border">Lead ID</th>
              <th className="px-4 py-2 border">Candidate Name</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">City</th>
              <th className="px-4 py-2 border">Interested?</th>
              <th className="px-4 py-2 border">Onboarded?</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2 border">{lead._id}</td>
                <td className="px-4 py-2 border">{lead.candidate_name}</td>
                <td className="px-4 py-2 border">{lead.phone_number}</td>
                <td className="px-4 py-2 border">{lead.job_city}</td>
                <td className="px-4 py-2 border">{lead.is_interested ? "Yes" : "No"}</td>
                <td className="px-4 py-2 border">{lead.is_onboarded ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  

  
  
  
  
  

const handleClientDetails = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/clients/all");
    const data = await response.json();

    if (response.ok) {
      setClients(data);
    } else {
      alert("Failed to fetch client data.");
    }
  } catch (error) {
    console.error("Error fetching client data:", error);
    alert("Something went wrong while fetching client details.");
  }
};

const SearchLead = async () => {
  if (!searchCriteria || !searchValue) {
    alert("Please select a search criteria and value");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/admin/search-leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ searchCriteria, searchValue })
    });

    const data = await response.json();

    if (response.ok) {
      setSearchResults(data);
    } else {
      alert(data.message || "Something went wrong");
    }
  } catch (error) {
    console.error("Search error:", error);
    alert("Error searching leads");
  }
};

const getRecruiters = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/users/recruiters'); // Update the URL as per your backend
    const data = await response.json();
    setRecruiters(data); // Make sure you define this state
  } catch (error) {
    console.error("Error fetching recruiters:", error);
  }
};

  

const handleLeadsUpload = async (e) => {
  e.preventDefault();
  if (!leadsFile) {
    alert("Please select a file.");
    return;
  }

  const formData = new FormData();
  formData.append("file", leadsFile);

  try {
    const response = await fetch("http://localhost:5000/api/leads/bulk-upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    alert(result.message);
    setLeadsFile(null);
  } catch (err) {
    console.error("Error uploading leads:", err);
    alert("Failed to upload leads.");
  }
};

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

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === "Add Recruiter"){
        setshowDeleteForm(false);
        setshowUpdateForm(false);
        setshowRecruiterdetails(false);
        setshowAddForm(true);
        setshowclientdetails(false);
        setshowSearchForm(false);
        setshowAddLeadsForm(false);
        setShowAnalysis(false);
        setshowPendingLeads(false);
        setshowSearchLeads(false);
    }
    if (option === "Update Recruiter"){
        setshowDeleteForm(false);
        setshowUpdateForm(true);
        setshowAddForm(false);
        setshowclientdetails(false);
        setshowRecruiterdetails(false);
        setshowSearchForm(false);
        setShowAnalysis(false);
        setshowAddLeadsForm(false);
        setshowPendingLeads(false);
        setshowSearchLeads(false);
    }
    if (option === "Delete Recruiter"){
        setshowDeleteForm(true);
        setshowUpdateForm(false);
        setshowAddForm(false);
        setshowSearchForm(false);
        setshowclientdetails(false);
        setshowAddLeadsForm(false);
        setshowRecruiterdetails(false);
        setShowAnalysis(false);
        setshowPendingLeads(false);
        setshowSearchLeads(false);
    }
    if (option === "Search Recruiter"){
        setshowDeleteForm(false);
        setshowUpdateForm(false);
        setshowAddForm(false);
        setshowSearchForm(true);
        setshowAddLeadsForm(false);
        setShowAnalysis(false);
        setshowclientdetails(false);
        setshowRecruiterdetails(false);
        setshowSearchLeads(false);
        setshowPendingLeads(false);
    }
    if (option === "Add Leads"){
        setshowDeleteForm(false);
        setshowUpdateForm(false);
        setshowAddForm(false);
        setshowSearchForm(false);
        setshowAddLeadsForm(true);
        setShowAnalysis(false);
        setshowPendingLeads(false);
        setshowSearchLeads(false);
        setshowRecruiterdetails(false);
        setshowclientdetails(false);
    }
    if (option === "Pending Leads"){
        setshowDeleteForm(false);
        setshowUpdateForm(false);
        setshowAddForm(false);
        setshowSearchForm(false);
        setshowAddLeadsForm(false);
        setshowclientdetails(false);
        setshowRecruiterdetails(false);
        setShowAnalysis(false);
        setshowSearchLeads(false);
        setshowPendingLeads(true);
    }
    if (option === "Clients"){
        setshowDeleteForm(false);
        setshowUpdateForm(false);
        setshowAddForm(false);
        setshowSearchForm(false);
        setshowAddLeadsForm(false);
        setshowPendingLeads(false);
        setshowRecruiterdetails(false);
        setshowSearchLeads(false);
        setShowAnalysis(false);
        setshowclientdetails(true);
        handleClientDetails();
    }
    if (option === "Search Lead"){
        setshowDeleteForm(false);
        setshowUpdateForm(false);
        setshowAddForm(false);
        setshowSearchForm(false);
        setshowAddLeadsForm(false);
        setshowPendingLeads(false);
        setshowclientdetails(false);
        setshowRecruiterdetails(false);
        setShowAnalysis(false);
        setLeadData(null);
        setshowSearchLeads(true);
        SearchLead();
    }
    if (option === "Recruiters"){
        setshowDeleteForm(false);
        setshowUpdateForm(false);
        setshowAddForm(false);
        setshowSearchForm(false);
        setshowAddLeadsForm(false);
        setshowPendingLeads(false);
        setshowclientdetails(false);
        setLeadData(null);
        setshowSearchLeads(false);
        setShowAnalysis(false);
        setshowRecruiterdetails(true);
        getRecruiters();
    }
    if (option === "Profile") {
      setshowDeleteForm(false);
      setshowUpdateForm(false);
      setshowAddForm(false);
      setshowSearchForm(false);
      setshowAddLeadsForm(false);
      setshowPendingLeads(false);
      setshowclientdetails(false);
      setLeadData(null);
      setshowSearchLeads(false);
      setshowRecruiterdetails(false);
      setShowAnalysis(true);
    }    
    if (option === "Send Task") {
      setshowDeleteForm(false);
      setshowUpdateForm(false);
      setshowAddForm(false);
      setshowSearchForm(false);
      setshowAddLeadsForm(false);
      setshowPendingLeads(false);
      setshowclientdetails(false);
      setLeadData(null);
      setshowSearchLeads(false);
      setshowRecruiterdetails(false);
      setShowAnalysis(false);
      setshowSendTask(true);
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
            User Type: Admin
          </h2>
          <h2 className="text-xl font-bold text-black mb-1">
            Email: qualace.staffingsolutions@gmail.com
          </h2>
          <h3 className="text-xl text-gray-700 mb-1">
            Name: Farid Shaikh
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
            Welcome to Admin Dashboard
          </h1>
          {/* Additional content can go here */}
            {/* Add Recruiter */}
          {showAddForm && (
            <div className="py-8 px-4 md:px-8">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Create User</h2>
        <form
          onSubmit={AddRecruiter}
          className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto space-y-4"
        >
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          {errors.mobileNumber && (
            <p className="text-red-500 text-sm">{errors.mobileNumber}</p>
          )}
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
          >
            <option value="">Select City</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          <input
            type="text"
            name="qualification"
            placeholder="Qualification"
            value={formData.qualification}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          {errors.qualification && (
            <p className="text-red-500 text-sm">{errors.qualification}</p>
          )}
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
          >
            <option value="">Select Type</option>
            <option value="Recruiter">Recruiter</option>
            <option value="Developer">Developer</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
          <input
            type="text"
            name="recruiterId"
            placeholder="Recruiter ID"
            value={formData.recruiterId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          {errors.recruiterId && (
            <p className="text-red-500 text-sm">{errors.recruiterId}</p>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          <button
            type="submit" onClick={AddRecruiter}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 shadow-md"
          >
            Create User
          </button>
        </form>
      </div>
          )}

          {/* Update Form */}
          {showUpdateForm && (
            <div className="py-8 px-4 md:px-8 font-poppins">
        <h2 className="text-2xl font-bold text-white text-center mb-6 animate-fadeIn">
          Update Employee
        </h2>
        <form
          onSubmit={UpdateRecruiter}
          className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto space-y-4 animate-fadeIn"
        >
          <input
            type="text"
            name="recruiterId"
            placeholder="Employee ID"
            value={formData.recruiterId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3"
          >
            <option value="">Select City</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="qualification"
            placeholder="Qualification"
            value={formData.qualification}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3"
          >
            <option value="">Select Type</option>
            <option value="Recruiter">Recruiter</option>
            <option value="Developer">Developer</option>
          </select>
          <input
            type="password"
            name="password"
            placeholder="New Password (optional)"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 shadow-md"
          >
            Update Employee
          </button>
        </form>
      </div>
          )}

          {/* Delete Recruiter */}
          {showDeleteForm && (
            <div className="py-8 px-4 md:px-8 font-poppins">
        <h2 className="text-2xl font-bold text-white text-center mb-6 animate-fadeIn">
          Delete Employee
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto space-y-4 animate-fadeIn">
        <input
  type="text"
  placeholder="Recruiter ID"
  value={recruiterId}
  onChange={(e) => setRecruiterId(e.target.value)}
  required
  className="w-full border border-gray-300 rounded-lg p-3"
/>

          <button
            onClick={handleDelete}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 shadow-md"
          >
            Delete Recruiter
          </button>
        </div>
      </div>
          )}

          {/* Search Section */}
{showSearchForm && (
  <div className="py-8 px-4 md:px-8 font-poppins">
    <h2 className="text-2xl font-bold text-white text-center mb-6 animate-fadeIn">
      Search Recruiter
    </h2>

    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto space-y-4 animate-fadeIn">
      {/* Select Search Criteria */}
      <select
        value={searchCriteria}
        onChange={(e) => setSearchCriteria(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3"
      >
        <option value="">Select Search Criteria</option>
        <option value="recruiterId">Recruiter ID</option>
        <option value="fullName">Full Name</option>
        <option value="mobileNumber">Mobile Number</option>
        <option value="city">City</option>
      </select>

      {/* Input for Search Value */}
      <input
        type="text"
        placeholder={`Enter ${searchCriteria || 'Value'}`}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        disabled={!searchCriteria}
        required
        className="w-full border border-gray-300 rounded-lg p-3"
      />

      <button
        onClick={handleSearch}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 shadow-md"
      >
        Search Recruiter
      </button>
    </div>

    {/* Employee Data Display */}
{recruiterData && (
  <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl mx-auto mt-6 font-poppins">
    <h3 className="text-xl font-bold text-black mb-4">Employee Details</h3>
    <div className="mb-6">
      <p><strong>ID:</strong> {recruiterData.recruiterId}</p>
      <p><strong>Name:</strong> {recruiterData.fullName}</p>
      <p><strong>Mobile Number:</strong> {recruiterData.mobileNumber}</p>
      <p><strong>City:</strong> {recruiterData.city}</p>
      <p><strong>Qualification:</strong> {recruiterData.qualification}</p>
      <p><strong>Position:</strong> {recruiterData.type}</p>
    </div>

    {/* Leads Table Section */}
    <div>
      <h4 className="text-lg font-semibold text-black mb-2">Assigned Leads</h4>
      <LeadTable leads={recruiterData.assignedLeads} />

      <h4 className="text-lg font-semibold text-black mt-6 mb-2">Active Leads</h4>
      <LeadTable leads={recruiterData.ActiveLeads} />

      <h4 className="text-lg font-semibold text-black mt-6 mb-2">Inactive Leads</h4>
      <LeadTable leads={recruiterData.inActiveLeads} />
    </div>
  </div>
)}

  </div>
)}


          {/* Add Leads Area */}
{showAddLeads && (
  <div className="py-8 px-4 md:px-8 font-poppins">
    <h2 className="text-2xl font-bold text-white text-center mb-6 animate-fadeIn">
      Upload Leads Excel File
    </h2>
    <form
      onSubmit={handleLeadsUpload}
      className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto space-y-4 animate-fadeIn"
      encType="multipart/form-data"
    >
      <input
        type="file"
        accept=".xlsx, .csv"
        onChange={(e) => setLeadsFile(e.target.files[0])}
        required
        className="w-full border border-gray-300 rounded-lg p-3"
      />
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 shadow-md"
      >
        Upload Leads
      </button>
    </form>
  </div>
)}

        {/* Show Pending Leads */}
{showPendingLeads && (
  <div className="mt-10">
    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
      📋 Pending Leads
    </h2>

    {!Array.isArray(pendingLeads) || pendingLeads.length === 0 ? (
      <p className="text-gray-600 text-center">No pending leads found.</p>
    ) : (
      <div className="w-full overflow-x-auto rounded-lg shadow-lg border border-gray-300">
        <table className="min-w-[1000px] border-collapse bg-white">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Name</th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Email</th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Job City</th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Job Area</th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Gender</th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Age</th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Education</th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Applied On</th>
            </tr>
          </thead>
          <tbody>
            {pendingLeads.map((lead) => (
              <tr key={lead._id} className="hover:bg-gray-50 transition duration-200">
                <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{lead.candidate_name}</td>
                <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{lead.phone_number}</td>
                <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{lead.email}</td>
                <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{lead.job_city || "N/A"}</td>
                <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{lead.job_area || "N/A"}</td>
                <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{lead.gender || "N/A"}</td>
                <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{lead.age || "N/A"}</td>
                <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{lead.education || "N/A"}</td>
                <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                  {lead.applied_on ? new Date(lead.applied_on).toLocaleDateString() : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}


      {/* Clients Details */}
{showclientdetails && (
  <div className="overflow-x-auto mt-4">
    <table className="min-w-full table-auto border-collapse border border-gray-400">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Company Name</th>
          <th className="border px-4 py-2">Total Working Leads</th>
          <th className="border px-4 py-2">Lead Name - Phone Number</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => (
          <tr key={client._id}>
            <td className="border px-4 py-2">{client.company_name}</td>
            <td className="border px-4 py-2">{client.working_leads.length}</td>
            <td className="border px-4 py-2">
              <ul className="list-disc ml-4">
                {client.working_leads.map((lead) => (
                  <li key={lead._id}>
                    {lead.candidate_name} - {lead.phone_number}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}


{/* Recruiter Details */}
{showRecruiterdetails && (
  <div className="mt-6 p-4 bg-white rounded shadow">
    <h2 className="text-xl font-semibold mb-4">📋 Recruiter Details</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Recruiter ID</th>
            <th className="border px-4 py-2">Full Name</th>
            <th className="border px-4 py-2">Mobile</th>
            <th className="border px-4 py-2">City</th>
            <th className="border px-4 py-2">Qualification</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Active Leads</th>
            <th className="border px-4 py-2">Inactive Leads</th>
            <th className="border px-4 py-2">Assigned Leads</th>
          </tr>
        </thead>
        <tbody>
          {recruiters.map((rec) => (
            <tr key={rec._id}>
              <td className="border px-4 py-2">{rec.recruiterId}</td>
              <td className="border px-4 py-2">{rec.fullName}</td>
              <td className="border px-4 py-2">{rec.mobileNumber}</td>
              <td className="border px-4 py-2">{rec.city}</td>
              <td className="border px-4 py-2">{rec.qualification}</td>
              <td className="border px-4 py-2">{rec.type}</td>
              <td className="border px-4 py-2">{rec.ActiveLeads.length}</td>
              <td className="border px-4 py-2">{rec.inActiveLeads.length}</td>
              <td className="border px-4 py-2">{rec.assignedLeads.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


{showAnalysis && (
  <div className="mt-6 bg-white rounded-lg shadow p-6 w-full overflow-x-auto">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📊 Admin Dashboard Overview</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Leads Pie Chart */}
      <div className="bg-gray-50 p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2 text-center">Lead Distribution</h3>
        <Pie
          data={{
            labels: ['Active Leads', 'Inactive Leads', 'Pending Leads'],
            datasets: [{
              label: 'Leads',
              data: [activeCount, inactiveCount, pendingCount],
              backgroundColor: ['#34D399', '#F87171', '#60A5FA'],
              borderColor: '#ffffff',
              borderWidth: 1,
            }]
          }}
        />
      </div>

      {/* Recruiter Performance */}
{Array.isArray(recruiterStats) && recruiterStats.length > 0 && (
  <div className="bg-gray-50 p-4 rounded shadow">
    <h3 className="text-lg font-semibold mb-2 text-center">Top Recruiters</h3>
    <Bar
      data={{
        labels: recruiterStats.map((r) => r.name),
        datasets: [
          {
            label: 'Assigned Leads',
            data: recruiterStats.map((r) => r.assigned),
            backgroundColor: '#6366F1',
          },
          {
            label: 'Active Leads',
            data: recruiterStats.map((r) => r.active),
            backgroundColor: '#34D399',
          },
        ],
      }}
      options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
    />
  </div>
)}


      {/* Lead Status Trend */}
{Array.isArray(leadTimeline) && leadTimeline.length > 0 && (
  <div className="bg-gray-50 p-4 rounded shadow col-span-1 md:col-span-2">
    <h3 className="text-lg font-semibold mb-2 text-center">Lead Activity Over Time</h3>
    <Line
      data={{
        labels: leadTimeline.map((item) => item.date),
        datasets: [{
          label: 'New Leads',
          data: leadTimeline.map((item) => item.count),
          fill: true,
          backgroundColor: 'rgba(96,165,250,0.2)',
          borderColor: '#3B82F6'
        }]
      }}
    />
  </div>
)}

{/* Client Lead Distribution Chart */}
{Array.isArray(clientDistribution) && clientDistribution.length > 0 && (
  <div className="bg-gray-50 p-4 rounded shadow">
    <h3 className="text-lg font-semibold mb-2 text-center">Leads by Client</h3>
    <Bar
      data={{
        labels: clientDistribution.map((client) => client.company),
        datasets: [
          {
            label: "Number of Leads",
            data: clientDistribution.map((client) => client.count),
            backgroundColor: "#FBBF24",
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Lead Count per Client",
          },
        },
      }}
    />
  </div>
)}




    </div>
  </div>
)}


{/* Send Task */}
{showSendTask && (
  <div className="mt-6 bg-white p-6 rounded shadow w-full max-w-md mx-auto">
    <h2 className="text-xl font-bold mb-4 text-center text-gray-800">📝 Assign Task to Recruiter</h2>

    <div className="space-y-4">
      <input
        type="text"
        placeholder="Recruiter ID"
        value={taskRecruiterId}
        onChange={(e) => setTaskRecruiterId(e.target.value)}
        className="w-full border border-gray-300 rounded px-4 py-2"
      />
      <input
        type="text"
        placeholder="Lead ID"
        value={taskLeadId}
        onChange={(e) => setTaskLeadId(e.target.value)}
        className="w-full border border-gray-300 rounded px-4 py-2"
      />

      <button
        onClick={handleSendTask}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Send Task
      </button>
    </div>
  </div>
)}



                
            
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
