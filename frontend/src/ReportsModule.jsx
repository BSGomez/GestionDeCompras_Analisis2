// src/ReportsModule.jsx
import React, { useMemo, useRef, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";

/* ===================== Catálogo de reportes (20) ===================== */
const reportsCatalog = [
  { id: "oc-por-estado", title: "Listado de Órdenes de Compra por Estado", desc: "Filtros por fecha, proveedor, categoría, proyecto. KPIs: % abiertas, lead time." },
  { id: "historico-solc", title: "Histórico de Solicitudes de Compra", desc: "Tiempos por etapa, aprobadores, rechazo vs aprobación." },
  { id: "comparativo-cot", title: "Comparativo de Cotizaciones", desc: "Matriz por ítem y proveedor, ahorro estimado/logrado." },
  { id: "consumo-cc", title: "Consumo por Centro de Costo", desc: "Montos por período, variación vs presupuesto." },
  { id: "gasto-proveedor", title: "Gasto por Proveedor", desc: "Top proveedores, concentración de gasto, tendencias mensuales." },
  { id: "cumplimiento-entregas", title: "Cumplimiento de Entregas (OTIF)", desc: "Retrasos promedio y proveedores con incumplimientos." },
  { id: "analisis-precios", title: "Análisis de Precios por Ítem", desc: "Evolución del precio promedio, variabilidad, proveedor más competitivo." },
  { id: "presupuesto-vs-ejecutado", title: "Presupuesto vs Ejecutado (Compras)", desc: "Compromiso, devengado y saldo por proyecto/centro." },
  { id: "recepciones-pendientes", title: "Recepciones Parciales/Pendientes", desc: "OC con saldo por recibir, días de atraso." },
  { id: "conciliacion-3wm", title: "Conciliación 3-Way Match", desc: "Diferencias (precio/cantidad), estado de resolución." },
  { id: "anticipos-saldos", title: "Anticipos y Saldos Pendientes", desc: "Anticipos por proveedor/OC, aplicación y saldo." },
  { id: "impuestos-retenciones", title: "Impuestos y Retenciones", desc: "Reporte fiscal por período (IVA acreditable, ISR retenido)." },
  { id: "items-rotacion", title: "Ítems de Rotación/Consumo", desc: "Top N por cantidad y valor, clasificación ABC." },
  { id: "oc-enmiendas", title: "Órdenes Modificadas / Enmiendas", desc: "Qué cambió, quién aprobó, impacto en costo y plazos." },
  { id: "kpi-proceso", title: "Indicadores de Proceso (SLA)", desc: "SC→aprobación, OC→entrega, entrega→factura." },
  { id: "proveedores-homologados", title: "Proveedores Homologados y Vencimientos", desc: "Documentos por vencer, estado de cumplimiento." },
  { id: "devoluciones-nc", title: "Devoluciones y No Conformidades", desc: "Motivos, proveedor, ítem, impacto económico." },
  { id: "aging-cxp", title: "Aging de Cuentas por Pagar (OC–Factura)", desc: "0–30, 31–60, 61–90, +90 días." },
  { id: "oc-moneda", title: "Órdenes por Moneda y Tipo de Cambio", desc: "Exposición por divisa, diferencia cambiaria." },
  { id: "tablero-ejecutivo", title: "Tablero Ejecutivo de Compras", desc: "KPIs: gasto total, ahorro, cumplimiento, top riesgos." },
];

/* ===================== Meta + datos dummy para la vista "Ver" ===================== */
const reportMeta = {
  "oc-por-estado": {
    columns: [
      { field: "oc", header: "OC" },
      { field: "proveedor", header: "Proveedor" },
      { field: "estado", header: "Estado" },
      { field: "fecha", header: "Fecha" },
      { field: "total", header: "Total" },
    ],
    rows: [
      { oc: 7001, proveedor: "TecnoGT", estado: "En revisión", fecha: "2025-08-20", total: "Q 12,500" },
      { oc: 7002, proveedor: "RedesPlus", estado: "Aprobada",   fecha: "2025-08-18", total: "Q 4,800"  },
    ],
  },
  "historico-solc": {
    columns: [
      { field: "solicitud", header: "Solicitud" },
      { field: "nombre", header: "Nombre" },
      { field: "etapa", header: "Etapa" },
      { field: "aprobador", header: "Aprobador" },
      { field: "decision", header: "Decisión" },
      { field: "fecha", header: "Fecha" },
    ],
    rows: [
      { solicitud: 5000, nombre: "Compra laptops Q4", etapa: "Aprobación", aprobador: "nivel 2", decision: "Aprobado", fecha: "2025-08-21" },
      { solicitud: 5001, nombre: "Mobiliario recepción", etapa: "Revisión", aprobador: "nivel 1", decision: "Rechazado", fecha: "2025-08-19" },
    ],
  },
  "comparativo-cot": {
    columns: [
      { field: "item", header: "Ítem" },
      { field: "proveedor", header: "Proveedor" },
      { field: "precio", header: "Precio" },
      { field: "ahorro", header: "Ahorro Est." },
    ],
    rows: [
      { item: "Laptop 14\"", proveedor: "TecnoGT", precio: "US$ 500", ahorro: "US$ 50" },
      { item: "Laptop 14\"", proveedor: "RedesPlus", precio: "US$ 520", ahorro: "US$ 30" },
    ],
  },
  "consumo-cc": {
    columns: [
      { field: "centro", header: "Centro Costo" },
      { field: "periodo", header: "Período" },
      { field: "monto", header: "Monto" },
      { field: "variacion", header: "Var. Presupuesto" },
    ],
    rows: [
      { centro: "CC-100 Compras", periodo: "2025-08", monto: "Q 45,000", variacion: "+8%" },
      { centro: "CC-200 Operaciones", periodo: "2025-08", monto: "Q 30,000", variacion: "-3%" },
    ],
  },
  "gasto-proveedor": {
    columns: [
      { field: "proveedor", header: "Proveedor" },
      { field: "total", header: "Total" },
      { field: "participacion", header: "Participación" },
      { field: "tendencia", header: "Tendencia" },
    ],
    rows: [
      { proveedor: "TecnoGT", total: "Q 150,000", participacion: "35%", tendencia: "↗︎" },
      { proveedor: "RedesPlus", total: "Q 120,000", participacion: "28%", tendencia: "→"  },
    ],
  },
  "cumplimiento-entregas": {
    columns: [
      { field: "proveedor", header: "Proveedor" },
      { field: "otif", header: "OTIF" },
      { field: "retraso", header: "Retraso Prom." },
      { field: "incumplimientos", header: "Incumplimientos" },
    ],
    rows: [
      { proveedor: "TecnoGT", otif: "93%", retraso: "1.2 días", incumplimientos: 2 },
      { proveedor: "RedesPlus", otif: "84%", retraso: "3.5 días", incumplimientos: 5 },
    ],
  },
  "analisis-precios": {
    columns: [
      { field: "item", header: "Ítem" },
      { field: "precioProm", header: "Precio Prom." },
      { field: "variabilidad", header: "Variabilidad" },
      { field: "mejorProveedor", header: "Proveedor más competitivo" },
    ],
    rows: [
      { item: "Dock USB-C", precioProm: "US$ 195", variabilidad: "6%", mejorProveedor: "TecnoGT" },
    ],
  },
  "presupuesto-vs-ejecutado": {
    columns: [
      { field: "proyecto", header: "Proyecto" },
      { field: "compromiso", header: "Compromiso" },
      { field: "devengado", header: "Devengado" },
      { field: "saldo", header: "Saldo" },
    ],
    rows: [
      { proyecto: "Infra TI 2025", compromiso: "Q 250,000", devengado: "Q 180,000", saldo: "Q 70,000" },
    ],
  },
  "recepciones-pendientes": {
    columns: [
      { field: "oc", header: "OC" },
      { field: "proveedor", header: "Proveedor" },
      { field: "saldoRecibir", header: "Saldo por Recibir" },
      { field: "diasAtraso", header: "Días Atraso" },
    ],
    rows: [
      { oc: 7003, proveedor: "TecnoGT", saldoRecibir: "Q 2,000", diasAtraso: 5 },
    ],
  },
  "conciliacion-3wm": {
    columns: [
      { field: "oc", header: "OC" },
      { field: "factura", header: "Factura" },
      { field: "diferencia", header: "Diferencia (Q)" },
      { field: "estado", header: "Estado" },
    ],
    rows: [
      { oc: 7002, factura: "F-9981", diferencia: 125.5, estado: "En análisis" },
    ],
  },
  "anticipos-saldos": {
    columns: [
      { field: "proveedor", header: "Proveedor" },
      { field: "oc", header: "OC" },
      { field: "anticipo", header: "Anticipo" },
      { field: "saldo", header: "Saldo" },
    ],
    rows: [
      { proveedor: "RedesPlus", oc: 7005, anticipo: "Q 5,000", saldo: "Q 12,500" },
    ],
  },
  "impuestos-retenciones": {
    columns: [
      { field: "periodo", header: "Período" },
      { field: "iva", header: "IVA Acreditable" },
      { field: "isr", header: "ISR Retenido" },
    ],
    rows: [
      { periodo: "2025-07", iva: "Q 12,300", isr: "Q 4,900" },
    ],
  },
  "items-rotacion": {
    columns: [
      { field: "item", header: "Ítem" },
      { field: "cantidad", header: "Cantidad" },
      { field: "valor", header: "Valor" },
      { field: "clasificacion", header: "ABC" },
    ],
    rows: [
      { item: "Mouse óptico", cantidad: 300, valor: "Q 9,000", clasificacion: "A" },
    ],
  },
  "oc-enmiendas": {
    columns: [
      { field: "oc", header: "OC" },
      { field: "campo", header: "Campo" },
      { field: "antes", header: "Antes" },
      { field: "despues", header: "Después" },
      { field: "aprobador", header: "Aprobó" },
    ],
    rows: [
      { oc: 7001, campo: "Precio", antes: "Q 500", despues: "Q 480", aprobador: "nivel 2" },
    ],
  },
  "kpi-proceso": {
    columns: [
      { field: "indicador", header: "Indicador" },
      { field: "valor", header: "Valor" },
    ],
    rows: [
      { indicador: "SC → Aprobación (mediana)", valor: "14 h" },
      { indicador: "OC → Entrega (promedio)", valor: "3.2 días" },
    ],
  },
  "proveedores-homologados": {
    columns: [
      { field: "proveedor", header: "Proveedor" },
      { field: "estado", header: "Estado" },
      { field: "docPorVencer", header: "Docs por vencer" },
      { field: "dias", header: "Días" },
    ],
    rows: [
      { proveedor: "TecnoGT", estado: "Homologado", docPorVencer: "Constancia RTU", dias: 12 },
    ],
  },
  "devoluciones-nc": {
    columns: [
      { field: "proveedor", header: "Proveedor" },
      { field: "item", header: "Ítem" },
      { field: "motivo", header: "Motivo" },
      { field: "monto", header: "Monto" },
    ],
    rows: [
      { proveedor: "TecnoGT", item: "Teclado", motivo: "No conforme", monto: "Q 700" },
    ],
  },
  "aging-cxp": {
    columns: [
      { field: "proveedor", header: "Proveedor" },
      { field: "r0_30", header: "0–30" },
      { field: "r31_60", header: "31–60" },
      { field: "r61_90", header: "61–90" },
      { field: "r90", header: "+90" },
    ],
    rows: [
      { proveedor: "RedesPlus", r0_30: "Q 12,000", r31_60: "Q 8,500", r61_90: "Q 2,100", r90: "Q 900" },
    ],
  },
  "oc-moneda": {
    columns: [
      { field: "moneda", header: "Moneda" },
      { field: "ordenes", header: "# Órdenes" },
      { field: "exposicion", header: "Exposición" },
      { field: "difCambio", header: "Dif. cambiaria" },
    ],
    rows: [
      { moneda: "USD", ordenes: 18, exposicion: "US$ 120,000", difCambio: "US$ -1,250" },
    ],
  },
  "tablero-ejecutivo": {
    columns: [
      { field: "kpi", header: "KPI" },
      { field: "valor", header: "Valor" },
    ],
    rows: [
      { kpi: "Gasto Total", valor: "Q 2,500,000" },
      { kpi: "Órdenes Aprobadas", valor: "87%" },
      { kpi: "Ahorro Logrado", valor: "Q 150,000" },
    ],
  },
};

/* ===================== Componente ===================== */
export default function ReportsModule() {
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [activeReport, setActiveReport] = useState(null);
  const toast = useRef(null);

  const filteredReports = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return reportsCatalog;
    return reportsCatalog.filter(
      (r) =>
        r.title.toLowerCase().includes(t) ||
        r.desc.toLowerCase().includes(t) ||
        r.id.toLowerCase().includes(t)
    );
  }, [search]);

  const openReport = (r) => {
    setActiveReport(r);
    setVisible(true);
  };

  const handleGeneratePdf = (r) => {
    // Conecta aquí tu endpoint de generación de PDF para el reporte r.id
    // eslint-disable-next-line no-console
    console.log("Generar PDF:", r.id);
    toast.current?.show({
      severity: "info",
      summary: "Generación de PDF",
      detail: `Se está generando el PDF de: ${r.title}`,
       
      life: 2500,
    });
  };

  const ReportCard = ({ r }) => (
    <Card className="p-3 h-full">
      <div className="flex flex-column gap-2">
        <div className="font-medium text-lg">{r.title}</div>
        <div className="text-600">{r.desc}</div>
        <div className="flex gap-2 mt-2">
          <Button
            icon="pi pi-eye"
            label="Ver"
            outlined
            onClick={() => openReport(r)}
          />
          <Button
            icon="pi pi-file-pdf"
            label="Generar PDF"
            onClick={() => handleGeneratePdf(r)}
          />
        </div>
      </div>
    </Card>
  );

  const ReportPreview = ({ r }) => {
    const meta = reportMeta[r.id] || {
      columns: [
        { field: "campo", header: "CAMPO" },
        { field: "valor", header: "VALOR" },
      ],
      rows: [
        { campo: "Ejemplo", valor: "—" },
      ],
    };

    return (
      <div>
        <h3 className="mb-2">{r.title}</h3>
        <p className="text-600 mb-3">{r.desc}</p>
        <Divider />
        <DataTable
          value={meta.rows}
          paginator
          rows={10}
          stripedRows
          showGridlines
          size="small"
          emptyMessage="Sin datos de ejemplo."
        >
          {meta.columns.map((c) => (
            <Column key={c.field} field={c.field} header={c.header} />
          ))}
        </DataTable>
      </div>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="page-header">
        <div>
          <h2 className="title">Reportería</h2>
          <p className="subtitle">Vista previa en grid y exportación a PDF</p>
        </div>
      </div>

      <div className="flex gap-3 mb-3">
        <span className="p-input-icon-left flex-1">
          <i className="pi pi-search" />
          <InputText
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="  Buscar reporte…"
            className="w-full"
          />
        </span>
      </div>

      <div className="grid">
        {filteredReports.map((r) => (
          <div key={r.id} className="col-12 md:col-6 lg:col-4">
            <ReportCard r={r} />
          </div>
        ))}
      </div>

      <Dialog
        header={activeReport ? activeReport.title : "Reporte"}
        visible={visible}
        style={{ width: "80vw", maxWidth: "1200px" }}
        onHide={() => setVisible(false)}
        maximizable
      >
        {activeReport && <ReportPreview r={activeReport} />}
      </Dialog>
    </div>
  );
}
