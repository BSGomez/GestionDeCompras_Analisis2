import React, { useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';

/* === MOCKS (luego los reemplazas con tu API) === */
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

const formaPagoOptions = [
  { label: 'BANTRAB - 123-001 (Monetaria)', value: 1 },
  { label: 'BANRURAL - 456-002 (Monetaria)', value: 2 },
  { label: 'Tarjeta de crédito', value: 3 }
];

// Para Approvers (roles/empleados de referencia)
const mockRoles = [
  { ROL_Rol: 10, ROL_Descripcion: 'Solicitante' },
  { ROL_Rol: 20, ROL_Descripcion: 'Aprobador' },
  { ROL_Rol: 30, ROL_Descripcion: 'Bodega' },
  { ROL_Rol: 40, ROL_Descripcion: 'Contador' }
];

const mockEmployees = [
  { EMP_Empleado: 100, nombre: 'Ana López' },
  { EMP_Empleado: 200, nombre: 'Luis Pérez' },
  { EMP_Empleado: 300, nombre: 'María Díaz' }
];

export default function SuppliersModule() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [suppliers, setSuppliers] = useState(mockSuppliers);

  /* ----------------- CATÁLOGOS COMPLETADOS ----------------- */
  // Category
  const [catSearch, setCatSearch] = useState('');
  const [categories, setCategories] = useState([
    { CAT_Categoria: 1, CAT_Nombre: 'Servicios', estado: 'Activo', descripcion: 'Servicios generales' },
    { CAT_Categoria: 2, CAT_Nombre: 'MRO', estado: 'Activo', descripcion: 'Mantenimiento/Refacciones' },
  ]);
  const [catForm, setCatForm] = useState({ CAT_Nombre: '', descripcion: '', estado: 'Activo' });

  // Currency
  const [curSearch, setCurSearch] = useState('');
  const [currencies, setCurrencies] = useState([
    { MON_Moneda: 1, MON_Codigo: 'GTQ', MON_Nombre: 'Quetzal', MON_Simbolo: 'Q', tipoCambio: 1 },
    { MON_Moneda: 2, MON_Codigo: 'USD', MON_Nombre: 'Dólar', MON_Simbolo: '$', tipoCambio: 7.80 },
  ]);
  const [curForm, setCurForm] = useState({ MON_Codigo: '', MON_Nombre: '', MON_Simbolo: '', tipoCambio: null });

  // Terms / Conditions  (remplaza al condicionOptions fijo)
  const [termSearch, setTermSearch] = useState('');
  const [conditions, setConditions] = useState([
    { CPR_Condicion_Proveedor: 1, nombre: '30 días crédito', diasCredito: 30 },
    { CPR_Condicion_Proveedor: 2, nombre: 'Efectivo', diasCredito: 0 },
    { CPR_Condicion_Proveedor: 3, nombre: '15 días crédito', diasCredito: 15 },
  ]);
  const [termForm, setTermForm] = useState({ nombre: '', diasCredito: 0 });

  // Approvers (reglas de aprobación)
  const [appSearch, setAppSearch] = useState('');
  const [approvers, setApprovers] = useState([
    { APR_Id: 1, ROL_Rol: 20, EMP_Empleado: 200, limiteMonto: 5000 },
    { APR_Id: 2, ROL_Rol: 40, EMP_Empleado: 100, limiteMonto: 20000 },
  ]);
  const [appForm, setAppForm] = useState({ ROL_Rol: null, EMP_Empleado: null, limiteMonto: 0 });

  // Mapea ids a objetos (memo) para etiquetas rápidas
  const rolesById = useMemo(() => new Map(mockRoles.map(r => [r.ROL_Rol, r])), []);
  const employeesById = useMemo(() => new Map(mockEmployees.map(e => [e.EMP_Empleado, e])), []);

  // Opciones para dropdown de condiciones en el formulario de proveedores
  const condicionOptions = useMemo(
    () => conditions.map(c => ({ label: c.nombre, value: c.CPR_Condicion_Proveedor })),
    [conditions]
  );

  /* ----------------- FORMULARIO PROVEEDOR ----------------- */
  const [form, setForm] = useState({
    PRV_Nombre: '',
    PRV_Direccion: '',
    PRV_Nit: '',
    PRV_Correo_Notificacion: '',
    CPR_Condicion_Proveedor: null,
    FPG_Forma_Pago: null
  });

  /* ----------------- LISTAS / FILTROS ----------------- */
  const filteredSuppliers = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return suppliers;
    return suppliers.filter(s =>
      (s.PRV_Nombre || '').toLowerCase().includes(t) ||
      String(s.PRV_Proveedor).includes(t) ||
      (s.PRV_Correo_Notificacion || '').toLowerCase().includes(t)
    );
  }, [search, suppliers]);

  const filteredCategories = useMemo(() => {
    const t = catSearch.trim().toLowerCase();
    if (!t) return categories;
    return categories.filter(c =>
      (c.CAT_Nombre || '').toLowerCase().includes(t) ||
      (c.descripcion || '').toLowerCase().includes(t) ||
      (c.estado || '').toLowerCase().includes(t)
    );
  }, [catSearch, categories]);

  const filteredCurrencies = useMemo(() => {
    const t = curSearch.trim().toLowerCase();
    if (!t) return currencies;
    return currencies.filter(c =>
      (c.MON_Codigo || '').toLowerCase().includes(t) ||
      (c.MON_Nombre || '').toLowerCase().includes(t) ||
      (c.MON_Simbolo || '').toLowerCase().includes(t)
    );
  }, [curSearch, currencies]);

  const filteredTerms = useMemo(() => {
    const t = termSearch.trim().toLowerCase();
    if (!t) return conditions;
    return conditions.filter(c =>
      (c.nombre || '').toLowerCase().includes(t) ||
      String(c.diasCredito).includes(t)
    );
  }, [termSearch, conditions]);

  const filteredApprovers = useMemo(() => {
    const t = appSearch.trim().toLowerCase();
    if (!t) return approvers;
    return approvers.filter(a => {
      const rol = rolesById.get(a.ROL_Rol)?.ROL_Descripcion || '';
      const emp = employeesById.get(a.EMP_Empleado)?.nombre || '';
      return rol.toLowerCase().includes(t) ||
             emp.toLowerCase().includes(t) ||
             String(a.limiteMonto).includes(t);
    });
  }, [appSearch, approvers, rolesById, employeesById]);

  /* ----------------- ACCIONES ----------------- */
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

  const handleSaveCategory = () => {
    if (!catForm.CAT_Nombre) return;
    const nuevo = { CAT_Categoria: Date.now(), ...catForm };
    setCategories(prev => [nuevo, ...prev]);
    setCatForm({ CAT_Nombre: '', descripcion: '', estado: 'Activo' });
  };

  const handleSaveCurrency = () => {
    if (!curForm.MON_Codigo || !curForm.MON_Nombre || curForm.tipoCambio == null) return;
    const nuevo = { MON_Moneda: Date.now(), ...curForm };
    setCurrencies(prev => [nuevo, ...prev]);
    setCurForm({ MON_Codigo: '', MON_Nombre: '', MON_Simbolo: '', tipoCambio: null });
  };

  const handleSaveTerm = () => {
    if (!termForm.nombre || termForm.diasCredito == null) return;
    const nuevo = { CPR_Condicion_Proveedor: Date.now(), ...termForm };
    setConditions(prev => [nuevo, ...prev]);
    setTermForm({ nombre: '', diasCredito: 0 });
  };

  const handleSaveApprover = () => {
    if (!appForm.ROL_Rol || !appForm.EMP_Empleado) return;
    const nuevo = { APR_Id: Date.now(), ...appForm };
    setApprovers(prev => [nuevo, ...prev]);
    setAppForm({ ROL_Rol: null, EMP_Empleado: null, limiteMonto: 0 });
  };

  /* ----------------- TEMPLATES ----------------- */
  const supplierCard = (supplier) => (
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

  const categoryCard = (c) => (
    <Card className="p-3">
      <div className="flex justify-content-between align-items-start gap-3">
        <div>
          <div className="font-medium text-lg">{c.CAT_Nombre}</div>
          <div className="text-500 text-sm">ID: {c.CAT_Categoria}</div>
          <div className="text-600 text-sm mt-2">{c.descripcion || '—'}</div>
        </div>
        <div className="flex align-items-center gap-3">
          <Tag value={c.estado} severity={c.estado === 'Activo' ? 'success' : 'warning'} />
          <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded text aria-label="Editar" />
            <Button icon="pi pi-trash" rounded text aria-label="Eliminar" severity="danger" />
          </div>
        </div>
      </div>
    </Card>
  );

  const currencyCard = (c) => (
    <Card className="p-3">
      <div className="flex justify-content-between align-items-start gap-3">
        <div>
          <div className="font-medium text-lg">{c.MON_Nombre} ({c.MON_Codigo})</div>
          <div className="text-500 text-sm">ID: {c.MON_Moneda}</div>
          <div className="text-600 text-sm mt-2">
            Símbolo: {c.MON_Simbolo || '—'} · Tipo de cambio: {c.tipoCambio}
          </div>
        </div>
        <div className="flex gap-2">
          <Button icon="pi pi-pencil" rounded text aria-label="Editar" />
          <Button icon="pi pi-trash" rounded text aria-label="Eliminar" severity="danger" />
        </div>
      </div>
    </Card>
  );

  const termCard = (t) => (
    <Card className="p-3">
      <div className="flex justify-content-between align-items-start gap-3">
        <div>
          <div className="font-medium text-lg">{t.nombre}</div>
          <div className="text-500 text-sm">ID: {t.CPR_Condicion_Proveedor}</div>
          <div className="text-600 text-sm mt-2">Días de crédito: {t.diasCredito}</div>
        </div>
        <div className="flex gap-2">
          <Button icon="pi pi-pencil" rounded text aria-label="Editar" />
          <Button icon="pi pi-trash" rounded text aria-label="Eliminar" severity="danger" />
        </div>
      </div>
    </Card>
  );

  const approverCard = (a) => {
    const rol = rolesById.get(a.ROL_Rol)?.ROL_Descripcion || '—';
    const emp = employeesById.get(a.EMP_Empleado)?.nombre || '—';
    return (
      <Card className="p-3">
        <div className="flex justify-content-between align-items-start gap-3">
          <div>
            <div className="font-medium text-lg">Rol: {rol}</div>
            <div className="text-600 text-sm mt-1">Empleado: {emp}</div>
            <div className="text-600 text-sm mt-1">Límite de aprobación: {a.limiteMonto}</div>
          </div>
          <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded text aria-label="Editar" />
            <Button icon="pi pi-trash" rounded text aria-label="Eliminar" severity="danger" />
          </div>
        </div>
      </Card>
    );
  };

  /* ----------------- TABS ----------------- */
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
        value={filteredSuppliers}
        layout="grid"
        paginator
        rows={6}
        itemTemplate={(item) => <div className="col-12">{supplierCard(item)}</div>}
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
            filter
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

  const CategoryTab = () => (
    <div className="flex flex-column gap-3">
      <div className="flex gap-3">
        <span className="p-input-icon-left flex-1">
          <i className="pi pi-search" />
          <InputText
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            placeholder="  Buscar categoría"
            className="w-full"
          />
        </span>
      </div>

      <Card>
        <div className="p-fluid grid formgrid">
          <div className="field col-12 md:col-4">
            <label>Nombre *</label>
            <InputText
              value={catForm.CAT_Nombre}
              onChange={(e) => setCatForm({ ...catForm, CAT_Nombre: e.target.value })}
              placeholder="Ej. Servicios"
            />
          </div>
          <div className="field col-12 md:col-6">
            <label>Descripción</label>
            <InputText
              value={catForm.descripcion}
              onChange={(e) => setCatForm({ ...catForm, descripcion: e.target.value })}
              placeholder="Descripción de la categoría"
            />
          </div>
          <div className="field col-12 md:col-2">
            <label>Estado</label>
            <Dropdown
              value={catForm.estado}
              options={[{ label: 'Activo', value: 'Activo' }, { label: 'Inactivo', value: 'Inactivo' }]}
              onChange={(e) => setCatForm({ ...catForm, estado: e.value })}
              className="w-full"
            />
          </div>
          <Divider />
          <div className="flex gap-2">
            <Button icon="pi pi-check" label="Guardar Categoría" onClick={handleSaveCategory} />
            <Button icon="pi pi-times" label="Cancelar" outlined onClick={() => setCatForm({ CAT_Nombre: '', descripcion: '', estado: 'Activo' })} />
          </div>
        </div>
      </Card>

      <DataView
        value={filteredCategories}
        layout="grid"
        paginator
        rows={6}
        itemTemplate={(item) => <div className="col-12">{categoryCard(item)}</div>}
      />
    </div>
  );

  const CurrencyTab = () => (
    <div className="flex flex-column gap-3">
      <div className="flex gap-3">
        <span className="p-input-icon-left flex-1">
          <i className="pi pi-search" />
          <InputText
            value={curSearch}
            onChange={(e) => setCurSearch(e.target.value)}
            placeholder="  Buscar moneda"
            className="w-full"
          />
        </span>
      </div>

      <Card>
        <div className="p-fluid grid formgrid">
          <div className="field col-12 md:col-3">
            <label>Código *</label>
            <InputText
              value={curForm.MON_Codigo}
              onChange={(e) => setCurForm({ ...curForm, MON_Codigo: e.target.value.toUpperCase() })}
              placeholder="Ej. USD"
            />
          </div>
          <div className="field col-12 md:col-5">
            <label>Nombre *</label>
            <InputText
              value={curForm.MON_Nombre}
              onChange={(e) => setCurForm({ ...curForm, MON_Nombre: e.target.value })}
              placeholder="Ej. Dólar"
            />
          </div>
          <div className="field col-12 md:col-2">
            <label>Símbolo</label>
            <InputText
              value={curForm.MON_Simbolo}
              onChange={(e) => setCurForm({ ...curForm, MON_Simbolo: e.target.value })}
              placeholder="Ej. $"
            />
          </div>
          <div className="field col-12 md:col-2">
            <label>Tipo Cambio *</label>
            <InputNumber
              value={curForm.tipoCambio}
              onValueChange={(e) => setCurForm({ ...curForm, tipoCambio: e.value })}
              placeholder="Ej. 7.8"
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={4}
              className="w-full"
            />
          </div>
          <Divider />
          <div className="flex gap-2">
            <Button icon="pi pi-check" label="Guardar Moneda" onClick={handleSaveCurrency} />
            <Button icon="pi pi-times" label="Cancelar" outlined onClick={() => setCurForm({ MON_Codigo: '', MON_Nombre: '', MON_Simbolo: '', tipoCambio: null })} />
          </div>
        </div>
      </Card>

      <DataView
        value={filteredCurrencies}
        layout="grid"
        paginator
        rows={6}
        itemTemplate={(item) => <div className="col-12">{currencyCard(item)}</div>}
      />
    </div>
  );

  const TermsTab = () => (
    <div className="flex flex-column gap-3">
      <div className="flex gap-3">
        <span className="p-input-icon-left flex-1">
          <i className="pi pi-search" />
          <InputText
            value={termSearch}
            onChange={(e) => setTermSearch(e.target.value)}
            placeholder="  Buscar condición"
            className="w-full"
          />
        </span>
      </div>

      <Card>
        <div className="p-fluid grid formgrid">
          <div className="field col-12 md:col-8">
            <label>Nombre *</label>
            <InputText
              value={termForm.nombre}
              onChange={(e) => setTermForm({ ...termForm, nombre: e.target.value })}
              placeholder="Ej. 30 días crédito"
            />
          </div>
          <div className="field col-12 md:col-4">
            <label>Días de crédito *</label>
            <InputNumber
              value={termForm.diasCredito}
              onValueChange={(e) => setTermForm({ ...termForm, diasCredito: e.value ?? 0 })}
              placeholder="Ej. 30"
              mode="decimal"
              min={0}
              className="w-full"
            />
          </div>
          <Divider />
          <div className="flex gap-2">
            <Button icon="pi pi-check" label="Guardar Condición" onClick={handleSaveTerm} />
            <Button icon="pi pi-times" label="Cancelar" outlined onClick={() => setTermForm({ nombre: '', diasCredito: 0 })} />
          </div>
        </div>
      </Card>

      <DataView
        value={filteredTerms}
        layout="grid"
        paginator
        rows={6}
        itemTemplate={(item) => <div className="col-12">{termCard(item)}</div>}
      />
    </div>
  );

  const ApproversTab = () => (
    <div className="flex flex-column gap-3">
      <div className="flex gap-3">
        <span className="p-input-icon-left flex-1">
          <i className="pi pi-search" />
          <InputText
            value={appSearch}
            onChange={(e) => setAppSearch(e.target.value)}
            placeholder="  Buscar por rol/empleado/monto"
            className="w-full"
          />
        </span>
      </div>

      <Card>
        <div className="p-fluid grid formgrid">
          <div className="field col-12 md:col-4">
            <label>Rol *</label>
            <Dropdown
              value={appForm.ROL_Rol}
              options={mockRoles.map(r => ({ label: r.ROL_Descripcion, value: r.ROL_Rol }))}
              onChange={(e) => setAppForm({ ...appForm, ROL_Rol: e.value })}
              placeholder="Selecciona rol"
              className="w-full"
              filter
            />
          </div>
          <div className="field col-12 md:col-4">
            <label>Empleado *</label>
            <Dropdown
              value={appForm.EMP_Empleado}
              options={mockEmployees.map(e => ({ label: e.nombre, value: e.EMP_Empleado }))}
              onChange={(e) => setAppForm({ ...appForm, EMP_Empleado: e.value })}
              placeholder="Selecciona empleado"
              className="w-full"
              filter
            />
          </div>
          <div className="field col-12 md:col-4">
            <label>Límite de aprobación</label>
            <InputNumber
              value={appForm.limiteMonto}
              onValueChange={(e) => setAppForm({ ...appForm, limiteMonto: e.value ?? 0 })}
              placeholder="Ej. 10000"
              mode="decimal"
              className="w-full"
            />
          </div>
          <Divider />
          <div className="flex gap-2">
            <Button icon="pi pi-check" label="Guardar Regla" onClick={handleSaveApprover} />
            <Button icon="pi pi-times" label="Cancelar" outlined onClick={() => setAppForm({ ROL_Rol: null, EMP_Empleado: null, limiteMonto: 0 })} />
          </div>
        </div>
      </Card>

      <DataView
        value={filteredApprovers}
        layout="grid"
        paginator
        rows={6}
        itemTemplate={(item) => <div className="col-12">{approverCard(item)}</div>}
      />
    </div>
  );

  /* ----------------- RENDER ----------------- */
  return (
    <div>
      {/* Encabezado */}
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
      <TabView className="pill-tabs" activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Suppliers List">
          <ListTab />
        </TabPanel>
        <TabPanel header="Create Supplier">
          <AddSupplierTab />
        </TabPanel>

        {/* COMPLETADAS */}
        <TabPanel header="Category">
          <CategoryTab />
        </TabPanel>
        <TabPanel header="Currency">
          <CurrencyTab />
        </TabPanel>
        <TabPanel header="Terms / Conditions">
          <TermsTab />
        </TabPanel>
        <TabPanel header="Approvers">
          <ApproversTab />
        </TabPanel>
      </TabView>
    </div>
  );
}
