import React, { useState } from "react";
import api from "@/lib/apiClient";

const UploadDocuments = () => {
  const [files, setFiles] = useState({
    identityProof: null,
    educationProof: null,
    annexureB: null,
    bankDetails: null,
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

    // 🔥 validation
    if (
      !files.identityProof ||
      !files.educationProof ||
      !files.annexureB ||
      !files.bankDetails
    ) {
      setMessage("❌ Please upload all documents");
      return;
    }

    const formData = new FormData();
    formData.append("identityProof", files.identityProof);
    formData.append("educationProof", files.educationProof);
    formData.append("annexureB", files.annexureB);
    formData.append("bankDetails", files.bankDetails);

    try {
      setLoading(true);
      setMessage("");

      // 🔥 apiClient use (NO manual headers needed)
      // const res = await api.post(
      //   "/tutor/upload-documents",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );
      const res = await api.post(
  "/tutor/upload-documents",
  formData
);

console.log([...formData.entries()]);
      console.log("RESPONSE 👉", res.data);

      if (res.data.success) {
        setMessage("✅ Documents uploaded successfully");
      } else {
        setMessage("❌ Upload failed");
      }

    } catch (err) {
      console.error("ERROR 👉", err);

      // 🔥 better error handling
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
      <h2>Upload Documents</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        
        <label>Identity Proof</label>
        <input type="file" name="identityProof" onChange={handleChange} />

        <label>Education Proof</label>
        <input type="file" name="educationProof" onChange={handleChange} />

        <label>Annexure B (Signed)</label>
        <input type="file" name="annexureB" onChange={handleChange} />

        <label>Bank Details</label>
        <input type="file" name="bankDetails" onChange={handleChange} />

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