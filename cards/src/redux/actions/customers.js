import axios from "axios";

export const addCustomer = (userId, name, phone) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${process.env.REACT_APP_BACKEND}/customers/addCustomer`, {userId, name, phone})
        .then((response) => {
          const customer = response.data.customer;
          dispatch({
            type: "addCustomer",
            payload: customer ,
          });
          resolve(); 
        })
        .catch((error) => {
          reject(error); 
        });
    });
  };
};

export const getCustomersByUser = (userId) => {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        axios
          .get(`${process.env.REACT_APP_BACKEND}/customers/getCustomersByUser/${userId}`)
          .then((response) => {
            const customers = response.data.customers;
            dispatch({
              type: "getCustomersByUser",
              payload: customers ,
            });
            resolve(); 
          })
          .catch((error) => {
            reject(error); 
          });
      });
    };
  };

  export const addPurchase = (customerId, amount, forPeople) => {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.REACT_APP_BACKEND}/customers/addPurchase`, {customerId, amount, forPeople})
          .then((response) => {
            const balance = response.data.balance;
            dispatch({
              type: "addPurchase",
              payload: balance ,
            });
            resolve(); 
          })
          .catch((error) => {
            reject(error); 
          });
      });
    };
  };

  export const addPayment = (customerId, amount, forPeople) => {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.REACT_APP_BACKEND}/customers/addPayment`, {customerId, amount, forPeople})
          .then((response) => {
            const balance = response.data.balance;
            dispatch({
              type: "addPayment",
              payload:  balance ,
            });
            resolve(); 
          })
          .catch((error) => {
            reject(error); 
          });
      });
    };
  };

  
  export const deleteCustomer = (id) => {
    return (dispatch) => {
      axios
        .delete(`${process.env.REACT_APP_BACKEND}/customers/deleteCustomer/${id}`)
        .then(() => {
          dispatch({
            type: "deleteCustomer",
            payload: id,
          });
        })
        .catch((error) => {
          console.error("Error while deleting:", error);
        });
    };
  };
 