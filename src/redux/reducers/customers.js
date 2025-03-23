const customerReducer = (state = [], action) => {
    switch (action.type) {
        case "getCustomersByUser":
          return action.payload;
        case "addCustomer":
          return [...state, action.payload];
        case "deleteCustomer":
          return state.filter((event) => event._id !== action.payload);
        case "addPayment":
          return action.payload;
        case "addPurchase":
          return action.payload;    
        case "editCustomer":
          return state.map((event) =>
            event._id === action.payload.Id ? action.payload.customer : event
          );
        default:
          return state;
      }
  };
  export default customerReducer;