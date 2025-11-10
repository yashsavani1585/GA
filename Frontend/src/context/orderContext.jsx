import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orderData, setOrderData] = useState({
    items: [],
    summary: {
      total: 0,
      totalItems: 0,
      totalSavings: 0
    }
  });

  const [userDetails, setUserDetails] = useState({
    email: "",
    mobile: "",
    name: "",
    pincode: "",
    address: "",
    street: "",
    town: "",
    recipientMobile: "",
    landmark: "",
    gst: "",
    whatsapp: "",
    billingSame: true,
    deliveryType: "home"
  });

  const [isDetailsSaved, setIsDetailsSaved] = useState(false);

  const setOrder = (cartItems, orderSummary) => {
    setOrderData({
      items: cartItems,
      summary: orderSummary
    });
  };

  const saveUserDetails = (details) => {
    setUserDetails(details);
    setIsDetailsSaved(true);
  };

  const clearOrder = () => {
    setOrderData({
      items: [],
      summary: {
        total: 0,
        totalItems: 0,
        totalSavings: 0
      }
    });
    setUserDetails({
      email: "",
      mobile: "",
      name: "",
      pincode: "",
      address: "",
      street: "",
      town: "",
      recipientMobile: "",
      landmark: "",
      gst: "",
      whatsapp: "",
      billingSame: true,
      deliveryType: "home"
    });
    setIsDetailsSaved(false);
  };

  return (
    <OrderContext.Provider value={{
      orderData,
      userDetails,
      isDetailsSaved,
      setOrder,
      saveUserDetails,
      clearOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};