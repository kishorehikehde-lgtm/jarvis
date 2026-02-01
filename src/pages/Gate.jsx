import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Gate() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (code.trim().toLowerCase() === "kishore's jarvis") {
      sessionStorage.setItem("jarvis-auth", "true");
      navigate("/jarvis");
    } else {
      alert("Access Denied");
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        background: "#020408",
        color: "#00e5ff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
        gap: "20px",
      }}
    >
      <h1>Kishore’s Jarvis</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="enter the phrase"
          autoFocus
          style={{
            padding: "12px 18px",
            background: "transparent",
            border: "1px solid #00e5ff",
            color: "#00e5ff",
            fontSize: "16px",
            outline: "none",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 30px",
            background: "#00e5ff",
            color: "#020408",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Enter
        </button>
      </form>
    </div>
  );
}
