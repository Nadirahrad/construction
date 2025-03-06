import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const UploadContractors = ({ refreshContractors }) => {
  const [files, setFiles] = useState(null);
  

  const handleUpload = async () => {
  
    if (!files.length) {
      message.error("Sila pilih fail dahulu.");
      return;
    }

    console.log("Fail yang dipilih:", files); 
  
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file)); // ✅ Hantar banyak fail
  
    try {
      const res = await axios.post("http://localhost:4000/api/contractors/import-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload Response:", res.data); // ✅ Gunakan res bukan response
      message.success("Fail berjaya dimuat naik!");
      setFiles([]); 
      // Auto-refresh data selepas upload
       if (refreshContractors) {
        refreshContractors();
      }
    } catch (error) {
      console.error("Upload error:", error.response ? error.response.data : error);
      message.error("Ralat semasa memuat naik fail.");
    }
  };

  return (
    <div>
      <Upload 
        multiple={true}
        beforeUpload={(file) => { 
          setFiles((prevFiles) => [...(prevFiles || []), file]); // ✅ Pastikan fail disimpan
          return false; 
        }} 
        showUploadList={true}
      >
        <Button icon={<UploadOutlined />}>Pilih Fail Excel</Button>
      </Upload>
      <Button type="primary" onClick={handleUpload} style={{ marginTop: 10 }}>
        Muat Naik & Simpan
      </Button>
    </div>
  );
};

export default UploadContractors;
