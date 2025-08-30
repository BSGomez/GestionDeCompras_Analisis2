import React, { useState } from 'react';
import AppLayout from './layout/AppLayout';
import SuppliersModule from './SuppliersModule';
import UsersModule from './UsersModule';
import BodegaModule from './BodegaModule';
import PurchaseRequestsModule from './PurchaseRequestsModule';
import PurchaseOrdersModule from './PurchaseOrdersModule';
import ApprovalsModule from './ApprovalsModule';
import ReportsModule from './ReportsModule';


// Mapa de vistas (módulos)
function Placeholder({ title }) {
  return (
    <div className="p-3">
      <h2 className="m-0">{title}</h2>
      <p className="text-600"></p>
    </div>
  );
}

export default function App() {
  const [activeKey, setActiveKey] = useState('proveedores');

  // Modelo del menú lateral
  const menuModel = [
    { label: 'Dashboard', icon: 'pi pi-home', key: 'dashboard', command: () => setActiveKey('dashboard') },
    { label: 'Proveedores', icon: 'pi pi-building', key: 'proveedores', command: () => setActiveKey('proveedores') },
    { label: 'Solicitudes', icon: 'pi pi-file-plus', key: 'solicitudes', command: () => setActiveKey('solicitudes') },
    { label: 'Órdenes de compra', icon: 'pi pi-shopping-cart', key: 'ordenes', command: () => setActiveKey('ordenes') },
    { label: 'Bodega', icon: 'pi pi-box', key: 'bodega', command: () => setActiveKey('bodega') },
    { label: 'Aprobaciones', icon: 'pi pi-check-circle', key: 'aprobaciones', command: () => setActiveKey('aprobaciones') },
    { label: 'Reportes', icon: 'pi pi-table', key: 'reportes', command: () => setActiveKey('reportes') },
    { label: 'Configuración', icon: 'pi pi-cog', key: 'config', command: () => setActiveKey('config') }
  ];

  return (
    <AppLayout
      menuModel={menuModel}
      activeKey={activeKey}
      onNavigate={(k) => setActiveKey(k)}
    >
      {activeKey === 'proveedores' && <SuppliersModule />}
      {activeKey === 'config' && <UsersModule />}
      {activeKey === 'bodega' && <BodegaModule />}
      {activeKey === 'solicitudes' && <PurchaseRequestsModule />}
      {activeKey === 'ordenes' && <PurchaseOrdersModule />}
      {activeKey === 'aprobaciones' && <ApprovalsModule />}
      {activeKey === 'reportes' && <ReportsModule />}

      {activeKey !== 'proveedores' && (
        <Placeholder
          title={
            {
               
            }[activeKey]
          }
        />
      )}
    </AppLayout>
  );
}
