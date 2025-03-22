import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../css/login.css";
import { login } from "../redux/actions/users";
import { toast } from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login(name, password))
      .then(() => {
        setName("");
        setPassword("");
        navigate("/admin");
        toast.success("Logged in successfully!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response?.data?.message || "Login failed!");
      });
  };

  return (
    <div className="body">
      <div id="loginform">
        <FormHeader title="Login" />
        <form onSubmit={handleLogin}>
          <FormInput
            description="Name"
            placeholder="Enter your name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormInput
            description="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormButton title="Log in" />
        </form>
      </div>
    </div>
  );
}

const FormHeader = ({ title }) => <h2 id="headerTitle">{title}</h2>;

const FormButton = ({ title }) => (
  <div id="button" className="row">
    <button type="submit">{title}</button>
  </div>
);

const FormInput = ({ description, placeholder, type, value, onChange }) => (
  <div className="row">
    <label>{description}</label>
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} required />
  </div>
);

export default Login;
