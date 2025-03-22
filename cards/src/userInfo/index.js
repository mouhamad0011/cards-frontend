import { jwtDecode } from "jwt-decode";

export const getUserID = () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.id;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }
  return null;
};