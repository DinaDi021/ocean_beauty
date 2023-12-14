import React from "react";

import { AccountMaster } from "../../components/Account/AccountMaster";
import { AccountClient } from "../../components/Account/AccountUsers";
import { useAppSelector } from "../../hooks";

const PersonalAccount = () => {
  const { user } = useAppSelector((state) => state.auth);
  const userRole = user ? user.data.role : null;

  const renderAccountComponent = () => {
    if (userRole === "master") {
      return <AccountMaster />;
    } else if (userRole === "client") {
      return <AccountClient />;
    } else {
      return <div>Unsupported user role</div>;
    }
  };

  return (
    <>
      <>{renderAccountComponent()}</>
    </>
  );
};

export { PersonalAccount };
