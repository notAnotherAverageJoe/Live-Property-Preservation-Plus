// src/pages/UnitsPage.js
import React from "react";
import UnitsManager from "../components/UnitsManager";
import { useParams } from "react-router-dom";

const UnitsPage = () => {
  const { id: propertyId } = useParams();

  return (
    <div>
      <h2>Manage Units for Property {propertyId}</h2>
      <UnitsManager propertyId={propertyId} />
    </div>
  );
};

export default UnitsPage;
