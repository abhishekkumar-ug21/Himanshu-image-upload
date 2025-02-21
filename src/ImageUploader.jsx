import React, { useState } from "react";
import axios from "axios";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setProcessedImages([]); // Reset previous images
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image to upload.");
    
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    
    try {
      const response = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProcessedImages(response.data.images);
      alert("Image uploaded and processed successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-lg text-center">
      <h2 className="text-xl font-bold mb-4">Upload an Image</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && <img src={preview} alt="Preview" className="mt-4 max-w-full h-auto" />}
      
      <button 
        onClick={handleUpload} 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload & Process"}
      </button>

      {processedImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Processed Images:</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {processedImages.map((img) => (
              <div key={img.size} className="border p-2">
                <p className="text-sm font-medium">{img.size}</p>
                <img src={img.url} alt={img.size} className="mt-2 max-w-full h-auto" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
