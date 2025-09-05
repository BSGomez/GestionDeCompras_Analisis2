import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 para navegar
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { DataView } from "primereact/dataview";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";

/* ===================== MOCKS (cámbialos por tu API) ===================== */
// Proveedores
const mockProveedores = [
  { PRV_Proveedor: 1000, PRV_Nombre: "TecnoGT" },
  { PRV_Proveedor: 1001, PRV_Nombre: "RedesPlus" },
];

// Monedas
const mockMonedas = [
  { MON_Moneda: 1, MON_Nombre: "Quetzal", codigo: "GTQ", simbolo: "Q" },
  { MON_Moneda: 2, MON_Nombre: "Dólar", codigo: "USD", simbolo: "$" },
];

// Formas de pago
const mockFormasPago = [
  { FPG_Forma_Pago: 1, FPG_Nombre: "BANTRAB - Monetaria 123-001" },
  { FPG_Forma_Pago: 2, FPG_Nombre: "BANRURAL - Monetaria 456-002" },
  { FPG_Forma_Pago: 3, FPG_Nombre: "Tarjeta de crédito" },
];

// Condiciones (crédito / contado)
const mockCondiciones = [
  { CPR_Condicion_Proveedor: 1, nombre: "30 días crédito", diasCredito: 30 },
  { CPR_Condicion_Proveedor: 2, nombre: "Efectivo", diasCredito: 0 },
  { CPR_Condicion_Proveedor: 3, nombre: "15 días crédito", diasCredito: 15 },
];

// Estados de OC (para etiquetas / flujo)
const ESTADOS_OC = {
  BORRADOR: 1,
  EN_REVISION: 2,
  APROBADA: 3,
  RECHAZADA: 4,
  CERRADA: 5,
};

const estadosOcCatalog = [
  { value: ESTADOS_OC.BORRADOR, label: "Borrador" },
  { value: ESTADOS_OC.EN_REVISION, label: "En revisión" },
  { value: ESTADOS_OC.APROBADA, label: "Aprobada" },
  { value: ESTADOS_OC.RECHAZADA, label: "Rechazada" },
  { value: ESTADOS_OC.CERRADA, label: "Cerrada" },
];

// Datos de ejemplo
const mockOC = [
  {
    OC_Orden: 7000,
    PRV_Proveedor: 1000,
    MON_Moneda: 2,
    FPG_Forma_Pago: 1,
    CPR_Condicion_Proveedor: 1,
    OC_Fecha_Emision: "2025-08-22",
    OC_Observaciones: "Entrega en 5 días",
    OC_Estado: ESTADOS_OC.EN_REVISION,
    OC_Total: 2900,
  },
];

const mockDetalleOC = [
  { DSC_OC: 10, OC_Orden: 7000, DSC_Nombre_Producto: 'Laptop 14"', DSC_Cantidad: 5, DSC_Precio_Unitario: 500, DSC_Monto_Neto: 2500, MON_Moneda: 2 },
  { DSC_OC: 11, OC_Orden: 7000, DSC_Nombre_Producto: "Dock USB-C", DSC_Cantidad: 2, DSC_Precio_Unitario: 200, DSC_Monto_Neto: 400, MON_Moneda: 2 },
];

// (Opcional) Solicitudes para “importar” renglones (si deseas convertir Solicitud → OC por proveedor)
const mockSolicitudes = [
  { SOL_Solicitud: 5000, nombre: "Compra laptops Q4" },
];
const mockDetalleSolicitudes = [
  { DSC_Detalle_Solc: 10, SOL_Solicitud: 5000, PRV_Proveedor: 1000, DSC_Nombre_Producto: 'Laptop 14"', DSC_Cantidad: 5, DSC_Precio_Unitario: 500, MON_Moneda: 2 },
  { DSC_Detalle_Solc: 11, SOL_Solicitud: 5000, PRV_Proveedor: 1000, DSC_Nombre_Producto: "Dock USB-C", DSC_Cantidad: 2, DSC_Precio_Unitario: 200, MON_Moneda: 2 },
];

/* ===================== COMPONENTE ===================== */
export default function PurchaseOrdersModule() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  // Estado principal
  const [ocs, setOcs] = useState(mockOC);
  const [detalles, setDetalles] = useState(mockDetalleOC);

  // Catálogos
  const [proveedores] = useState(mockProveedores);
  const [monedas] = useState(mockMonedas);
  const [formasPago] = useState(mockFormasPago);
  const [condiciones] = useState(mockCondiciones);

  // Mapas memo
  const proveedoresById = useMemo(() => new Map(proveedores.map(p => [p.PRV_Proveedor, p])), [proveedores]);
  const monedasById     = useMemo(() => new Map(monedas.map(m => [m.MON_Moneda, m])), [monedas]);
  const formasById      = useMemo(() => new Map(formasPago.map(f => [f.FPG_Forma_Pago, f])), [formasPago]);
  const condsById       = useMemo(() => new Map(condiciones.map(c => [c.CPR_Condicion_Proveedor, c])), [condiciones]);

  // Búsquedas
  const [searchList, setSearchList] = useState("");
  const filteredOC = useMemo(() => {
    const t = searchList.trim().toLowerCase();
    if (!t) return ocs;
    return ocs.filter(o => {
      const prv = proveedoresById.get(o.PRV_Proveedor)?.PRV_Nombre || "";
      const mon = monedasById.get(o.MON_Moneda)?.codigo || "";
      const est = estadosOcCatalog.find(e => e.value === o.OC_Estado)?.label || "";
      return (
        String(o.OC_Orden).includes(t) ||
        prv.toLowerCase().includes(t) ||
        mon.toLowerCase().includes(t) ||
        (o.OC_Observaciones || "").toLowerCase().includes(t) ||
        est.toLowerCase().includes(t)
      );
    });
  }, [searchList, ocs, proveedoresById, monedasById]);

  // Formulario encabezado OC
  const [encForm, setEncForm] = useState({
    PRV_Proveedor: null,
    MON_Moneda: 1,
    FPG_Forma_Pago: null,
    CPR_Condicion_Proveedor: null,
    OC_Observaciones: "",
  });

  // Formulario renglón
  const [lineForm, setLineForm] = useState({
    DSC_Nombre_Producto: "",
    DSC_Cantidad: 1,           // default 1
    DSC_Precio_Unitario: 0.01, // mínimo positivo
    MON_Moneda: 1,
  });

  // Renglones temporales
  const [lineasTemp, setLineasTemp] = useState([]);

  const totalTemp = useMemo(
    () => lineasTemp.reduce((acc, r) => acc + (r.DSC_Cantidad || 0) * (r.DSC_Precio_Unitario || 0), 0),
    [lineasTemp]
  );

  // Totales por OC
  const totalPorOC = useMemo(() => {
    const map = new Map();
    for (const d of detalles) {
      map.set(d.OC_Orden, (map.get(d.OC_Orden) || 0) + (d.DSC_Monto_Neto || 0));
    }
    const out = new Map();
    for (const o of ocs) out.set(o.OC_Orden, map.get(o.OC_Orden) || 0);
    return out;
  }, [detalles, ocs]);

  // Importar desde Solicitud (opcional)
  const [importSOLC, setImportSOLC] = useState({ SOL_Solicitud: null, PRV_Proveedor: null });
  const opcionesSOLC = mockSolicitudes.map(s => ({ label: `SOLC #${s.SOL_Solicitud} — ${s.nombre}`, value: s.SOL_Solicitud }));
  const opcionesPrvImport = proveedores.map(p => ({ label: p.PRV_Nombre, value: p.PRV_Proveedor }));
  const handleImportar = () => {
    if (!importSOLC.SOL_Solicitud || !importSOLC.PRV_Proveedor) return;
    const filas = mockDetalleSolicitudes.filter(d => d.SOL_Solicitud === importSOLC.SOL_Solicitud && d.PRV_Proveedor === importSOLC.PRV_Proveedor);
    if (filas.length === 0) return;
    const convertidas = filas.map(f => ({
      id: Date.now() + Math.floor(Math.random() * 1000),
      DSC_Nombre_Producto: f.DSC_Nombre_Producto,
      DSC_Cantidad: f.DSC_Cantidad,
      DSC_Precio_Unitario: f.DSC_Precio_Unitario,
      MON_Moneda: f.MON_Moneda,
    }));
    setLineasTemp(prev => [...convertidas, ...prev]);
    if (!encForm.PRV_Proveedor) {
      setEncForm(prev => ({ ...prev, PRV_Proveedor: importSOLC.PRV_Proveedor }));
    }
  };

  // Acciones
  const addLineaTemp = () => {
    if (!lineForm.DSC_Nombre_Producto?.trim()) return;

    const qty = Math.max(1, Number(lineForm.DSC_Cantidad) || 1);
    const pu  = Math.max(0.01, Number(lineForm.DSC_Precio_Unitario) || 0.01);

    const linea = {
      id: Date.now(),
      DSC_Nombre_Producto: lineForm.DSC_Nombre_Producto.trim(),
      DSC_Cantidad: qty,
      DSC_Precio_Unitario: pu,
      MON_Moneda: lineForm.MON_Moneda || encForm.MON_Moneda || 1,
    };
    setLineasTemp(prev => [linea, ...prev]);
    setLineForm({ DSC_Nombre_Producto: "", DSC_Cantidad: 1, DSC_Precio_Unitario: 0.01, MON_Moneda: encForm.MON_Moneda || 1 });
  };

  const removeLineaTemp = (id) => setLineasTemp(prev => prev.filter(l => l.id !== id));

  const handleSaveOC = () => {
    if (!encForm.PRV_Proveedor || !encForm.MON_Moneda || !encForm.FPG_Forma_Pago || !encForm.CPR_Condicion_Proveedor) return;
    if (lineasTemp.length === 0) return;

    const validas = lineasTemp.filter(l => (l.DSC_Cantidad || 0) >= 1 && (l.DSC_Precio_Unitario || 0) > 0);
    if (validas.length === 0) return;

    const total = validas.reduce((acc, r) => acc + r.DSC_Cantidad * r.DSC_Precio_Unitario, 0);

    const nuevaOC = {
      OC_Orden: Date.now(),
      PRV_Proveedor: encForm.PRV_Proveedor,
      MON_Moneda: encForm.MON_Moneda,
      FPG_Forma_Pago: encForm.FPG_Forma_Pago,
      CPR_Condicion_Proveedor: encForm.CPR_Condicion_Proveedor,
      OC_Fecha_Emision: new Date().toISOString().slice(0, 10),
      OC_Observaciones: encForm.OC_Observaciones || "",
      OC_Estado: ESTADOS_OC.BORRADOR,
      OC_Total: total,
    };
    setOcs(prev => [nuevaOC, ...prev]);

    const nuevosDet = validas.map(l => ({
      DSC_OC: Date.now() + Math.floor(Math.random() * 1000),
      OC_Orden: nuevaOC.OC_Orden,
      DSC_Nombre_Producto: l.DSC_Nombre_Producto,
      DSC_Cantidad: l.DSC_Cantidad,
      DSC_Precio_Unitario: l.DSC_Precio_Unitario,
      DSC_Monto_Neto: l.DSC_Cantidad * l.DSC_Precio_Unitario,
      MON_Moneda: l.MON_Moneda,
    }));
    setDetalles(prev => [...nuevosDet, ...prev]);

    setEncForm({ PRV_Proveedor: null, MON_Moneda: 1, FPG_Forma_Pago: null, CPR_Condicion_Proveedor: null, OC_Observaciones: "" });
    setLineasTemp([]);
    setImportSOLC({ SOL_Solicitud: null, PRV_Proveedor: null });
    setActive(0);
  };

  const handleEnviarRevision = (o) => {
    setOcs(prev => prev.map(x => x.OC_Orden === o.OC_Orden ? { ...x, OC_Estado: ESTADOS_OC.EN_REVISION } : x));
  };

  const handleVolverBorrador = (o) => {
    setOcs(prev => prev.map(x => x.OC_Orden === o.OC_Orden ? { ...x, OC_Estado: ESTADOS_OC.BORRADOR } : x));
  };

  // Helpers UI
  const estadoText = (val) => estadosOcCatalog.find(e => e.value === val)?.label || "—";
  const estadoSeverity = (val) =>
    val === ESTADOS_OC.APROBADA ? "success" :
    val === ESTADOS_OC.RECHAZADA ? "danger" :
    val === ESTADOS_OC.EN_REVISION ? "warning" :
    val === ESTADOS_OC.CERRADA ? "secondary" : "info";

  /* ===================== LISTADO / CARD ===================== */
  const OCCard = (o) => {
    const prv = proveedoresById.get(o.PRV_Proveedor)?.PRV_Nombre || "—";
    const mon = monedasById.get(o.MON_Moneda)?.codigo || "—";
    const fpg = formasById.get(o.FPG_Forma_Pago)?.FPG_Nombre || "—";
    const cnd = condsById.get(o.CPR_Condicion_Proveedor)?.nombre || "—";
    const total = totalPorOC.get(o.OC_Orden) ?? o.OC_Total ?? 0;

    return (
      <Card className="po-card p-3">
        <div className="flex flex-column gap-2">
          {/* Línea superior: Título + estado al lado del proveedor */}
          <div className="flex align-items-center gap-2 flex-wrap">
            <div className="font-medium text-lg">
              OC #{o.OC_Orden} — {prv}
            </div>
            {/* Estado inline, con reloj cuando es EN_REVISION */}
            <Tag
              value={estadoText(o.OC_Estado)}
              severity={estadoSeverity(o.OC_Estado)}
              icon={o.OC_Estado === ESTADOS_OC.EN_REVISION ? "pi pi-clock" : undefined}
              className="po-chip-inline"
              rounded
            />
          </div>

          {/* Resto de info */}
          <div className="text-500 text-sm">
            Fecha: {o.OC_Fecha_Emision || "—"} · Moneda: {mon}
          </div>
          <div className="text-600 text-sm">Pago: {fpg} · Condición: {cnd}</div>
          <div className="text-600 text-sm">Obs: {o.OC_Observaciones || "—"}</div>
          <div className="font-medium mt-1">Total: {total}</div>

          {/* Acciones */}
          <div className="flex gap-2 flex-wrap justify-content-end pt-2">
            {o.OC_Estado === ESTADOS_OC.BORRADOR && (
              <Button
                icon="pi pi-send"
                label="Enviar a aprobación"
                severity="help"
                raised
                rounded
                onClick={() => handleEnviarRevision(o)}
              />
            )}

            {o.OC_Estado === ESTADOS_OC.EN_REVISION && (
              <Button
                icon="pi pi-history"
                label="Borrador"
                severity="danger"
                raised
                rounded
                onClick={() => handleVolverBorrador(o)}
                tooltip="Volver a borrador"
              />
            )}

            <Button
              icon="pi pi-pencil"
              label="Editar"
              rounded
              raised
              severity="secondary"
            />
            <Button
              icon="pi pi-trash"
              label="Eliminar"
              rounded
              raised
              severity="danger"
            />
          </div>
        </div>
      </Card>
    );
  };

  const LineaTempRow = ({ l }) => {
    const mon = monedasById.get(l.MON_Moneda)?.codigo || "—";
    const neto = (l.DSC_Cantidad || 0) * (l.DSC_Precio_Unitario || 0);
    return (
      <div className="flex align-items-center justify-content-between p-2 border-200 border-round surface-card">
        <div className="text-sm">
          <div className="font-medium">{l.DSC_Nombre_Producto}</div>
          <div className="text-500">{mon}</div>
        </div>
        <div className="flex align-items-center gap-3">
          <span className="text-600">Cant: {l.DSC_Cantidad}</span>
          <span className="text-600">PU: {l.DSC_Precio_Unitario}</span>
          <span className="font-medium">Neto: {neto}</span>
          <Button icon="pi pi-times" rounded text severity="danger" size="small" onClick={() => removeLineaTemp(l.id)} />
        </div>
      </div>
    );
  };

  /* ===================== TABS ===================== */
  const ListadoTab = () => (
    <div className="flex flex-column gap-3">
      <div className="flex gap-3 align-items-center">
        <span className="p-input-icon-left flex-1">
          <i className="pi pi-search" />
          <InputText
            value={searchList}
            onChange={(e) => setSearchList(e.target.value)}
            placeholder="  Buscar por OC, proveedor, estado, moneda…"
            className="w-full"
          />
        </span>
        <Button icon="pi pi-filter" label="Filtrar" outlined />
      </div>

      <DataView
        value={filteredOC}
        layout="grid"
        paginator
        rows={6}
        itemTemplate={(item) => <div className="col-12">{OCCard(item)}</div>}
      />
    </div>
  );

  const CrearOCTab = () => (
    <div className="flex flex-column gap-3">
      <Card>
        {/* Contenedor encabezado gris */}
        <div
          className="p-3 border-round"
          style={{ background: "#f5f6f7", border: "1px solid #e6e7e9" }}
        >
          <div className="grid formgrid align-items-end">
            {/* Fila 1: Proveedor, Moneda, Condición, Forma de Pago */}
            <div className="field col-12 md:col-3">
              <label>Proveedor *</label>
              <Dropdown
                value={encForm.PRV_Proveedor}
                options={proveedores.map(p => ({ label: p.PRV_Nombre, value: p.PRV_Proveedor }))}
                onChange={(e) => setEncForm({ ...encForm, PRV_Proveedor: e.value })}
                className="w-full"
                placeholder="Proveedor"
                filter
              />
            </div>
            <div className="field col-6 md:col-2">
              <label>Moneda *</label>
              <Dropdown
                value={encForm.MON_Moneda}
                options={monedas.map(m => ({ label: m.codigo, value: m.MON_Moneda }))}
                onChange={(e) => setEncForm({ ...encForm, MON_Moneda: e.value })}
                className="w-full"
              />
            </div>
            <div className="field col-6 md:col-3">
              <label>Condición *</label>
              <Dropdown
                value={encForm.CPR_Condicion_Proveedor}
                options={condiciones.map(c => ({ label: c.nombre, value: c.CPR_Condicion_Proveedor }))}
                onChange={(e) => setEncForm({ ...encForm, CPR_Condicion_Proveedor: e.value })}
                className="w-full"
                filter
              />
            </div>
            <div className="field col-12 md:col-4">
              <label>Forma de Pago *</label>
              <Dropdown
                value={encForm.FPG_Forma_Pago}
                options={formasPago.map(f => ({ label: f.FPG_Nombre, value: f.FPG_Forma_Pago }))}
                onChange={(e) => setEncForm({ ...encForm, FPG_Forma_Pago: e.value })}
                className="w-full"
                filter
              />
            </div>

            {/* Fila 2: Observaciones toda la línea */}
            <div className="field col-12">
              <label>Observaciones</label>
              <InputText
                value={encForm.OC_Observaciones}
                onChange={(e) => setEncForm({ ...encForm, OC_Observaciones: e.target.value })}
                placeholder="Notas / términos adicionales"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="font-medium mb-3">Renglones</div>

        {/* Importar desde Solicitud (opcional) */}
        <div className="p-fluid grid formgrid align-items-end">
          <div className="field col-12 md:col-5">
            <label>Importar de Solicitud de Compra</label>
            <Dropdown
              value={importSOLC.SOL_Solicitud}
              options={opcionesSOLC}
              onChange={(e) => setImportSOLC(prev => ({ ...prev, SOL_Solicitud: e.value }))}
              placeholder="Selecciona Solicitud"
              className="w-full"
              filter
            />
          </div>
          <div className="field col-12 md:col-5">
            <label>Proveedor de la solicitud</label>
            <Dropdown
              value={importSOLC.PRV_Proveedor}
              options={opcionesPrvImport}
              onChange={(e) => setImportSOLC(prev => ({ ...prev, PRV_Proveedor: e.value }))}
              placeholder="Proveedor a importar"
              className="w-full"
              filter
            />
          </div>
          <div className="field col-12 md:col-2 flex md:justify-content-end">
            <Button icon="pi pi-download" label="Importar" outlined size="small" onClick={handleImportar} />
          </div>
        </div>

        {/* Alta manual de renglones */}
        <div className="p-fluid grid formgrid align-items-end">
          <div className="field col-12 md:col-5">
            <label>Producto/Servicio *</label>
            <InputText
              value={lineForm.DSC_Nombre_Producto}
              onChange={(e) => setLineForm({ ...lineForm, DSC_Nombre_Producto: e.target.value })}
              placeholder="Ej. Laptop 14”"
            />
          </div>
          <div className="field col-6 md:col-2">
            <label>Cantidad</label>
            <InputNumber
              value={lineForm.DSC_Cantidad}
              onValueChange={(e) => setLineForm({ ...lineForm, DSC_Cantidad: Math.max(1, e.value ?? 1) })}
              min={1}
              step={1}
              showButtons
              buttonLayout="horizontal"
              decrementButtonIcon="pi pi-minus"
              incrementButtonIcon="pi pi-plus"
            />
          </div>
          <div className="field col-6 md:col-3">
            <label>Precio Unitario</label>
            <InputNumber
              value={lineForm.DSC_Precio_Unitario}
              onValueChange={(e) => setLineForm({ ...lineForm, DSC_Precio_Unitario: Math.max(0.01, e.value ?? 0.01) })}
              min={0.01}
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={2}
            />
          </div>
          <div className="field col-6 md:col-2">
            <label>Moneda</label>
            <Dropdown
              value={lineForm.MON_Moneda}
              options={monedas.map(m => ({ label: m.codigo, value: m.MON_Moneda }))}
              onChange={(e) => setLineForm({ ...lineForm, MON_Moneda: e.value })}
            />
          </div>

          {/* Agregar renglón compacto (no 100%) */}
          <div className="field col-12 md:col-12 flex justify-content-end">
            <Button
              icon="pi pi-plus-circle"
              label="Agregar renglón"
              size="small"
              rounded
              raised
              severity="help"
              onClick={addLineaTemp}
              className="btn-auto"
              style={{ width: "auto" }}
            />
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
            <Button icon="pi pi-save" label="Guardar OC" raised severity="success" onClick={handleSaveOC} />
            <Button
              icon="pi pi-times"
              label="Cancelar"
              raised
              outlined
              severity="secondary"
              onClick={() => {
                setEncForm({ PRV_Proveedor: null, MON_Moneda: 1, FPG_Forma_Pago: null, CPR_Condicion_Proveedor: null, OC_Observaciones: "" });
                setLineasTemp([]);
                setImportSOLC({ SOL_Solicitud: null, PRV_Proveedor: null });
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );

  // Render
  return (
    <div>
      {/* Estilos: encabezado, tarjetas de listado y chip inline */}
      <style>{`
        .page-header-bar {
          background: #f5f6f7;
          border: 1px solid #e6e7e9;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 16px;
        }
        .btn-auto.p-button { width: auto !important; padding-inline: 0.75rem !important; }

        .po-card {
          border-left: 4px solid #3b82f6;
          transition: box-shadow .2s ease, transform .1s ease;
        }
        .po-card:hover {
          box-shadow: 0 6px 18px rgba(0,0,0,.08);
          transform: translateY(-1px);
        }

        /* Chip de estado inline (junto al proveedor) */
        .po-chip-inline {
          margin-left: .25rem;
          padding: .15rem .5rem;
          line-height: 1;
          font-size: .8rem;
          box-shadow: 0 2px 6px rgba(0,0,0,.06);
          font-weight: 600;
        }
      `}</style>

      <div className="page-header-bar flex align-items-center justify-content-between">
        <div>
          <h2 className="title m-0">Órdenes de Compra</h2>
          <p className="subtitle m-0">Crear, listar y enviar a aprobación</p>
        </div>
        <div className="flex gap-2">
          {/* Botón Atrás: navega al Menú Principal */}
          <Button
            icon="pi pi-home"
            severity="danger"
            rounded
            raised
            size="small"
            aria-label="Atrás"
            onClick={() => navigate("/menu-principal")}
            tooltip="Regresar al menú principal"
          />
          <Button
            icon="pi pi-plus"
            label="Nueva OC"
            onClick={() => setActive(1)}
            size="small"
            rounded
            raised
          />
        </div>
      </div>

      <TabView 
        className="pill-tabs" 
        activeIndex={active} 
        onTabChange={(e) => setActive(e.index)}
      >
        <TabPanel 
          header={
            <span style={{ display: "flex", alignItems: "center", fontSize: "1.1rem" }}>
              <i className="pi pi-list" style={{ fontSize: "1.5rem", marginRight: "8px", color: "#004DA7" }}></i>
              Listado
            </span>
          }
        >
          <ListadoTab />
        </TabPanel>

        <TabPanel 
          header={
            <span style={{ display: "flex", alignItems: "center", fontSize: "1.1rem" }}>
              <i className="pi pi-file" style={{ fontSize: "1.5rem", marginRight: "8px", color: "#5DAA42" }}></i>
              Crear OC
            </span>
          }
        >
          <CrearOCTab />
        </TabPanel>
      </TabView>
    </div>
  );
}
