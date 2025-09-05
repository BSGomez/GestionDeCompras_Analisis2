import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MenuPrincipal from "./MenuPrincipal";

// Módulos reales (archivos dentro de src/)
import UsersModule from "./UsersModule";
import PurchaseOrdersModule from "./PurchaseOrdersModule";
import PurchaseRequestsModule from "./PurchaseRequestsModule";
import SuppliersModule from "./SuppliersModule";
import BodegaModule from "./BodegaModule";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuPrincipal />} />
        <Route path="/users" element={<UsersModule />} />
        <Route path="/purchase-orders" element={<PurchaseOrdersModule />} />
        <Route path="/purchase-requests" element={<PurchaseRequestsModule />} />
        <Route path="/suppliers" element={<SuppliersModule />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/bodega" element={<BodegaModule />} />
      </Routes>
    </BrowserRouter>
  );
}