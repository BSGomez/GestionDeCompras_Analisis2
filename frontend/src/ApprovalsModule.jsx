import React, { useMemo, useState } from "react";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";

/* ===================== CONFIG / MOCKS (reemplaza por tu API) ===================== */

// Usuario logueado (vendrá del token/session en backend)
const currentUser = {
  USR_Usuario: 2000,
  alias: "luis.p",
  nivelAprobador: 2,
  puedeAprobar: { solicitud: true, oc: true },
};

// Reglas simples por monto → niveles requeridos
const rules = [
  { max: 1000, niveles: 1 },
  { max: 5000, niveles: 2 },
  { max: Infinity, niveles: 3 },
];

// Catálogos mínimos
const proveedores = [
  { PRV_Proveedor: 1000, PRV_Nombre: "TecnoGT", direccion: "Zona 4, Ciudad de Guatemala", nit: "456789-1" },
  { PRV_Proveedor: 1001, PRV_Nombre: "RedesPlus", direccion: "Zona 10, Guatemala", nit: "5343421-9" },
];
const monedas = [
  { MON_Moneda: 1, MON_Nombre: "Quetzal", codigo: "GTQ", simbolo: "Q" },
  { MON_Moneda: 2, MON_Nombre: "Dólar", codigo: "USD", simbolo: "$" },
];
const formasPago = [
  { FPG_Forma_Pago: 1, FPG_Nombre: "BANTRAB Monetaria 123-001" },
  { FPG_Forma_Pago: 2, FPG_Nombre: "BANRURAL Monetaria 456-002" },
  { FPG_Forma_Pago: 3, FPG_Nombre: "Tarjeta de crédito" },
];
const condiciones = [
  { CPR_Condicion_Proveedor: 1, nombre: "30 días crédito" },
  { CPR_Condicion_Proveedor: 2, nombre: "Efectivo" },
  { CPR_Condicion_Proveedor: 3, nombre: "15 días crédito" },
];

const propositos = [
  { PRP_Proposito: 1, PRP_Nombre: "Reposición stock" },
  { PRP_Proposito: 2, PRP_Nombre: "Proyecto Infra TI" },
];

const EST_SOL = { BORRADOR: 1, EN_REVISION: 2, APROBADA: 3, RECHAZADA: 4 };
const EST_OC  = { BORRADOR: 1, EN_REVISION: 2, APROBADA: 3, RECHAZADA: 4, CERRADA: 5 };

// DOCS de ejemplo (pendientes e historial)
const seedSolicitudes = [
  {
    tipo: "solicitud",
    SOL_Solicitud: 5000,
    SOL_Nombre: "Compra laptops Q4",
    PRP_Proposito: 1,
    total: 2900,
    EST_Estado_Solicitud: EST_SOL.EN_REVISION,
    fecha: "2025-08-20",
    // Para detalle:
    detalles: [
      { id: 1, descripcion: 'Laptop 14"', cantidad: 5, unidad: "UNIDAD", precio: 500, moneda: 2 },
      { id: 2, descripcion: "Dock USB-C", cantidad: 2, unidad: "UNIDAD", precio: 200, moneda: 2 },
    ],
    seguimiento: [
      // llenará backend; ejemplo:
      // { user: "ana.l", rol: "Gerente en función", fecha: "2025-08-21 16:40", accion: "Aprobación" }
    ],
    pdfUrl: null, // URL del PDF generado por backend (cuando exista)
  },
  {
    tipo: "solicitud",
    SOL_Solicitud: 5001,
    SOL_Nombre: "Mobiliario recepción",
    PRP_Proposito: 2,
    total: 850,
    EST_Estado_Solicitud: EST_SOL.EN_REVISION,
    fecha: "2025-08-23",
    detalles: [
      { id: 1, descripcion: "Silla ergonómica", cantidad: 5, unidad: "UNIDAD", precio: 170, moneda: 1 },
    ],
    seguimiento: [],
    pdfUrl: null,
  },
];

const seedOcs = [
  {
    tipo: "oc",
    OC_Orden: 7000,
    PRV_Proveedor: 1000,
    MON_Moneda: 2,
    FPG_Forma_Pago: 1,
    CPR_Condicion_Proveedor: 1,
    total: 2900,
    OC_Estado: EST_OC.EN_REVISION,
    fecha: "2025-08-22",
    observaciones: "Entrega en 5 días",
    detalles: [
      { id: 1, descripcion: 'Laptop 14"', cantidad: 5, unidad: "UNIDAD", precio: 500, moneda: 2 },
      { id: 2, descripcion: "Dock USB-C", cantidad: 2, unidad: "UNIDAD", precio: 200, moneda: 2 },
    ],
    seguimiento: [
      // { user: "jorge.l", rol: "Gerente en función", fecha: "2025-08-25 16:40", accion: "Aprobación" },
      // { user: "otto.b", rol: "Gerente superior", fecha: "2025-08-28 18:28", accion: "Aprobación" },
    ],
    // Demo: si ya tienes un PDF estático desde backend, pon aquí la URL.
    // Para demo local, puedes usar un enlace público o servirlo desde tu API.
    pdfUrl: null,
  },
];

// Auditoría (acciones realizadas)
const seedAudit = [
  // { id: 1, tipo: "oc", docId: 6999, accion: "APROBADO", nivel: 2, usuario: "luis.p", fecha: "2025-08-18", comentario: "Ok" }
];

/* ===================== HELPERS ===================== */

const mapArrToMap = (arr, keyFn) => new Map(arr.map(o => [keyFn(o), o]));

const proveedoresById = mapArrToMap(proveedores, (p) => p.PRV_Proveedor);
const monedasById = mapArrToMap(monedas, (m) => m.MON_Moneda);
const formasById = mapArrToMap(formasPago, (f) => f.FPG_Forma_Pago);
const condsById = mapArrToMap(condiciones, (c) => c.CPR_Condicion_Proveedor);
const propositosById = mapArrToMap(propositos, (p) => p.PRP_Proposito);

const estadoText = (doc) => {
  if (doc.tipo === "solicitud") {
    const map = {
      [EST_SOL.BORRADOR]: "Borrador",
      [EST_SOL.EN_REVISION]: "En revisión",
      [EST_SOL.APROBADA]: "Aprobada",
      [EST_SOL.RECHAZADA]: "Rechazada",
    };
    return map[doc.EST_Estado_Solicitud] || "—";
  } else {
    const map = {
      [EST_OC.BORRADOR]: "Borrador",
      [EST_OC.EN_REVISION]: "En revisión",
      [EST_OC.APROBADA]: "Aprobada",
      [EST_OC.RECHAZADA]: "Rechazada",
      [EST_OC.CERRADA]: "Cerrada",
    };
    return map[doc.OC_Estado] || "—";
  }
};

const estadoSeverity = (txt) =>
  txt === "Aprobada" ? "success" :
  txt === "Rechazada" ? "danger" :
  txt === "En revisión" ? "warning" : "info";

const nivelesRequeridos = (total) => {
  for (const r of rules) if (total <= r.max) return r.niveles;
  return 1;
};

/* ===================== COMPONENTE PRINCIPAL ===================== */

export default function ApprovalsModulePro() {
  const [active, setActive] = useState(0);
  const [docsSol, setDocsSol] = useState(seedSolicitudes);
  const [docsOC, setDocsOC] = useState(seedOcs);
  const [audit, setAudit] = useState(seedAudit);

  // simulación de progreso por doc (nivel actual alcanzado)
  const [nivelesActuales, setNivelesActuales] = useState(() => {
    const init = {};
    for (const s of seedSolicitudes) init[`solicitud:${s.SOL_Solicitud}`] = 1;
    for (const o of seedOcs) init[`oc:${o.OC_Orden}`] = 1;
    return init;
  });

  // Búsquedas
  const [qPend, setQPend] = useState("");
  const [qHist, setQHist] = useState("");

  // Modal Detalle
  const [visible, setVisible] = useState(false);
  const [docSel, setDocSel] = useState(null); // {tipo, ...}
  const [comment, setComment] = useState("");

  // Unificar pendientes (en revisión) y filtrar por nivel del usuario
  const pendientes = useMemo(() => {
    const list = [];
    for (const s of docsSol) {
      if (s.EST_Estado_Solicitud === EST_SOL.EN_REVISION) {
        list.push({
          tipo: "solicitud",
          id: s.SOL_Solicitud,
          nombre: s.SOL_Nombre,
          proposito: propositosById.get(s.PRP_Proposito)?.PRP_Nombre || "—",
          total: s.total,
          fecha: s.fecha,
          estado: estadoText(s),
          _raw: s,
        });
      }
    }
    for (const o of docsOC) {
      if (o.OC_Estado === EST_OC.EN_REVISION) {
        list.push({
          tipo: "oc",
          id: o.OC_Orden,
          nombre: proveedoresById.get(o.PRV_Proveedor)?.PRV_Nombre || "—",
          total: o.total,
          fecha: o.fecha,
          estado: estadoText(o),
          moneda: monedasById.get(o.MON_Moneda)?.codigo || "—",
          _raw: o,
        });
      }
    }
    const t = qPend.trim().toLowerCase();
    const filt = list.filter(d => {
      const req = nivelesRequeridos(d.total);
      const k = `${d.tipo}:${d.id}`;
      const actual = nivelesActuales[k] || 1;
      const siguiente = actual + 1;
      const permitido = d.tipo === "solicitud" ? currentUser.puedeAprobar.solicitud : currentUser.puedeAprobar.oc;
      const meToca = permitido && currentUser.nivelAprobador === siguiente && actual < req;

      const match = !t || String(d.id).includes(t) || (d.nombre || "").toLowerCase().includes(t) || (d.estado || "").toLowerCase().includes(t) || (d.proposito || "").toLowerCase().includes(t) || (d.moneda || "").toLowerCase().includes(t);
      return meToca && match;
    });
    return filt.sort((a,b) => (a.fecha < b.fecha ? 1 : -1));
  }, [docsSol, docsOC, qPend, nivelesActuales]);

  // Historial propio (acciones del usuario)
  const myAudit = useMemo(() => {
    const t = qHist.trim().toLowerCase();
    const mine = audit.filter(a => a.usuario === currentUser.alias);
    if (!t) return mine;
    return mine.filter(a =>
      String(a.docId).includes(t) ||
      (a.tipo || "").toLowerCase().includes(t) ||
      (a.accion || "").toLowerCase().includes(t) ||
      (a.comentario || "").toLowerCase().includes(t)
    );
  }, [audit, qHist]);

  // === Acciones Aprobar/Rechazar (mock; reemplaza por llamadas a API) ===
  const registrarAudit = (tipo, docId, accion, nivel, comentario, pdfUrl) => {
    setAudit(prev => [
      {
        id: Date.now(),
        tipo,
        docId,
        accion,
        nivel,
        usuario: currentUser.alias,
        fecha: new Date().toISOString().slice(0, 10),
        comentario: comentario || "",
        pdfUrl: pdfUrl || null, // guarda URL para descarga en historial
      },
      ...prev,
    ]);
  };

  const aprobarDoc = (doc) => {
    const k = `${doc.tipo}:${doc.id}`;
    const actual = nivelesActuales[k] || 1;
    const siguiente = actual + 1;
    const requerido = nivelesRequeridos(doc.total);

    registrarAudit(doc.tipo, doc.id, "APROBADO", siguiente, comment, doc._raw?.pdfUrl || null);
    setComment("");

    if (siguiente >= requerido) {
      // marca aprobado
      if (doc.tipo === "solicitud") {
        setDocsSol(prev => prev.map(s => s.SOL_Solicitud === doc.id ? { ...s, EST_Estado_Solicitud: EST_SOL.APROBADA } : s));
      } else {
        setDocsOC(prev => prev.map(o => o.OC_Orden === doc.id ? { ...o, OC_Estado: EST_OC.APROBADA } : o));
      }
      setNivelesActuales(prev => ({ ...prev, [k]: requerido }));
    } else {
      setNivelesActuales(prev => ({ ...prev, [k]: siguiente }));
    }
  };

  const rechazarDoc = (doc) => {
    const k = `${doc.tipo}:${doc.id}`;
    const actual = nivelesActuales[k] || 1;
    const siguiente = actual + 1;
    registrarAudit(doc.tipo, doc.id, "RECHAZADO", siguiente, comment, doc._raw?.pdfUrl || null);
    setComment("");

    if (doc.tipo === "solicitud") {
      setDocsSol(prev => prev.map(s => s.SOL_Solicitud === doc.id ? { ...s, EST_Estado_Solicitud: EST_SOL.RECHAZADA } : s));
    } else {
      setDocsOC(prev => prev.map(o => o.OC_Orden === doc.id ? { ...o, OC_Estado: EST_OC.RECHAZADA } : o));
    }
    setNivelesActuales(prev => ({ ...prev, [k]: siguiente }));
  };

  // === UI Templates ===
  const PendingCard = (d) => {
    const req = nivelesRequeridos(d.total);
    const k = `${d.tipo}:${d.id}`;
    const actual = nivelesActuales[k] || 1;
    const siguiente = actual + 1;

    return (
      <Card className="p-3">
        <div className="flex justify-content-between align-items-start gap-3">
          <div>
            <div className="font-medium text-lg">
              {d.tipo === "solicitud" ? `${d.nombre} (SOLC #${d.id})` : `OC #${d.id} — ${d.nombre}`}
            </div>
            <div className="text-500 text-sm">Fecha: {d.fecha || "—"} · Total: {d.total}{d.moneda ? ` · ${d.moneda}` : ""}</div>
            {d.proposito && <div className="text-600 text-sm mt-1">Propósito: {d.proposito}</div>}
            <div className="text-600 text-sm mt-1">Estado: {d.estado} · Nivel actual: {actual} / Requerido: {req}</div>
            <div className="mt-2">
              <InputTextarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="Comentario (opcional)"
                style={{ width: 420, maxWidth: "100%" }}
              />
            </div>
          </div>
          <div className="flex align-items-center gap-3">
            <Tag value={`Nivel ${siguiente}`} />
            <div className="flex gap-2">
              <Button icon="pi pi-eye" label="Ver detalles" outlined onClick={() => { setDocSel(d._raw); setVisible(true); }} />
              <Button icon="pi pi-check" label="Aprobar" onClick={() => aprobarDoc(d)} />
              <Button icon="pi pi-times" label="Rechazar" severity="danger" outlined onClick={() => rechazarDoc(d)} />
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const HistoryCard = (a) => {
    const title = a.tipo === "solicitud" ? `SOLC #${a.docId}` : `OC #${a.docId}`;
    const canDownload = a.accion === "APROBADO" && a.pdfUrl; // si hay PDF listo en backend

    return (
      <Card className="p-3">
        <div className="flex justify-content-between align-items-start gap-3">
          <div>
            <div className="font-medium text-lg">{title} — {a.accion}</div>
            <div className="text-500 text-sm">Fecha: {a.fecha} · Nivel: {a.nivel}</div>
            <div className="text-600 text-sm mt-1">Comentario: {a.comentario || "—"}</div>
          </div>
          <div className="flex gap-2 align-items-center">
            <Tag value={a.usuario} severity={a.accion === "APROBADO" ? "success" : "danger"} />
            {/* Botón de descarga de PDF (si backend entregó url) */}
            <Button
              icon="pi pi-download"
              label="PDF"
              disabled={!canDownload}
              onClick={() => { if (a.pdfUrl) window.open(a.pdfUrl, "_blank"); }}
            />
          </div>
        </div>
      </Card>
    );
  };

  // Detalle: Header
  const DetalleHeader = ({ doc }) => {
    const tipo = doc.tipo;
    const estado = estadoText(doc);
    const sev = estadoSeverity(estado);

    return (
      <div>
        <div className="flex justify-content-between align-items-center">
          <div className="flex flex-column">
            <div className="text-xl font-semibold">
              {tipo === "oc" ? `Orden de compra #${doc.OC_Orden}` : `Solicitud de compra #${doc.SOL_Solicitud}`}
            </div>
            <div className="text-500">
              Fecha: {doc.fecha || doc.OC_Fecha_Emision || "—"}
            </div>
          </div>
          <Tag value={estado} severity={sev} />
        </div>

        <Divider />

        {tipo === "oc" ? (
          <div className="grid">
            <div className="col-12 md:col-6">
              <div className="font-medium">Proveedor</div>
              <div className="text-600">
                {proveedoresById.get(doc.PRV_Proveedor)?.PRV_Nombre || "—"}
              </div>
              <div className="text-500">
                {proveedoresById.get(doc.PRV_Proveedor)?.direccion || "—"}
              </div>
              <div className="text-500">
                NIT: {proveedoresById.get(doc.PRV_Proveedor)?.nit || "—"}
              </div>
            </div>
            <div className="col-12 md:col-6">
              <div className="font-medium">Condiciones</div>
              <div className="text-600">
                Pago: {formasById.get(doc.FPG_Forma_Pago)?.FPG_Nombre || "—"}
              </div>
              <div className="text-600">
                Crédito: {condsById.get(doc.CPR_Condicion_Proveedor)?.nombre || "—"}
              </div>
              <div className="text-600">
                Moneda: {monedasById.get(doc.MON_Moneda)?.codigo || "—"}
              </div>
              <div className="text-500">Obs: {doc.observaciones || "—"}</div>
            </div>
          </div>
        ) : (
          <div className="grid">
            <div className="col-12 md:col-6">
              <div className="font-medium">Solicitud</div>
              <div className="text-600">{doc.SOL_Nombre}</div>
              <div className="text-600">
                Propósito: {propositosById.get(doc.PRP_Proposito)?.PRP_Nombre || "—"}
              </div>
            </div>
            <div className="col-12 md:col-6">
              <div className="font-medium">Totales</div>
              <div className="text-600">Total estimado: {doc.total}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const DetalleRenglones = ({ doc }) => {
    const rows = doc.detalles || [];
    const total = rows.reduce((acc, r) => acc + (r.cantidad || 0) * (r.precio || 0), 0);
    return (
      <div>
        <div className="font-medium mb-2">Renglones</div>
        <DataTable value={rows} size="small" stripedRows showGridlines className="mb-2">
          <Column field="id" header="#" style={{ width: 80 }} />
          <Column field="descripcion" header="Descripción" />
          <Column field="cantidad" header="Cantidad" style={{ width: 120 }} />
          <Column field="unidad" header="Unidad" style={{ width: 120 }} />
          <Column header="Monto" body={(r) => (r.cantidad || 0) * (r.precio || 0)} style={{ width: 140, textAlign: "right" }} />
        </DataTable>
        <div className="flex justify-content-end">
          <div className="font-medium">Total: {total}</div>
        </div>
      </div>
    );
  };

  const DetalleSeguimiento = ({ doc }) => {
    const seg = doc.seguimiento || [];
    return (
      <div>
        <div className="font-medium mb-2">Seguimiento de Aprobación</div>
        {seg.length === 0 && <div className="text-500">Sin registros.</div>}
        {seg.length > 0 && (
          <DataTable value={seg} size="small" showGridlines>
            <Column field="user" header="Usuario" />
            <Column field="rol" header="Rol" />
            <Column field="accion" header="Acción" />
            <Column field="fecha" header="Fecha" />
          </DataTable>
        )}
      </div>
    );
  };

  const DetallePDF = ({ doc }) => {
    // Si tu backend ya genera el PDF, pon la URL en doc.pdfUrl
    // Como demo, si NO hay url, mostramos un placeholder de instrucción.
    return doc.pdfUrl ? (
      <div className="surface-0" style={{ height: "70vh" }}>
        <iframe
          src={doc.pdfUrl}
          title="Documento PDF"
          style={{ width: "100%", height: "100%", border: 0 }}
        />
      </div>
    ) : (
      <div className="text-500 p-3">
        No hay PDF disponible aún. Una vez aprobado o generado, aparecerá el
        visor aquí. (Conecta <code>doc.pdfUrl</code> a tu endpoint.)
      </div>
    );
  };

  // === Tabs internos del Detalle ===
  const DetalleDoc = ({ doc }) => (
    <TabView>
      <TabPanel header="Resumen">
        <DetalleHeader doc={doc} />
        <Divider />
        <DetalleRenglones doc={doc} />
        <Divider />
        <DetalleSeguimiento doc={doc} />
      </TabPanel>
      <TabPanel header="PDF">
        <DetallePDF doc={doc} />
      </TabPanel>
    </TabView>
  );

  // === Tabs principales ===
  const PendientesTab = () => (
    <div className="flex flex-column gap-3">
      <div className="flex gap-2 align-items-center">
        <span className="p-input-icon-left flex-1">
          <i className="pi pi-search" />
          <InputText
            value={qPend}
            onChange={(e) => setQPend(e.target.value)}
            placeholder="  Buscar por ID, proveedor/solicitud, estado…"
            className="w-full"
          />
        </span>
        <Tag value={`Nivel: ${currentUser.nivelAprobador}`} />
      </div>

      {pendientes.length === 0 && (
        <Card className="p-3">
          <div className="text-600">No tienes aprobaciones pendientes por tu nivel.</div>
        </Card>
      )}

      <DataView
        value={pendientes}
        layout="grid"
        paginator
        rows={6}
        itemTemplate={(item) => (
          <div className="col-12">{PendingCard(item)}</div>
        )}
      />

      {/* Modal Detalle */}
      <Dialog
        header="Detalle del documento"
        visible={visible}
        style={{ width: "85vw", maxWidth: 1200 }}
        onHide={() => setVisible(false)}
        maximizable
      >
        {docSel && <DetalleDoc doc={docSel} />}
      </Dialog>
    </div>
  );

  const HistorialTab = () => (
    <div className="flex flex-column gap-3">
      <div className="flex gap-2">
        <span className="p-input-icon-left flex-1">
          <i className="pi pi-search" />
          <InputText
            value={qHist}
            onChange={(e) => setQHist(e.target.value)}
            placeholder="  Buscar en mi historial"
            className="w-full"
          />
        </span>
      </div>

      <DataView
        value={myAudit}
        layout="grid"
        paginator
        rows={10}
        itemTemplate={(item) => <div className="col-12">{HistoryCard(item)}</div>}
      />
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="title">Aprobaciones</h2>
          <p className="subtitle">Bandeja por nivel con detalle y PDF</p>
        </div>
        <div className="flex align-items-center gap-3">
          <Tag value={`Usuario: ${currentUser.alias}`} />
          <Tag value={`Nivel: ${currentUser.nivelAprobador}`} />
        </div>
      </div>

      <TabView className="pill-tabs" activeIndex={active} onTabChange={(e) => setActive(e.index)}>
        <TabPanel header="Pendientes">
          <PendientesTab />
        </TabPanel>
        <TabPanel header="Mi historial">
          <HistorialTab />
        </TabPanel>
      </TabView>
    </div>
  );
}
