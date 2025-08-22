import React, { useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';

/* === MOCK (luego los reemplazas con tu API) === */
const mockSuppliers = [
  {
    PRV_Proveedor: 1000,
    PRV_Nombre: 'TecnoGT',
    PRV_Direccion: 'Zona 4, Ciudad de Guatemala',
    PRV_Nit: '456789-1',
    PRV_Correo_Notificacion: 'ventas@tecnogt.com',
    CPR_Condicion_Proveedor: 1,
    FPG_Forma_Pago: 1,
    status: 'Activo',
    totalOrders: 45,
    phone: '+502 1234 5678',
    lastOrder: '2024-01-15'
  }
];

const condicionOptions = [
  { label: '30 días crédito', value: 1 },
  { label: 'Efectivo', value: 2 },
  { label: '15 días crédito', value: 3 }
];
const formaPagoOptions = [
  { label: 'BANTRAB - 123-001 (Monetaria)', value: 1 },
  { label: 'BANRURAL - 456-002 (Monetaria)', value: 2 },
  { label: 'Tarjeta de crédito', value: 3 }
];

export default function SuppliersModule() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [form, setForm] = useState({
    PRV_Nombre: '',
    PRV_Direccion: '',
    PRV_Nit: '',
    PRV_Correo_Notificacion: '',
    CPR_Condicion_Proveedor: null,
    FPG_Forma_Pago: null
  });

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return suppliers;
    return suppliers.filter(s =>
      (s.PRV_Nombre || '').toLowerCase().includes(t) ||
      String(s.PRV_Proveedor).includes(t) ||
      (s.PRV_Correo_Notificacion || '').toLowerCase().includes(t)
    );
  }, [search, suppliers]);

  const handleSaveSupplier = () => {
    if (!form.PRV_Nombre || !form.PRV_Direccion || !form.PRV_Correo_Notificacion) return;
    const nuevo = {
      PRV_Proveedor: Date.now(),
      ...form,
      status: 'Activo',
      totalOrders: 0,
      phone: ''
    };
    setSuppliers(prev => [nuevo, ...prev]);
    setForm({
      PRV_Nombre: '', PRV_Direccion: '', PRV_Nit: '', PRV_Correo_Notificacion: '',
      CPR_Condicion_Proveedor: null, FPG_Forma_Pago: null
    });
    setActiveIndex(0);
  };

  const itemTemplate = (supplier) => (
    <Card className="p-3" pt={{ header: 'pb-0' }}>
      <div className="flex justify-content-between align-items-start gap-3">
        <div className="flex gap-3">
          <div className="flex align-items-center justify-content-center"
               style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--icon-color)' }}>
            <i className="pi pi-building" style={{ fontSize: 22, color: 'var(--icon-color-icon)' }} />
          </div>
          <div>
            <div className="font-medium text-lg">{supplier.PRV_Nombre}</div>
            <div className="text-500 text-sm">ID: {supplier.PRV_Proveedor}</div>
            <div className="flex flex-wrap gap-4 text-600 text-sm mt-2">
              <span className="flex align-items-center gap-2">
                <i className="pi pi-envelope" />
                {supplier.PRV_Correo_Notificacion}
              </span>
              {supplier.phone && (
                <span className="flex align-items-center gap-2">
                  <i className="pi pi-phone" />
                  {supplier.phone}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex align-items-center gap-3">
          <div className="text-right">
            <Tag value={supplier.status} severity={supplier.status === 'Activo' ? 'success' : 'warning'} />
            <div className="text-500 text-sm mt-2">{supplier.totalOrders} pedidos</div>
          </div>
          <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded text aria-label="Editar" />
            <Button icon="pi pi-trash" rounded text aria-label="Eliminar" severity="danger" />
          </div>
        </div>
      </div>
    </Card>
  );

  /* ---- TABS CONTENT ---- */
  const ListTab = () => (
    <div className="flex flex-column gap-3">
      <div className="flex gap-3">
        <span className="p-input-icon-left flex-1">
          <i className="pi pi-search" />
          <InputText
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="  Buscar Proveedor"
            className="w-full"
          />
        </span>
        <Button icon="pi pi-filter" label="Filter" outlined />
      </div>

      <DataView
        value={filtered}
        layout="grid"
        paginator
        rows={6}
        itemTemplate={(item) => <div className="col-12">{itemTemplate(item)}</div>}
      />
    </div>
  );

  const AddSupplierTab = () => (
    <Card>
      <div className="p-fluid grid formgrid">
        <div className="field col-12 md:col-6">
          <label>Supplier Name *</label>
          <InputText
            value={form.PRV_Nombre}
            onChange={(e) => setForm({ ...form, PRV_Nombre: e.target.value })}
            placeholder="Enter supplier name"
          />
        </div>
        <div className="field col-12 md:col-6">
          <label>Tax ID (NIT)</label>
          <InputText
            value={form.PRV_Nit}
            onChange={(e) => setForm({ ...form, PRV_Nit: e.target.value })}
            placeholder="Enter tax ID"
          />
        </div>
        <div className="field col-12">
          <label>Address *</label>
          <InputTextarea
            value={form.PRV_Direccion}
            onChange={(e) => setForm({ ...form, PRV_Direccion: e.target.value })}
            rows={3}
            placeholder="Enter complete address"
          />
        </div>
        <div className="field col-12 md:col-6">
          <label>Contact Email *</label>
          <InputText
            type="email"
            value={form.PRV_Correo_Notificacion}
            onChange={(e) => setForm({ ...form, PRV_Correo_Notificacion: e.target.value })}
            placeholder="contact@supplier.com"
          />
        </div>
        <div className="field col-12 md:col-3">
          <label>Condition</label>
          <Dropdown
            value={form.CPR_Condicion_Proveedor}
            options={condicionOptions}
            onChange={(e) => setForm({ ...form, CPR_Condicion_Proveedor: e.value })}
            placeholder="Select condition"
            className="w-full"
          />
        </div>
        <div className="field col-12 md:col-3">
          <label>Payment Method</label>
          <Dropdown
            value={form.FPG_Forma_Pago}
            options={formaPagoOptions}
            onChange={(e) => setForm({ ...form, FPG_Forma_Pago: e.value })}
            placeholder="Select payment method"
            className="w-full"
          />
        </div>

        <Divider />
        <div className="flex gap-2">
          <Button icon="pi pi-check" label="Save Supplier" onClick={handleSaveSupplier} />
          <Button icon="pi pi-times" label="Cancel" outlined onClick={() => setActiveIndex(0)} />
        </div>
      </div>
    </Card>
  );

  /* ---- RENDER ---- */
  return (
    <div>
      {/* Encabezado como en tu imagen */}
      <div className="page-header">
        <div>
          <h2 className="title">Administracion de Proveedores</h2>
          <p className="subtitle">Crear y gestionar proveedores</p>
        </div>
        <Button
          icon="pi pi-plus"
          label="New Supplier"
          className="btn-pill-dark"
          onClick={() => setActiveIndex(1)}
        />
      </div>

      {/* Tabs tipo pill */}
      <TabView
        className="pill-tabs"
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel header="Suppliers List">
          <ListTab />
        </TabPanel>

        <TabPanel header="Create Supplier">
          <AddSupplierTab />
        </TabPanel>

        {/* Los siguientes son pestañas de configuración (placeholders).
            Puedes conectarlos a tus catálogos reales (Categorías, Monedas, Condiciones, Aprobadores) */}
        <TabPanel header="Category">
          <div className="text-600">Aquí colocarás el CRUD de categorías de proveedor…</div>
        </TabPanel>
        <TabPanel header="Currency">
          <div className="text-600">Aquí listarás/gestionarás las monedas (PDS_MONEDA)…</div>
        </TabPanel>
        <TabPanel header="Terms / Conditions">
          <div className="text-600">Gestión de condiciones, plazos, políticas…</div>
        </TabPanel>
        <TabPanel header="Approvers">
          <div className="text-600">Asignación de aprobadores por proveedor o por regla…</div>
        </TabPanel>
      </TabView>
    </div>
  );
}
