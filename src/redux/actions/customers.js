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

  export const addPurchase = (customerId, amount, forPeople, description, userId) => {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.REACT_APP_BACKEND}/customers/addPurchase`, {customerId, amount, forPeople, description, userId})
          .then((response) => {
            const customers = response.data.customers;
            dispatch({
              type: "addPurchase",
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

  export const addPayment = (customerId, amount, forPeople, description, userId) => {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.REACT_APP_BACKEND}/customers/addPayment`, {customerId, amount, forPeople, description, userId})
          .then((response) => {
            const customers = response.data.customers;
            dispatch({
              type: "addPayment",
              payload:  customers ,
            });
            resolve(); 
          })
          .catch((error) => {
            reject(error); 
          });
      });
    };
  };

  export const editCustomer = (customerId, name, phone) => {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.REACT_APP_BACKEND}/customers/editCustomer`, {customerId, name, phone})
          .then((response) => {
            const customer = response.data.customer;
            dispatch({
              type: "editCustomer",
              payload:{ customer, Id: customerId} ,
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
        .then((response) => {
          const customers = response.data.customers;
          dispatch({
            type: "deleteCustomer",
            payload: customers,
          });
        })
        .catch((error) => {
          console.error("Error while deleting:", error);
        });
    };
  };
 
  export const clearTransactionsHistory = (id) => {
    return (dispatch) => {
      axios
        .delete(`${process.env.REACT_APP_BACKEND}/customers/clearTransactionsHistory/${id}`)
        .then((response) => {
          const customers = response.data.customers;
          dispatch({
            type: "clearTransactionsHistory",
            payload: customers,
          });
        })
        .catch((error) => {
          console.error("Error while clearing:", error);
        });
    };
  };
 
  export const editTransaction = (customerId, transactionId, amount, forPeople, description, userId) => {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.REACT_APP_BACKEND}/customers/editTransaction`, {
            customerId,
            transactionId,
            amount,
            forPeople,
            description,
            userId,
          })
          .then((response) => {
            const customers = response.data.customers;
            dispatch({
              type: "editTransaction",
              payload: customers,
            });
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    };
  };
  
  
  export const deleteTransaction = (transactionId, customerId, userId) => {
    return (dispatch) => {
      axios
        .delete(`${process.env.REACT_APP_BACKEND}/customers/deleteTransaction/${transactionId}/${customerId}/${userId}`)
        .then((response) => {
          const customers = response.data.customers;
          dispatch({
            type: "deleteTransaction",
            payload: customers,
          });
        })
        .catch((error) => {
          console.error("Error while deleting:", error);
        });
    };
  };