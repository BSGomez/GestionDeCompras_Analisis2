import React, { useMemo, useState, useRef } from "react";
import "./inputSizes.css";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { DataView } from "primereact/dataview";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { FileUpload } from "primereact/fileupload";

/* ================= MOCKS (cámbialos por tu API) ================= */
// Catálogos base
const mockPropositos = [
  { PRP_Proposito: 1, PRP_Nombre: "Reposición stock" },
  { PRP_Proposito: 2, PRP_Nombre: "Proyecto Infra TI" },
];
const mockJustificaciones = [
  { JUS_Justificacion_Comercial: 1, JUS_Nombre: "Demanda estacional" },
  { JUS_Justificacion_Comercial: 2, JUS_Nombre: "Nueva oficina" },
];
const mockEstadosSolicitud = [
  { EST_Estado_Solicitud: 1, EST_Nombre: "Borrador" },
  { EST_Estado_Solicitud: 2, EST_Nombre: "En revisión" },
  { EST_Estado_Solicitud: 3, EST_Nombre: "Aprobada" },
  { EST_Estado_Solicitud: 4, EST_Nombre: "Rechazada" },
];
const mockCategoriasCompra = [
  { CCO_Categoria_Compra: 1, CCO_Nombre: "Hardware" },
  { CCO_Categoria_Compra: 2, CCO_Nombre: "Servicios" },
];
const mockMonedas = [
  { MON_Moneda: 1, MON_Nombre: "Quetzal", codigo: "GTQ" },
  { MON_Moneda: 2, MON_Nombre: "Dólar", codigo: "USD" },
];
const mockProveedores = [
  { PRV_Proveedor: 1000, PRV_Nombre: "TecnoGT" },
  { PRV_Proveedor: 1001, PRV_Nombre: "RedesPlus" },
];

// Usuarios (creador/aprobadores)
const mockUsuarios = [
  { USR_Usuario: 1000, alias: "ana.l" },
  { USR_Usuario: 2000, alias: "luis.p" },
];

// Solicitudes y detalle (estructura compatible con PDS_SOLC / PDS_DETALLE_SOLC)
const mockSolicitudes = [
  {
    SOL_Solicitud: 5000,
    SOL_Nombre: "Compra laptops Q4",
    PRP_Proposito: 1,
    JUS_Justificacion_Comercial: 1,
    SOL_Fecha_Solicitud: "2025-08-20",
    SOL_Prioridad: 2,
    EST_Estado_Solicitud: 2,
    USR_Usuario: 1000,
    total: 2900,
    // Cotización (demo: none)
    COT_Adjunto: null,
  },
];

const mockDetalleSolicitudes = [
  // renglones de 5000
  {
    DSC_Detalle_Solc: 10,
    SOL_Solicitud: 5000,
    PRV_Proveedor: 1000,
    DSC_Nombre_Producto: 'Laptop 14"',
    CCO_Categoria_Compra: 1,
    DSC_Cantidad: 5,
    DSC_Precio_Unitario: 500,
    DSC_Monto_Neto: 2500,
    MON_Moneda: 2,
  },
  {
    DSC_Detalle_Solc: 11,
    SOL_Solicitud: 5000,
    PRV_Proveedor: 1000,
    DSC_Nombre_Producto: "Dock USB-C",
    CCO_Categoria_Compra: 1,
    DSC_Cantidad: 2,
    DSC_Precio_Unitario: 200,
    DSC_Monto_Neto: 400,
    MON_Moneda: 2,
  },
];

// Aprobadores de solicitud (PDS_APROBADOR)
const mockAprobadores = [
  { APR_Aprobador: 1, APR_Solicitud: 5000, APR_Comentario1: "OK", APR_Fecha_Aprobador: "2025-08-21", APR_Creado_Por: 2000 },
];

/* ================= COMPONENTE ================= */
export default function PurchaseRequestsModule() {
  const [active, setActive] = useState(0);

  // Estados de datos (mocks)
  const [solcs, setSolcs] = useState(mockSolicitudes);
  const [detalles, setDetalles] = useState(mockDetalleSolicitudes);
  const [aprobadores, setAprobadores] = useState(mockAprobadores);

  // Catálogos (luego se reemplazan por GETs)
  const [propositos] = useState(mockPropositos);
  const [justificaciones] = useState(mockJustificaciones);
  const [estadosSolicitud] = useState(mockEstadosSolicitud);
  const [categoriasCompra] = useState(mockCategoriasCompra);
  const [monedas] = useState(mockMonedas);
  const [proveedores] = useState(mockProveedores);
  const [usuarios] = useState(mockUsuarios);

  // Mapas memoizados
  const propositosById = useMemo(() => new Map(propositos.map(p => [p.PRP_Proposito, p])), [propositos]);
  const justifById     = useMemo(() => new Map(justificaciones.map(j => [j.JUS_Justificacion_Comercial, j])), [justificaciones]);
  const estadosById    = useMemo(() => new Map(estadosSolicitud.map(e => [e.EST_Estado_Solicitud, e])), [estadosSolicitud]);
  const categoriasById = useMemo(() => new Map(categoriasCompra.map(c => [c.CCO_Categoria_Compra, c])), [categoriasCompra]);
  const monedasById    = useMemo(() => new Map(monedas.map(m => [m.MON_Moneda, m])), [monedas]);
  const proveedoresById= useMemo(() => new Map(proveedores.map(p => [p.PRV_Proveedor, p])), [proveedores]);
  const usuariosById   = useMemo(() => new Map(usuarios.map(u => [u.USR_Usuario, u])), [usuarios]);

  // Búsquedas
  const [searchList, setSearchList] = useState("");
  const [searchApr, setSearchApr]   = useState("");

  // Formulario de solicitud (encabezado + renglones)
  const [encForm, setEncForm] = useState({
    SOL_Nombre: "",
    PRP_Proposito: null,
    JUS_Justificacion_Comercial: null,
    SOL_Prioridad: "Medio", // ← prioridad Alto/Medio/Bajo (si prefieres numérico, cambia aquí)
    EST_Estado_Solicitud: 1, // Borrador
    USR_Usuario: 1000,       // “creado por” vendrá por backend; aquí solo simulamos
  });

  // Adjunto de cotización (single)
  const [cotizacion, setCotizacion] = useState(null); // { file, name, size, url }
  const fileUploadRef = useRef(null);

  const [lineForm, setLineForm] = useState({
    PRV_Proveedor: null,
    DSC_Nombre_Producto: "",
    CCO_Categoria_Compra: null,
    DSC_Cantidad: 1,
    DSC_Precio_Unitario: 0,
    MON_Moneda: 1,
  });
  const [lineasTemp, setLineasTemp] = useState([]);

  // Totales
  const totalTemp = useMemo(
    () => lineasTemp.reduce((acc, r) => acc + (r.DSC_Cantidad || 0) * (r.DSC_Precio_Unitario || 0), 0),
    [lineasTemp]
  );

  const totalSolicitud = useMemo(() => {
    const agrupado = new Map();
    for (const d of detalles) {
      agrupado.set(d.SOL_Solicitud, (agrupado.get(d.SOL_Solicitud) || 0) + (d.DSC_Monto_Neto || 0));
    }
    const result = new Map();
    for (const s of solcs) result.set(s.SOL_Solicitud, agrupado.get(s.SOL_Solicitud) || 0);
    return result;
  }, [detalles, solcs]);

  // Listado filtrado
  const filteredList = useMemo(() => {
    const t = searchList.trim().toLowerCase();
    if (!t) return solcs;
    return solcs.filter(s => {
      const p = propositosById.get(s.PRP_Proposito)?.PRP_Nombre || "";
      const j = justifById.get(s.JUS_Justificacion_Comercial)?.JUS_Nombre || "";
      const e = estadosById.get(s.EST_Estado_Solicitud)?.EST_Nombre || "";
      return (
        String(s.SOL_Solicitud).includes(t) ||
        (s.SOL_Nombre || "").toLowerCase().includes(t) ||
        p.toLowerCase().includes(t) ||
        j.toLowerCase().includes(t) ||
        e.toLowerCase().includes(t)
      );
    });
  }, [searchList, solcs, propositosById, justifById, estadosById]);

  // Aprobadores filtrado
  const filteredApr = useMemo(() => {
    const t = searchApr.trim().toLowerCase();
    if (!t) return aprobadores;
    return aprobadores.filter(a => {
      const usr = usuariosById.get(a.APR_Creado_Por)?.alias || "";
      return String(a.APR_Solicitud).includes(t) || usr.toLowerCase().includes(t) || (a.APR_Comentario1 || "").toLowerCase().includes(t);
    });
  }, [searchApr, aprobadores, usuariosById]);

  // === Adjunto: handlers ===
  const onSelectCotizacion = (e) => {
    const file = e.files?.[0];
    if (!file) return;
    // Limita tipos si quieres estricto: application/pdf, image/*
    const url = URL.createObjectURL(file);
    setCotizacion({ file, name: file.name, size: file.size, url, type: file.type });
  };

  const onClearCotizacion = () => {
    if (cotizacion?.url) URL.revokeObjectURL(cotizacion.url);
    setCotizacion(null);
    fileUploadRef.current?.clear();
  };

  // === Acciones ===
  const addLineaTemp = () => {
    if (!lineForm.DSC_Nombre_Producto || !lineForm.CCO_Categoria_Compra || !lineForm.PRV_Proveedor) return;
    const linea = {
      id: Date.now(),
      ...lineForm,
      DSC_Cantidad: Number(lineForm.DSC_Cantidad) || 0,
      DSC_Precio_Unitario: Number(lineForm.DSC_Precio_Unitario) || 0,
    };
    setLineasTemp(prev => [linea, ...prev]);
    setLineForm({ PRV_Proveedor: null, DSC_Nombre_Producto: "", CCO_Categoria_Compra: null, DSC_Cantidad: 1, DSC_Precio_Unitario: 0, MON_Moneda: 1 });
  };

  const removeLineaTemp = (id) => setLineasTemp(prev => prev.filter(l => l.id !== id));

  const handleSaveSolicitud = () => {
    if (!encForm.SOL_Nombre || !encForm.PRP_Proposito || !encForm.JUS_Justificacion_Comercial || lineasTemp.length === 0) return;

    const nuevaId = Date.now();

    // 1) crear encabezado (incluye metadatos del adjunto)
    const nueva = {
      SOL_Solicitud: nuevaId,
      ...encForm,
      SOL_Fecha_Solicitud: new Date().toISOString().slice(0,10),
      total: totalTemp,
      COT_Adjunto: cotizacion
        ? { name: cotizacion.name, size: cotizacion.size, type: cotizacion.type, url: cotizacion.url }
        : null,
    };
    setSolcs(prev => [nueva, ...prev]);

    // 2) crear renglones
    const nuevosDet = lineasTemp.map(l => ({
      DSC_Detalle_Solc: Date.now() + Math.floor(Math.random()*1000),
      SOL_Solicitud: nuevaId,
      PRV_Proveedor: l.PRV_Proveedor,
      DSC_Nombre_Producto: l.DSC_Nombre_Producto,
      CCO_Categoria_Compra: l.CCO_Categoria_Compra,
      DSC_Cantidad: l.DSC_Cantidad,
      DSC_Precio_Unitario: l.DSC_Precio_Unitario,
      DSC_Monto_Neto: (l.DSC_Cantidad || 0) * (l.DSC_Precio_Unitario || 0),
      MON_Moneda: l.MON_Moneda,
    }));
    setDetalles(prev => [...nuevosDet, ...prev]);

    // reset
    setEncForm({
      SOL_Nombre: "",
      PRP_Proposito: null,
      JUS_Justificacion_Comercial: null,
      SOL_Prioridad: "Medio",
      EST_Estado_Solicitud: 1,
      USR_Usuario: 1000
    });
    setLineasTemp([]);
    // mantenemos el blob para que el botón “Ver adjunto” funcione aún después de guardar;
    // si prefieres limpiarlo:
    // onClearCotizacion();
    setActive(0);
  };

  const handleEnviarRevision = (s) => {
    setSolcs(prev => prev.map(x => x.SOL_Solicitud === s.SOL_Solicitud ? { ...x, EST_Estado_Solicitud: 2 } : x));
  };

  // === Templates ===
  const SolicitudCard = (s) => {
    const p = propositosById.get(s.PRP_Proposito)?.PRP_Nombre || "—";
    const j = justifById.get(s.JUS_Justificacion_Comercial)?.JUS_Nombre || "—";
    const e = estadosById.get(s.EST_Estado_Solicitud)?.EST_Nombre || "—";
    const total = totalSolicitud.get(s.SOL_Solicitud) ?? s.total ?? 0;

    const hasAdj = !!s.COT_Adjunto;

    return (
      <Card className="p-3">
        <div className="flex justify-content-between align-items-start gap-3">
          <div>
            <div className="font-medium text-lg">{s.SOL_Nombre}</div>
            <div className="text-500 text-sm">
              Solicitud: {s.SOL_Solicitud} · Fecha: {s.SOL_Fecha_Solicitud || "—"}
            </div>
            <div className="text-600 text-sm mt-1">
              Propósito: {p} · Justificación: {j}
            </div>
            <div className="text-600 text-sm mt-1">
              Prioridad: {s.SOL_Prioridad ?? "—"} · Total estimado: {total}
            </div>

            {hasAdj && (
              <div className="mt-2 flex align-items-center gap-2">
                <Tag value="Cotización adjunta" icon="pi pi-paperclip" />
                <Button
                  icon="pi pi-eye"
                  label="Ver adjunto"
                  text
                  onClick={() => {
                    if (s.COT_Adjunto?.url) {
                      window.open(s.COT_Adjunto.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex align-items-center gap-3">
            <Tag
              value={e}
              severity={
                e === "Aprobada" ? "success"
                : e === "Rechazada" ? "danger"
                : e === "En revisión" ? "warning"
                : "info"
              }
            />
            <div className="flex gap-2">
              <Button icon="pi pi-send" label="Enviar a revisión" onClick={() => handleEnviarRevision(s)} outlined />
              <Button icon="pi pi-pencil" rounded text aria-label="Editar" />
              <Button icon="pi pi-trash" rounded text aria-label="Eliminar" severity="danger" />
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const LineaTempRow = ({ l }) => {
    const prov = proveedoresById.get(l.PRV_Proveedor)?.PRV_Nombre || "—";
    const cat = categoriasById.get(l.CCO_Categoria_Compra)?.CCO_Nombre || "—";
    const mon = monedasById.get(l.MON_Moneda)?.codigo || "—";
    const neto = (l.DSC_Cantidad || 0) * (l.DSC_Precio_Unitario || 0);
    return (
      <div className="flex align-items-center justify-content-between p-2 border-200 border-round surface-card">
        <div className="text-sm">
          <div className="font-medium">{l.DSC_Nombre_Producto}</div>
          <div className="text-500">{prov} · {cat} · {mon}</div>
        </div>
        <div className="flex align-items-center gap-3">
          <span className="text-600">Cant: {l.DSC_Cantidad}</span>
          <span className="text-600">PU: {l.DSC_Precio_Unitario}</span>
          <span className="font-medium">Neto: {neto}</span>
          <Button icon="pi pi-times" rounded text severity="danger" onClick={() => removeLineaTemp(l.id)} />
        </div>
      </div>
    );
  };

  // === Tabs ===
  const ListadoTab = () => (
    <div className="flex flex-column gap-3">
        <div className="flex gap-3">
          <span className="p-input-icon-left flex-1">
            <i className="pi pi-search" />
            <InputText value={searchList} onChange={(e) => setSearchList(e.target.value)} placeholder="  Buscar por nombre, ID, propósito, estado…" className="w-full input-sm" />
          </span>
          <Button icon="pi pi-filter" label="Filter" outlined />
        </div>

      <DataView
        value={filteredList}
        layout="grid"
        paginator
        rows={6}
        itemTemplate={(item) => <div className="col-12">{SolicitudCard(item)}</div>}
      />
    </div>
  );

  const CrearTab = () => (
    <div className="flex flex-column gap-3">
      <Card>
  <div className="p-fluid grid formgrid align-items-end" style={{gap: '0.8rem 1.5rem', marginBottom: '0.7rem'}}>
          <div className="field col-12 md:col-6">
            <label>Nombre de la solicitud *</label>
              <InputText
                value={encForm.SOL_Nombre}
                onChange={(e) => setEncForm({ ...encForm, SOL_Nombre: e.target.value })}
                placeholder="Ej. Adquisición de equipos"
                className="input-lg"
              />
          </div>

          <div className="field col-12 md:col-3">
            <label>Propósito *</label>
            <Dropdown
              value={encForm.PRP_Proposito}
              options={propositos.map(p => ({ label: p.PRP_Nombre, value: p.PRP_Proposito }))}
              onChange={(e) => setEncForm({ ...encForm, PRP_Proposito: e.value })}
              placeholder="Selecciona"
              className="select-xl"
              filter
            />
          </div>

          <div className="field col-12 md:col-3">
            <label>Justificación *</label>
            <Dropdown
              value={encForm.JUS_Justificacion_Comercial}
              options={justificaciones.map(j => ({ label: j.JUS_Nombre, value: j.JUS_Justificacion_Comercial }))}
              onChange={(e) => setEncForm({ ...encForm, JUS_Justificacion_Comercial: e.value })}
              placeholder="Selecciona"
              className="select-xl"
              filter
            />
          </div>

          <div className="field col-12 md:col-3">
            <label>Prioridad</label>
            <Dropdown
              value={encForm.SOL_Prioridad}
              options={[
                { label: "Alto", value: "Alto" },
                { label: "Medio", value: "Medio" },
                { label: "Bajo", value: "Bajo" },
              ]}
              onChange={(e) => setEncForm({ ...encForm, SOL_Prioridad: e.value })}
              className="select-xs"
            />
          </div>

          {/* === Adjunto de cotización (encabezado) === */}
          <div className="field col-12 md:col-9">
            <label>Cotización (adjunto)</label>
            <FileUpload
              ref={fileUploadRef}
              name="cotizacion"
              mode="advanced"
              customUpload
              chooseLabel="Seleccionar archivo"
              uploadLabel="Guardar (no sube)"
              cancelLabel="Cancelar"
              accept=".pdf,.jpg,.jpeg,.png"
              maxFileSize={10 * 1024 * 1024}
              multiple={false}
              auto={false}
              onSelect={onSelectCotizacion}
              onClear={onClearCotizacion}
              emptyTemplate={
                <p className="m-0">
                  Arrastra y suelta aquí el archivo o haz clic en <b>Seleccionar archivo</b>.
                  (PDF/JPG/PNG, máx. 10MB)
                </p>
              }
            />
          </div>

          <div className="field col-12 md:col-3">
            <label>&nbsp;</label>
            {cotizacion ? (
              <div className="p-2 border-200 border-round surface-card flex align-items-center justify-content-between">
                <div className="text-sm">
                  <div className="font-medium">{cotizacion.name}</div>
                  <div className="text-500">{(cotizacion.size/1024).toFixed(1)} KB</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    icon="pi pi-eye"
                    rounded
                    text
                    onClick={() => window.open(cotizacion.url, "_blank", "noopener,noreferrer")}
                    aria-label="Ver adjunto"
                  />
                  <Button
                    icon="pi pi-times"
                    rounded
                    text
                    severity="danger"
                    onClick={onClearCotizacion}
                    aria-label="Quitar adjunto"
                  />
                </div>
              </div>
            ) : (
              <div className="text-500 p-2 border-200 border-round surface-card">Sin archivo</div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <div className="font-medium mb-3">Renglones</div>
        <div className="p-fluid grid formgrid">
          <div className="field col-12 md:col-4">
            <label>Proveedor *</label>
            <Dropdown
              value={lineForm.PRV_Proveedor}
              options={proveedores.map(p => ({ label: p.PRV_Nombre, value: p.PRV_Proveedor }))}
              onChange={(e) => setLineForm({ ...lineForm, PRV_Proveedor: e.value })}
              placeholder="Selecciona proveedor"
              className="select-xl"
              filter
            />
          </div>
          <div className="field col-12 md:col-6 pr-4" style={{minWidth: '340px', marginBottom: '0'}}>
            <label>Producto/Servicio *</label>
            <InputText
              value={lineForm.DSC_Nombre_Producto}
              onChange={(e) => setLineForm({ ...lineForm, DSC_Nombre_Producto: e.target.value })}
              placeholder='Ej. Laptop 14”'
              className="input-xl"
            />
          </div>
          <div className="field col-12 md:col-2 pr-4" style={{minWidth: '170px', marginBottom: '0'}}>
            <label>Categoría *</label>
            <Dropdown
              value={lineForm.CCO_Categoria_Compra}
              options={categoriasCompra.map(c => ({ label: c.CCO_Nombre, value: c.CCO_Categoria_Compra }))}
              onChange={(e) => setLineForm({ ...lineForm, CCO_Categoria_Compra: e.value })}
              placeholder="Selecciona categoría"
              className="select-lg"
              filter
            />
          </div>

          <div className="field col-6 md:col-1 mb-0 flex flex-column align-items-center justify-content-end" style={{minWidth: '90px', marginBottom: '0'}}>
            <label className="mb-1">Cantidad</label>
            <InputNumber
              value={lineForm.DSC_Cantidad}
              onValueChange={(e) => setLineForm({ ...lineForm, DSC_Cantidad: e.value ?? 0 })}
              min={0}
              className="input-xs text-center"
            />
          </div>
          <div className="field col-6 md:col-2 mb-0 flex flex-column align-items-center justify-content-end" style={{minWidth: '140px', marginBottom: '0'}}>
            <label className="mb-1">Precio Unitario</label>
            <InputNumber
              value={lineForm.DSC_Precio_Unitario}
              onValueChange={(e) => setLineForm({ ...lineForm, DSC_Precio_Unitario: e.value ?? 0 })}
              mode="decimal"
              minFractionDigits={2}
              className="input-sm text-center"
            />
          </div>
          <div className="field col-6 md:col-2 mb-0 flex flex-column align-items-center justify-content-end" style={{minWidth: '120px', marginBottom: '0'}}>
            <label className="mb-1">Moneda</label>
            <Dropdown
              value={lineForm.MON_Moneda}
              options={monedas.map(m => ({ label: `${m.MON_Nombre} (${m.codigo})`, value: m.MON_Moneda }))}
              onChange={(e) => setLineForm({ ...lineForm, MON_Moneda: e.value })}
              className="select-lg"
            />
          </div>
          <div className="field col-6 md:col-1 mb-0 flex align-items-center justify-content-end" style={{minWidth: '110px', marginBottom: '0'}}>
            <Button icon="pi pi-plus" label="Agregar renglón" onClick={addLineaTemp} className="w-full" />
          </div>
        </div>

        <div className="flex flex-column gap-2">
          {lineasTemp.length === 0 && <div className="text-500">No hay renglones aún.</div>}
          {lineasTemp.map(l => <LineaTempRow key={l.id} l={l} />)}
        </div>

        <Divider />
        <div className="flex align-items-center justify-content-between">
          <div className="font-medium">Total estimado: {totalTemp}</div>
          <div className="flex gap-2">
            <Button icon="pi pi-check" label="Guardar solicitud" onClick={handleSaveSolicitud} />
            <Button
              label="Cancelar"
              outlined
              onClick={() => {
                setEncForm({
                  SOL_Nombre: "",
                  PRP_Proposito: null,
                  JUS_Justificacion_Comercial: null,
                  SOL_Prioridad: "Medio",
                  EST_Estado_Solicitud: 1,
                  USR_Usuario: 1000
                });
                setLineasTemp([]);
                onClearCotizacion();
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const AprobacionesTab = () => (
    <div className="flex flex-column gap-3">
      <div className="flex gap-3">
        <span className="p-input-icon-left flex-1">
          <i className="pi pi-search" />
                <InputText value={searchApr} onChange={(e) => setSearchApr(e.target.value)} placeholder="  Buscar por solicitud / usuario / comentario" className="w-full input-sm" />
        </span>
      </div>

      <DataView
        value={filteredApr}
        layout="grid"
        paginator
        rows={8}
        itemTemplate={(a) => {
          const usr = usuariosById.get(a.APR_Creado_Por)?.alias || "—";
          return (
            <div className="col-12">
              <Card className="p-3">
                <div className="flex justify-content-between align-items-start gap-3">
                  <div>
                    <div className="font-medium text-lg">Solicitud #{a.APR_Solicitud}</div>
                    <div className="text-500 text-sm">Fecha: {a.APR_Fecha_Aprobador || "—"}</div>
                    <div className="text-600 text-sm mt-1">Comentario: {a.APR_Comentario1 || "—"}</div>
                  </div>
                  <Tag value={usr} />
                </div>
              </Card>
            </div>
          );
        }}
      />
    </div>
  );

  // Render
  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="title">Solicitudes de Compra</h2>
          <p className="subtitle">Crear, listar y enviar a aprobación</p>
        </div>
        <Button icon="pi pi-plus" label="Nueva solicitud" className="btn-pill-dark" onClick={() => setActive(1)} />
      </div>

      <TabView className="pill-tabs" activeIndex={active} onTabChange={(e) => setActive(e.index)}>
        <TabPanel header="Listado">
          <ListadoTab />
        </TabPanel>
        <TabPanel header="Crear solicitud">
          <CrearTab />
        </TabPanel>
        <TabPanel header="Aprobaciones">
          <AprobacionesTab />
        </TabPanel>
      </TabView>
    </div>
  );
}
