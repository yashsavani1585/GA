import React, { Suspense, lazy } from "react";

// Lazy load the Auth component
const Auth = lazy(() => import("../../components/Auth/Auth"));

const AuthPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Auth />
      </Suspense>
    </div>
  );
};

export default AuthPage;
