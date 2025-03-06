import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import "../styles/Login.css";
import { FcGoogle } from "react-icons/fc";

const Login = ({onLogin}) => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("✅ User Info:", result.user);

      const userData = {
        email: result.user.email,
        uid: result.user.uid,
      };

      const res = await fetch("http://localhost:4000/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      console.log("🎯 Backend response:", data);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        onLogin(data.token);
        console.log("📌 Redirecting...");
        navigate("/contractors");// 👈 Ganti navigate()
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("🔥 Google Login Error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="company-name">MTI</h2>
        <p className="login-subtext">Sign in to access your dashboard</p>
        <button className="google-btn" onClick={handleGoogleLogin}>
          <FcGoogle size={24} /> Continue with Google
        </button>
      </div>
    </div>
  );
};


export default Login;

