import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [productName, setProductName] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    if (!productName) {
      alert("Please enter product name");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://ai-content-gen-backend-2ivg.onrender.com/generate",
        {
          productName,
        }
      );

      const formattedResult = response.data.result
  .split("\n")
  .filter((line) => line.trim() !== "")
  .map((line) => line.replace(/\*\*/g, ""));

setResult(formattedResult);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyContent = () => {
    navigator.clipboard.writeText(result.join("\n"));
    alert("Content copied!");
  };

  return (
    <div className="app">
      <div className="glass-card">
        <h1> AI-Content-Gen</h1>
        <p className="subtitle">
Generate Product Descriptions, Hooks, Captions & Ad Copy using AI        </p>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter Product Name..."
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />

          <button onClick={generateContent}>
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {loading && (
          <div className="loader">
            <div className="spinner"></div>
            <p>Generating AI Content...</p>
          </div>
        )}

        {result.length > 0 && (
          <div className="result-card">
            <div className="result-header">
              <h2>Generated Content</h2>
              <button onClick={copyContent}>
                Copy
              </button>
            </div>

            <div className="content-text">
  {result.map((line, index) => (
    <p key={index}>{line}</p>
  ))}
</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;