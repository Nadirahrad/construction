import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Form } from "antd";
import { Select } from 'antd';

const EditContractorModal = ({ contractor, onClose, onSave }) => {
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
  });

  useEffect(() => {
    if (contractor) {
      setFormData({
        name: contractor.name || "",
        ic_passport: contractor.ic_passport || "",
        gender: contractor.gender || "",
        position: contractor.position || "",
        company: contractor.company || "",
        cidb_registration: contractor.cidb_registration || "",
        grade: contractor.grade || "",
        state: contractor.state || "",
        email: contractor.email || "",
        phone: contractor.phone || "",
      });
    }
  }, [contractor]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal
      title="Edit Contractor"
      open={!!contractor}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSubmit}>
          Save Changes
        </Button>,
      ]}
    >
      {!contractor ? (
        <p>No contractor selected.</p>
      ) : (
        <Form layout="vertical">
          <Form.Item label="Name">
            <Input name="name" value={formData.name} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="IC/Passport">
            <Input name="ic_passport" value={formData.ic_passport} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="Gender">
  <Select 
    value={formData.gender} 
    onChange={(value) => setFormData({ ...formData, gender: value })}
  >
    <Select.Option value="Male">Male</Select.Option>
    <Select.Option value="Female">Female</Select.Option>
  </Select>
</Form.Item>
          <Form.Item label="Position">
            <Input name="position" value={formData.position} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="Company">
            <Input name="company" value={formData.company} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="CIDB Registration">
            <Input name="cidb_registration" value={formData.cidb_registration} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="Grade">
            <Input name="grade" value={formData.grade} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="State">
            <Select value = {formData.state} onChange={(value) => setFormData({...formData, state: value})}
            >
              <Select.Option value="Wilayah Persekutuan Kuala Lumpur">Wilayah Persekutuan Kuala Lumpur</Select.Option>
              <Select.Option value="Selangor">Selangor</Select.Option>
              <Select.Option value="Negeri Sembilan">Negeri Sembilan</Select.Option>
              <Select.Option value="Pahang">Pahang</Select.Option>
              <Select.Option value="Terengganu">Terengganu</Select.Option>
              <Select.Option value="Kelantan">Kelantan</Select.Option>
              <Select.Option value="Kedah">Kedah</Select.Option>
              <Select.Option value="Perlis">Perlis</Select.Option>
              <Select.Option value="Perak">Perak</Select.Option>
              <Select.Option value="Johor">Johor</Select.Option>
              <Select.Option value="Sabah">Sabah</Select.Option>
              <Select.Option value="Sarawak">Sarawak</Select.Option>
              <Select.Option value="Melaka">Melaka</Select.Option>
              <Select.Option value="Pulau Pinang">Pulau Pinang</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Email">
            <Input name="email" value={formData.email} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="Phone">
            <Input name="phone" value={formData.phone} onChange={handleChange} />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default EditContractorModal;



