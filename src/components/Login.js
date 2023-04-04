import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import './Login.css';

function Login({ handleLogin, user, handleBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await handleLogin(username, password);
    if (!success) {
      setError("Invalid username or password");
    }
  };

  if (user) {
    return <Navigate to="/distributions" />;
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1 className="login-form-title">Login</h1>
        <div className="form-group">
          <label htmlFor="username" className="login-form-label">Username:</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="login-form-label">Password:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error && <p className="error-message">Invalid username or password</p>}
        <button type="submit" className="submit-btn">Login</button>
        <Link to="/" className="back-btn">Back</Link>
      </form>
    </div>
  );
}

export default Login;
