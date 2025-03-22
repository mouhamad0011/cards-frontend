import axios from "axios";

export const login = (name, password) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${process.env.REACT_APP_BACKEND}/users/login`, { name, password })
        .then((response) => {
          const token = response.data.token;
          const id = response.data.id;
          dispatch({
            type: "login",
            payload: { token, id },
          });
          localStorage.setItem("token",token);
          resolve(); 
        })
        .catch((error) => {
          reject(error); 
        });
    });
  };
};





  
 
 