import React, { useState } from "react";
import api from "@/lib/apiClient";

const UploadDocuments = () => {
  const [files, setFiles] = useState({
    twelfthCertificate: null,
    aadharCard: null,
    graduationCertificate: null,
    tenthCertificate: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (files.twelfthCertificate) formData.append("twelfthCertificate", files.twelfthCertificate);
    if (files.aadharCard) formData.append("aadharCard", files.aadharCard);
    if (files.graduationCertificate) formData.append("graduationCertificate", files.graduationCertificate);
    if (files.tenthCertificate) formData.append("tenthCertificate", files.tenthCertificate);

    try {
      setLoading(true);
      setMessage("");

      const res = await api.post("/tutor/upload-documents", formData);

      if (res.data.success) {
        setMessage("✅ Documents uploaded successfully");
      } else {
        setMessage("❌ Upload failed");
      }
    } catch (err) {
      console.error("ERROR 👉", err);
      if (err.response) {
        setMessage(`❌ ${err.response.data.message}`);
      } else {
        setMessage("❌ Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Upload Verification Documents</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label>12th Certificate / Marksheet</label>
        <input type="file" name="twelfthCertificate" onChange={handleChange} />

        <label>Aadhar Card (Identity Proof)</label>
        <input type="file" name="aadharCard" onChange={handleChange} />

        <label>Graduation Certificate / Degree</label>
        <input type="file" name="graduationCertificate" onChange={handleChange} />

        <label>10th Certificate / Marksheet</label>
        <input type="file" name="tenthCertificate" onChange={handleChange} />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Uploading..." : "Upload Documents"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadDocuments;

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};