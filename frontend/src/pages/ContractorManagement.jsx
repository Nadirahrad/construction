import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ContractorManagement.css";
import axios from "axios";
import logo from "../assets/mtilogo.png";
import { Pencil, Trash2 } from "lucide-react";
import EditContractorModal from "./EditContractorModal";
import UploadContractors from "./UploadContractors";

const ContractorManagement = () => {
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [selectedContractors, setSelectedContractors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    ic_passport: "",
    gender: "",
    position: "",
    company: "",
    cidb_registration: "",
    grade: "",
    state: "",
    email: "",
    phone: "",
    address:"",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  const handleEdit = (contractor) => {
    setSelectedContractor(contractor); // Pastikan selectedContractor di-set
    setIsEditModalOpen(true);
  };
  

  const handleSaveChanges = async (updatedData) => {
    if (!selectedContractor) {
      console.error("No contractor selected!");
      return;
  }
    try {
      await axios.put(`http://localhost:4000/api/contractors/${selectedContractor._id}`, updatedData);
      fetchContractors();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating contractor:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      let response;
      const formattedData = {
        ...formData,
        address: formData.address.trim() === "" ? "-" : formData.address,
        email: formData.email.trim() === "" ? "-" : formData.email,
      };
      if (selectedContractor && selectedContractor._id) {
        response = await fetch(`http://localhost:4000/api/contractors/${selectedContractor._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedData),
        });
      } else {
        response = await fetch("http://localhost:4000/api/contractors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedData),
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
    if (!formData.name || !formData.company || !formData.phone) {
      alert("Name, company, and phone are required.");
      return false;
    }
    if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      alert("Phone number must be 10-11 digits.");
      return false;
    }
    if (formData.email && formData.email.trim() !== "") { // ✅ Periksa hanya jika ada input
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        alert("Invalid email format.");
        return false;
      }
    }
    return true;
  };

  const handleCheckboxChange = (id) => {
    setSelectedContractors((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((contractorId) => contractorId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteMultiple = async () => {
    if (selectedContractors.length === 0) {
      alert("Please select at least one contractor to delete.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete selected contractors?")) return;
    try {
      await Promise.all(
        selectedContractors.map((id) =>
          fetch(`http://localhost:4000/api/contractors/${id}`, {
            method: "DELETE",
          })
        )
      );
      fetchContractors();
      setSelectedContractors([]);
    } catch (error) {
      console.error("Error deleting contractors:", error);
      alert("An error occurred while deleting contractors.");
    }
  };

  const handleSelectAll = () => {
    const currentPageIds = currentContractors.map(contractor => contractor._id);
    
    // Check kalau semua dalam current page dah selected
    const allSelected = currentPageIds.every(id => selectedContractors.includes(id));
  
    if (allSelected) {
      // Kalau semua dah selected, unselect semua dalam current page
      setSelectedContractors(prevSelected =>
        prevSelected.filter(id => !currentPageIds.includes(id))
      );
    } else {
      // Kalau belum, tambah semua dalam current page ke dalam selection
      setSelectedContractors(prevSelected => [
        ...prevSelected,
        ...currentPageIds.filter(id => !prevSelected.includes(id)) // Elak duplicate
      ]);
    }
  };

  const handleRenewStatus = async (id, currentStatus) => {
    let newStatus = ""; 

    if (currentStatus === "") {
        newStatus = "renew";  // Dari kosong ke "renew"
    } else if (currentStatus === "renew") {
        newStatus = "completed";  // Dari "renew" ke "complete"
    } else if (currentStatus === "completed") {
        newStatus = "";  // Dari "complete" ke kosong (jika nak boleh untick balik)
    }

    try {
        const response = await axios.put(`http://localhost:4000/api/contractors/${id}/renew`, { renewStatus: newStatus });

        if (response.status === 200) {
            setContractors((prev) =>
                prev.map((contractor) =>
                    contractor._id === id ? { ...contractor, renewStatus: newStatus } : contractor
                )
            );
        }
    } catch (error) {
        console.error("Error updating renew status:", error);
    }
};

  const handleKeyDown = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = document.querySelector(`[name="${nextField}"]`) || document.getElementById(nextField);
      if (nextInput) {
        nextInput.focus();
      }
    }
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

  const indexOfFirstContractor = (currentPage - 1) * contractorsPerPage;
  const indexOfLastContractor = indexOfFirstContractor + contractorsPerPage;
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
        <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyDown(e, "company")}
        />
        <input
        type="text"
        name="company"
        placeholder="Company Name"
        value={formData.company}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyDown(e, "phone")}
        />
        <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyDown(e, "email")}
        />
        <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyDown(e, "submitBtn")}
        />

        <button type="submit" id="submitBtn" className="add-button" disabled={loading}>
          {loading ? "Processing..." : selectedContractor ? "Update Contractor" : "Add Contractor"}
          </button>
          </form>

          <UploadContractors refreshContractors={fetchContractors} />


        <input
          type="text"
          placeholder="Search contractors..."
          value={searchTerm}
          onChange={(e) => {setSearchTerm(e.target.value);
            setCurrentPage(1);}}
        />
        <div className="contractor-content">
          <h2>Senarai Kontraktor</h2>
          <button className="delete-multiple-btn" onClick={handleDeleteMultiple} disabled={selectedContractors.length === 0}>Delete Selected</button>
          <table className="contractor-table">
            <thead>
              <tr>
              <th><input
        type="checkbox"
        onChange={handleSelectAll}
        checked={currentContractors.length > 0 && currentContractors.every(c => selectedContractors.includes(c._id))}
      />
      </th>
                <th>NO</th>
                <th>NAMA</th>
            <th>NO IC/PASSPORT</th>
            <th>JANTINA</th>
            <th>JAWATAN</th>
            <th>NAMA SYARIKAT</th>
            <th>NO. PENDAFTARAN CIDB</th>
            <th>GRED</th>
            <th>NEGERI</th>
            <th>EMAIL</th>
            <th>NO.TELEFON</th>
            <th>RENEW</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentContractors.length > 0 ? (
                currentContractors.map((contractor, index) => (
                  <tr key={contractor._id}
                  style={{
                    backgroundColor:
                      contractor.renewStatus === "renew" ? "lightgreen" : "transparent",
                  }}>
                    <td>
                    <input type="checkbox" checked={selectedContractors.includes(contractor._id)} onChange={() => handleCheckboxChange(contractor._id)} />
                  </td>
                    <td>{indexOfFirstContractor + index + 1}</td>
                    <td>{contractor.name || "-"}</td>
              <td>{contractor.ic_passport || "-"}</td>
              <td>{contractor.gender || "-"}</td>
              <td>{contractor.position || "-"}</td>
              <td>{contractor.company || "-"}</td>
              <td>{contractor.cidb_registration || "-"}</td>
              <td>{contractor.grade || "-"}</td>
              <td>{contractor.state || "-"}</td>
              <td>{contractor.email || "-"}</td>
              <td>{contractor.phone || "-"}</td>
              <td>
  <input
    type="checkbox"
    checked={contractor.renewStatus === "completed"}
    onChange={() => handleRenewStatus(contractor._id, contractor.renewStatus)}
  />
  
  {contractor.renewStatus === "renew" && (
    <span style={{ color: "green", fontWeight: "bold" }}>renew</span>
  )}
  {contractor.renewStatus === "completed" && (
    <span style={{ color: "blue", fontWeight: "bold" }}>complete</span>
  )}

</td>
                      <td>
                      <button className="edit-btn" onClick={() => handleEdit(contractor)}><Pencil size={18}/></button>
                      <button className="delete-btn" onClick={() => handleDelete(contractor._id)}><Trash2 size={18}/></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" style={{ textAlign: "center" }}>No contractors found.</td>
                </tr>
              )}
            </tbody>
          </table>
          {isEditModalOpen && selectedContractor && (
  <EditContractorModal
    contractor={selectedContractor}
    onClose={() => setIsEditModalOpen(false)}
    onSave={handleSaveChanges}
  />
)}

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
