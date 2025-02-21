import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ContractorManagement.css";
import logo from "../assets/mtilogo.png";

const ContractorManagement = () => {
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    address: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const contractorsPerPage = 10;

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/contractors");
      if (!res.ok) throw new Error("Failed to fetch contractors");
      const data = await res.json();
      setContractors(data);
    } catch (error) {
      console.error("Error fetching contractors:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      let response;
      if (selectedContractor && selectedContractor._id) {
        response = await fetch(`http://localhost:4000/api/contractors/${selectedContractor._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch("http://localhost:4000/api/contractors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      if (!response.ok) throw new Error("Failed to save contractor");
      fetchContractors();
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the contractor.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && (!/^[0-9]*$/.test(value) || value.length > 11)) {
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.name || !formData.company || !formData.phone || !formData.address || !formData.email) {
      alert("All fields are required.");
      return false;
    }
    if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      alert("Phone number must be 10-11 digits.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Invalid email format.");
      return false;
    }
    return true;
  };

  const handleEdit = (contractor) => {
    setSelectedContractor(contractor);
    setFormData({
      name: contractor.name,
      company: contractor.company,
      phone: contractor.phone,
      address: contractor.address,
      email: contractor.email,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contractor?")) return;
    try {
      const response = await fetch(`http://localhost:4000/api/contractors/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete contractor");
      fetchContractors();
    } catch (error) {
      console.error("Error deleting contractor:", error);
      alert("An error occurred while deleting the contractor.");
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token dari localStorage
    navigate("/login"); // Redirect ke login page
  };

  const resetForm = () => {
    setSelectedContractor(null);
    setFormData({ name: "", company: "", phone: "", address: "", email: "" });
  };

  const filteredContractors = contractors.filter(contractor =>
    contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastContractor = currentPage * contractorsPerPage;
  const indexOfFirstContractor = indexOfLastContractor - contractorsPerPage;
  const currentContractors = filteredContractors.slice(indexOfFirstContractor, indexOfLastContractor);

  return (
    <div className="contractor-container">
      <header className="contractor-header">
        <div className="header-left">
          <img src={logo} alt="mtilogo" className="logo"/>
      <h1>Contractor Management System</h1>
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      <div className="container">
        <form onSubmit={handleSubmit} className="form-container">
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="company" placeholder="Company Name" value={formData.company} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <button type="submit" className="add-button" disabled={loading}>
            {loading ? "Processing..." : selectedContractor ? "Update Contractor" : "Add Contractor"}
          </button>
        </form>
        <input
          type="text"
          placeholder="Search contractors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="contractor-content">
          <h2>Contractor List</h2>
          <table className="contractor-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Company</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentContractors.length > 0 ? (
                currentContractors.map((contractor, index) => (
                  <tr key={contractor._id}>
                    <td>{indexOfFirstContractor + index + 1}</td>
                    <td>{contractor.name}</td>
                    <td>{contractor.company}</td>
                    <td>{contractor.phone}</td>
                    <td>{contractor.address}</td>
                    <td>{contractor.email}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(contractor)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(contractor._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>No contractors found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
            <span> Page {currentPage} of {Math.ceil(filteredContractors.length / contractorsPerPage)} </span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastContractor >= filteredContractors.length}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorManagement;
