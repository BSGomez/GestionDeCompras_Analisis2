// src/BodegaModule.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";

/* ===================== MOCKS (cámbialos por tu API) ===================== */
const mockEmployees = [
  { EMP_Empleado: 100, nombre: "Ana López" },
  { EMP_Empleado: 200, nombre: "Luis Pérez" },
  { EMP_Empleado: 300, nombre: "María Díaz" },
];

const mockUsers = [
  { USR_Usuario: 1000, alias: "ana.l", EMP_Empleado: 100 },
  { USR_Usuario: 2000, alias: "luis.p", EMP_Empleado: 200 },
];

const mockBodegas = [
  { BOD_Bodega: 1, BOD_Nombre: "Bodega Central", BOD_Ubicacion: "Zona 4", EMP_Responsable: 200 },
  { BOD_Bodega: 2, BOD_Nombre: "Bodega Occidente", BOD_Ubicacion: "Quetzaltenango", EMP_Responsable: 100 },
];

const mockOC = [
  { OC_Orden: 7000, PRV_Proveedor: 1000, OC_Estado: 1, OC_Total: 3500 },
  { OC_Orden: 7001, PRV_Proveedor: 1001, OC_Estado: 1, OC_Total: 1800 },
];

const mockDetalleOC = [
  { DSC_OC: 10, OC_Orden: 7000, DSC_Nombre_Producto: "Laptop 14\"", DSC_Cantidad: 5, DSC_Precio_Unitario: 500 },
  { DSC_OC: 11, OC_Orden: 7000, DSC_Nombre_Producto: "Dock USB-C", DSC_Cantidad: 5, DSC_Precio_Unitario: 200 },
  { DSC_OC: 20, OC_Orden: 7001, DSC_Nombre_Producto: "Switch 24p", DSC_Cantidad: 2, DSC_Precio_Unitario: 900 },
];

const mockRecepciones = [
  { REC_ID: 1, OC_Orden: 7000, DSC_OC: 10, REC_Fecha_Recepcion: "2025-08-20", REC_Cantidad_Recibida: 2, REC_Observaciones: "Parcial", BOD_Bodega: 1, USR_Recibido_Por: 1000, REC_Estado: "Registrada" },
];

export default function BodegaModule() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  // ===== Estados catálogo / transacciones =====
  const [bodegas, setBodegas] = useState(mockBodegas);
  const [recepciones, setRecepciones] = useState(mockRecepciones);

  // ===== Formularios =====
  const [bodForm, setBodForm] = useState({ BOD_Nombre: "", BOD_Ubicacion: "", EMP_Responsable: null });
  const [recForm, setRecForm] = useState({
    OC_Orden: null,
    DSC_OC: null,
    BOD_Bodega: null,
    REC_Cantidad_Recibida: 1,
    REC_Observaciones: "",
    USR_Recibido_Por: null,
  });

  // ===== Búsquedas =====
  const [searchBodega, setSearchBodega] = useState("");
  const [searchRec, setSearchRec] = useState("");
  const [searchPend, setSearchPend] = useState("");

  // ===== Mapas memoizados =====
  const employeesById = useMemo(() => new Map(mockEmployees.map(e => [e.EMP_Empleado, e])), []);
  const usersById = useMemo(() => new Map(mockUsers.map(u => [u.USR_Usuario, u])), []);
  const bodegasById = useMemo(() => new Map(bodegas.map(b => [b.BOD_Bodega, b])), [bodegas]);
  const dscById = useMemo(() => new Map(mockDetalleOC.map(d => [d.DSC_OC, d])), []);

  // Lista de renglones por OC para el dropdown dependiente
  const detallePorOC = useMemo(() => {
    const map = new Map();
    for (const d of mockDetalleOC) {
      if (!map.has(d.OC_Orden)) map.set(d.OC_Orden, []);
      map.get(d.OC_Orden).push(d);
    }
    return map;
  }, []);

  // ===== Listados filtrados =====
  const filteredBodegas = useMemo(() => {
    const t = searchBodega.trim().toLowerCase();
    if (!t) return bodegas;
    return bodegas.filter(b =>
      (b.BOD_Nombre || "").toLowerCase().includes(t) ||
      (b.BOD_Ubicacion || "").toLowerCase().includes(t) ||
      (employeesById.get(b.EMP_Responsable)?.nombre || "").toLowerCase().includes(t)
    );
  }, [searchBodega, bodegas, employeesById]);

  const filteredRecepciones = useMemo(() => {
    const t = searchRec.trim().toLowerCase();
    if (!t) return recepciones;
    return recepciones.filter(r => {
      const dsc = dscById.get(r.DSC_OC);
      const bod = bodegasById.get(r.BOD_Bodega);
      const usr = usersById.get(r.USR_Recibido_Por);
      return (
        String(r.OC_Orden).includes(t) ||
        (dsc?.DSC_Nombre_Producto || "").toLowerCase().includes(t) ||
        (bod?.BOD_Nombre || "").toLowerCase().includes(t) ||
        (usr?.alias || "").toLowerCase().includes(t)
      );
    });
  }, [searchRec, recepciones, dscById, bodegasById, usersById]);

  // ===== Pendientes por recibir =====
  const pendientes = useMemo(() => {
    const recibidosPorDSC = new Map();
    for (const r of recepciones) {
      recibidosPorDSC.set(r.DSC_OC, (recibidosPorDSC.get(r.DSC_OC) || 0) + (r.REC_Cantidad_Recibida || 0));
    }
    return mockDetalleOC.map(d => {
      const recibida = recibidosPorDSC.get(d.DSC_OC) || 0;
      const saldo = Math.max(0, (d.DSC_Cantidad || 0) - recibida);
      return {
        OC_Orden: d.OC_Orden,
        DSC_OC: d.DSC_OC,
        producto: d.DSC_Nombre_Producto,
        cantidadOrdenada: d.DSC_Cantidad,
        cantidadRecibida: recibida,
        saldoPendiente: saldo,
        estado: saldo === 0 ? "Completo" : (recibida === 0 ? "Sin recibir" : "Parcial"),
      };
    });
  }, [recepciones]);

  const filteredPendientes = useMemo(() => {
    const t = searchPend.trim().toLowerCase();
    if (!t) return pendientes;
    return pendientes.filter(p =>
      String(p.OC_Orden).includes(t) ||
      String(p.DSC_OC).includes(t) ||
      (p.producto || "").toLowerCase().includes(t) ||
      (p.estado || "").toLowerCase().includes(t)
    );
  }, [searchPend, pendientes]);

  // ===== Acciones =====
  const handleSaveBodega = () => {
    if (!bodForm.BOD_Nombre || !bodForm.EMP_Responsable) return;
    const nuevo = { BOD_Bodega: Date.now(), ...bodForm };
    setBodegas(prev => [nuevo, ...prev]);
    setBodForm({ BOD_Nombre: "", BOD_Ubicacion: "", EMP_Responsable: null });
  };

  const handleSaveRecepcion = () => {
    if (!recForm.OC_Orden || !recForm.DSC_OC || !recForm.BOD_Bodega || !recForm.USR_Recibido_Por) return;
    if ((recForm.REC_Cantidad_Recibida || 0) < 1) return;

    const nueva = {
      REC_ID: Date.now(),
      OC_Orden: recForm.OC_Orden,
      DSC_OC: recForm.DSC_OC,
      REC_Fecha_Recepcion: new Date().toISOString().slice(0,10),
      REC_Cantidad_Recibida: recForm.REC_Cantidad_Recibida,
      REC_Observaciones: recForm.REC_Observaciones || "",
      BOD_Bodega: recForm.BOD_Bodega,
      USR_Recibido_Por: recForm.USR_Recibido_Por,
      REC_Estado: "Registrada",
    };
    setRecepciones(prev => [nueva, ...prev]);
    setActive(1);
    setRecForm({ OC_Orden: null, DSC_OC: null, BOD_Bodega: null, REC_Cantidad_Recibida: 1, REC_Observaciones: "", USR_Recibido_Por: null });
  };

  // ===== Tarjetas =====
  const BodegaCard = (b) => {
    const emp = employeesById.get(b.EMP_Responsable);
    return (
      <Card className="wh-card p-3">
        <div className="flex justify-content-between align-items-start gap-3">
          <div>
            <div className="font-medium text-lg">{b.BOD_Nombre}</div>
            <div className="text-500 text-sm">ID: {b.BOD_Bodega}</div>
            <div className="text-600 text-sm mt-2">Ubicación: {b.BOD_Ubicacion || "—"}</div>
            <div className="text-600 text-sm mt-1">Responsable: {emp?.nombre || "—"}</div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button icon="pi pi-pencil" label="Editar" rounded raised severity="secondary" />
            <Button icon="pi pi-trash" label="Eliminar" rounded raised severity="danger" />
          </div>
        </div>
      </Card>
    );
  };

  const RecepcionCard = (r) => {
    const d = dscById.get(r.DSC_OC);
    const b = bodegasById.get(r.BOD_Bodega);
    const u = usersById.get(r.USR_Recibido_Por);
    return (
      <Card className="wh-card p-3">
        <div className="flex justify-content-between align-items-start gap-3">
          <div className="flex flex-column gap-1">
            <div className="font-medium text-lg">OC #{r.OC_Orden} — {d?.DSC_Nombre_Producto}</div>
            <div className="text-500 text-sm">Renglón: {r.DSC_OC} · Fecha: {r.REC_Fecha_Recepcion}</div>
            <div className="text-600 text-sm">Bodega: {b?.BOD_Nombre || "—"} · Recibido: {r.REC_Cantidad_Recibida}</div>
            <div className="text-600 text-sm">Observaciones: {r.REC_Observaciones || "—"}</div>
            <div className="text-600 text-sm">Usuario: {u?.alias || r.USR_Recibido_Por}</div>
          </div>
          <Tag value={r.REC_Estado} icon="pi pi-check-circle" severity="success" className="wh-chip" rounded />
        </div>
      </Card>
    );
  };

  const estadoPendienteTag = (estado) => {
    if (estado === "Completo") return { severity: "success", icon: "pi pi-check-circle" };
    if (estado === "Parcial") return { severity: "warning", icon: "pi pi-clock" };
    return { severity: "danger", icon: "pi pi-times" };
  };

  const PendienteCard = (p) => {
    const { severity, icon } = estadoPendienteTag(p.estado);
    return (
      <Card className="wh-card p-3">
        <div className="flex justify-content-between align-items-start gap-3">
          <div className="flex flex-column gap-1">
            <div className="font-medium text-lg">OC #{p.OC_Orden} — {p.producto}</div>
            <div className="text-500 text-sm">Renglón: {p.DSC_OC}</div>
            <div className="text-600 text-sm">
              Ordenado: {p.cantidadOrdenada} · Recibido: {p.cantidadRecibida} · Saldo: {p.saldoPendiente}
            </div>
          </div>
          <Tag value={p.estado} icon={icon} severity={severity} className="wh-chip" rounded />
        </div>
      </Card>
    );
  };

  /* ===================== TABS ===================== */
  const BodegasTab = () => (
    <div className="flex flex-column gap-3">
      <div className="flex gap-3 align-items-center">
        <span className="p-input-icon-left flex-1">
          <i className="pi pi-search" />
          <InputText value={searchBodega} onChange={(e) => setSearchBodega(e.target.value)} placeholder="  Buscar bodega / ubicación / responsable" className="w-full" />
        </span>
      </div>

      <Card>
        <div className="p-3 border-round" style={{ background: "#f5f6f7", border: "1px solid #e6e7e9" }}>
          <div className="grid formgrid align-items-end">
            <div className="field col-12 md:col-3">
              <label>Nombre de Bodega *</label>
              <InputText value={bodForm.BOD_Nombre} onChange={(e) => setBodForm({ ...bodForm, BOD_Nombre: e.target.value })} placeholder="Ej. Bodega Central" />
            </div>
            <div className="field col-12 md:col-3">
              <label>Ubicación</label>
              <InputText value={bodForm.BOD_Ubicacion} onChange={(e) => setBodForm({ ...bodForm, BOD_Ubicacion: e.target.value })} placeholder="Ej. Zona 4" />
            </div>
            <div className="field col-12 md:col-3">
              <label>Responsable *</label>
              <Dropdown
                value={bodForm.EMP_Responsable}
                options={mockEmployees.map(e => ({ label: e.nombre, value: e.EMP_Empleado }))}
                onChange={(e) => setBodForm({ ...bodForm, EMP_Responsable: e.value })}
                placeholder="Responsable"
                className="w-full"
                filter
              />
            </div>
            <div className="field col-12 md:col-3 flex justify-content-end gap-2">
              <Button icon="pi pi-save" label="Guardar Bodega" raised severity="success" onClick={handleSaveBodega} />
              <Button icon="pi pi-times" label="Cancelar" raised outlined severity="secondary" onClick={() => setBodForm({ BOD_Nombre: "", BOD_Ubicacion: "", EMP_Responsable: null })} />
            </div>
          </div>
        </div>
      </Card>

      <DataView value={filteredBodegas} layout="grid" paginator rows={6} itemTemplate={(item) => <div className="col-12">{BodegaCard(item)}</div>} />
    </div>
  );

  const RecepcionesTab = () => {
    const opcionesOC = mockOC.map(o => ({ label: `OC #${o.OC_Orden}`, value: o.OC_Orden }));
    const opcionesDSC = recForm.OC_Orden ? (detallePorOC.get(recForm.OC_Orden) || []).map(d => ({
      label: `#${d.DSC_OC} — ${d.DSC_Nombre_Producto} (x${d.DSC_Cantidad})`, value: d.DSC_OC
    })) : [];
    return (
      <div className="flex flex-column gap-3">
        <div className="flex gap-3 align-items-center">
          <span className="p-input-icon-left flex-1">
            <i className="pi pi-search" />
            <InputText value={searchRec} onChange={(e) => setSearchRec(e.target.value)} placeholder="  Buscar por OC / producto / bodega / usuario" className="w-full" />
          </span>
        </div>

        <Card>
          <div className="p-3 border-round" style={{ background: "#f5f6f7", border: "1px solid #e6e7e9" }}>
            <div className="grid formgrid align-items-end">
              <div className="field col-12 md:col-3">
                <label>Orden de Compra *</label>
                <Dropdown value={recForm.OC_Orden} options={opcionesOC}
                          onChange={(e) => setRecForm({ ...recForm, OC_Orden: e.value, DSC_OC: null })}
                          placeholder="OC" className="w-full" filter />
              </div>
              <div className="field col-12 md:col-3">
                <label>Renglón *</label>
                <Dropdown value={recForm.DSC_OC} options={opcionesDSC}
                          onChange={(e) => setRecForm({ ...recForm, DSC_OC: e.value })}
                          placeholder="Renglón" className="w-full" filter />
              </div>
              <div className="field col-12 md:col-3">
                <label>Bodega *</label>
                <Dropdown value={recForm.BOD_Bodega}
                          options={bodegas.map(b => ({ label: b.BOD_Nombre, value: b.BOD_Bodega }))}
                          onChange={(e) => setRecForm({ ...recForm, BOD_Bodega: e.value })}
                          placeholder="Bodega" className="w-full" filter />
              </div>
              <div className="field col-12 md:col-3">
                <label>Cantidad a recibir *</label>
                <InputNumber value={recForm.REC_Cantidad_Recibida}
                             onValueChange={(e) => setRecForm({ ...recForm, REC_Cantidad_Recibida: Math.max(1, e.value ?? 1) })}
                             min={1} step={1} showButtons buttonLayout="horizontal"
                             decrementButtonIcon="pi pi-minus" incrementButtonIcon="pi pi-plus" />
              </div>

              <div className="field col-12">
                <label>Observaciones</label>
                <InputText value={recForm.REC_Observaciones}
                           onChange={(e) => setRecForm({ ...recForm, REC_Observaciones: e.target.value })}
                           placeholder="Notas de recepción" className="w-full" />
              </div>

              <div className="field col-12 md:col-4">
                <label>Recibido por *</label>
                <Dropdown value={recForm.USR_Recibido_Por}
                          options={mockUsers.map(u => ({ label: u.alias, value: u.USR_Usuario }))}
                          onChange={(e) => setRecForm({ ...recForm, USR_Recibido_Por: e.value })}
                          placeholder="Usuario" className="w-full" filter />
              </div>
              <div className="field col-12 md:col-8 flex justify-content-end gap-2">
                <Button icon="pi pi-check" label="Registrar Recepción" raised severity="success" onClick={handleSaveRecepcion} />
                <Button icon="pi pi-times" label="Cancelar" raised outlined severity="secondary"
                        onClick={() => setRecForm({ OC_Orden: null, DSC_OC: null, BOD_Bodega: null, REC_Cantidad_Recibida: 1, REC_Observaciones: "", USR_Recibido_Por: null })} />
              </div>
            </div>
          </div>
        </Card>

        <DataView value={filteredRecepciones} layout="grid" paginator rows={6}
                  itemTemplate={(item) => <div className="col-12">{RecepcionCard(item)}</div>} />
      </div>
    );
  };

  const PendientesTab = () => (
    <div className="flex flex-column gap-3">
      <div className="flex gap-3 align-items-center">
        <span className="p-input-icon-left flex-1">
          <i className="pi pi-search" />
          <InputText value={searchPend} onChange={(e) => setSearchPend(e.target.value)} placeholder="  Buscar por OC / renglón / producto / estado" className="w-full" />
        </span>
      </div>

      <DataView value={filteredPendientes} layout="grid" paginator rows={6}
                itemTemplate={(item) => <div className="col-12">{PendienteCard(item)}</div>} />
    </div>
  );

  // ===== Render =====
  return (
    <div>
      <style>{`
        .page-header-bar {
          background: #f5f6f7;
          border: 1px solid #e6e7e9;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 16px;
        }
        .wh-card {
          border-left: 4px solid #3b82f6;
          transition: box-shadow .2s ease, transform .1s ease;
        }
        .wh-card:hover {
          box-shadow: 0 6px 18px rgba(0,0,0,.08);
          transform: translateY(-1px);
        }
        .wh-chip {
          box-shadow: 0 2px 6px rgba(0,0,0,.06);
          font-weight: 600;
        }
      `}</style>

      <div className="page-header-bar flex align-items-center justify-content-between">
        <div>
          <h2 className="title m-0">Bodega</h2>
          <p className="subtitle m-0">Catálogo de bodegas y control de recepciones</p>
        </div>
        <div className="flex gap-2">
          <Button
            icon="pi pi-arrow-left"
            severity="danger"
            rounded
            raised
            size="small"
            aria-label="Atrás"
            onClick={() => navigate("/menu-principal")}
            tooltip="Regresar al menú principal"
          />
          <Button
            icon="pi pi-download"
            label="Nueva Recepción"
            onClick={() => setActive(1)}
            size="small"
            rounded
            raised
          />
        </div>
      </div>

      <TabView className="pill-tabs" activeIndex={active} onTabChange={(e) => setActive(e.index)}>
        <TabPanel header={<span style={{ display: "flex", alignItems: "center" }}><i className="pi pi-box" style={{ marginRight: 8 }} />Bodegas</span>}>
          <BodegasTab />
        </TabPanel>
        <TabPanel header={<span style={{ display: "flex", alignItems: "center" }}><i className="pi pi-download" style={{ marginRight: 8 }} />Recepciones</span>}>
          <RecepcionesTab />
        </TabPanel>
        <TabPanel header={<span style={{ display: "flex", alignItems: "center" }}><i className="pi pi-clock" style={{ marginRight: 8 }} />Pendientes por recibir</span>}>
          <PendientesTab />
        </TabPanel>
      </TabView>
    </div>
  );
}
