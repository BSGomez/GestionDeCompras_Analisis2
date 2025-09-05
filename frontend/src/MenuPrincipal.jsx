// src/MenuPrincipal.jsx
import React, { useRef, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { Link } from "react-router-dom";

// Importa las imágenes desde src/assets
import dashboardImg from "./assets/dashboard.png";
import solicitudesImg from "./assets/solicitudes.png";
import ordenesImg from "./assets/ordenes.png";
import bodegaImg from "./assets/bodega.png";
import aprobacionesImg from "./assets/aprobaciones.png";
import proveedoresImg from "./assets/proveedores.png";
import reportesImg from "./assets/reportes.png";
import configuracionImg from "./assets/configuracion.png";

// Tamaños base (puedes ajustarlos)
const TILE_HEIGHT = 240;   // alto total de cada tile
const IMGBOX_HEIGHT = 150; // alto de la caja de imagen para layout vertical

/* ================== CONFIG DE TILES (EJEMPLOS) ================== */
const tiles = [
  {
    label: "DASHBOARD",
    color: "#667462ff",
    img: dashboardImg,
    path: "#",
    hint: "Acceso estático a Dashboard",
    // Imagen arriba, conteniendo sin recortar
    imgPos: "top",
    fillMode: "contain",
  },
  {
    label: "SOLICITUDES",
    color: "#627462ff",
    img: solicitudesImg,
    path: "/purchase-requests",
    hint: "Click para crear o revisar solicitudes",
    // Imagen a la izquierda y texto a la derecha
    imgPos: "top",
    fillMode: "cover",
  },
  {
    label: "ORDENES",
    color: "#627462ff",
    img: ordenesImg,
    path: "/purchase-orders",
    hint: "Click para gestionar órdenes de compra",
    // Imagen a la derecha y texto a la izquierda
    imgPos: "top",
    fillMode: "cover",
  },
  {
    label: "BODEGA",
    color: "#627462ff",
    img: bodegaImg,
    path: "/bodega",
    hint: "Acceso al módulo de Bodega",
    // Imagen ocupa TODO el tile (full), texto centrado encima
    imgPos: "top",
    fillMode: "cover",
    overlayAlign: "center",
  },
  {
    label: "APROBACIONES",
    color: "#627462ff",
    img: aprobacionesImg,
    path: "#",
    hint: "Acceso estático a Aprobaciones",
    // Imagen abajo, texto arriba
   imgPos: "top",
    fillMode: "cover",
  },
  {
    label: "PROVEEDORES",
    color: "#627462ff",
    img: proveedoresImg,
    path: "/suppliers",
    hint: "Click para administrar proveedores",
    // Imagen centrada, texto debajo
    imgPos: "top",
    fillMode: "cover",
    imgScale: 1.5,
    imgMaxWidth: "90%",
    imgMaxHeight: "100%",
  },
  {
    label: "REPORTES",
    color: "#627462ff",
    img: reportesImg,
    path: "#",
    hint: "Acceso estático a Reportes",
    // Imagen a la izquierda, texto a la derecha, estira (fill)
    imgPos: "top",
    fillMode: "cover",
  },
  {
    label: "CONFIGURACION",
    color: "#627462ff",
    img: configuracionImg,
    path: "/users",
    hint: "Click para configurar la aplicación",
    // Full con texto pegado abajo
    imgPos: "top",
    fillMode: "cover",
    overlayAlign: "bottom",
  },
];

/* ================== LOGO ================== */
function Logo() {
  return (
    <div className="flex align-items-center gap-2">
      <svg width="42" height="30" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 40V20l24-12 24 12v20H8Z" fill="#3b82f6" opacity="0.95"/>
        <path d="M16 40V24h8v16h-8Zm12 0V22h8v18h-8Zm12 0V28h8v12h-8Z" fill="#fff"/>
      </svg>
      <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 0.3 }}>Multi Servicios S.A.</span>
    </div>
  );
}

/* ================== TILE FLEXIBLE ================== */
function Tile({
  label,
  color,
  img,
  onInfo,
  path,
  imgStyle,
  imgPos = "top",        // 'top' | 'bottom' | 'left' | 'right' | 'center'
  fillMode = "contain",  // 'contain' | 'cover' | 'stretch' | 'full'
  overlayAlign = "center"// 'center' | 'bottom' | 'top' (solo para fillMode='full')
}) {
  const [hovered, setHovered] = useState(false);
  const isStatic = path === "#";
  const isHorizontal = imgPos === "left" || imgPos === "right";
  const isFull = fillMode === "full";

  // Contenedor base
  const tileBaseStyle = {
    height: TILE_HEIGHT,
    padding: 12,
    display: "flex",
    flexDirection: isHorizontal ? "row" : "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    gap: 12,
  };

  // Card (fondo + hover)
  const cardStyle = {
    backgroundColor: color,
    backgroundImage: "linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,0) 42%)",
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.25)",
    transition: "transform .18s ease, box-shadow .18s ease",
    transform: hovered ? "translateY(-6px) scale(1.02)" : "none",
    boxShadow: hovered ? "0 18px 30px rgba(0,0,0,0.25)" : "0 6px 16px rgba(0,0,0,0.18)",
  };

  // Caja de imagen
  const imgBoxStyle = isHorizontal
    ? {
        height: "100%",
        width: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }
    : {
        height: IMGBOX_HEIGHT,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      };

  // Cómo se dibuja la <img>
  const objectFit =
    fillMode === "cover" ? "cover" :
    fillMode === "stretch" ? "fill" : "contain";

  // Contenido “normal” (no full)
  const imageNode = (
    <div style={imgBoxStyle}>
      <img
        src={img}
        alt={label}
        style={{
          maxHeight: isHorizontal ? "100%" : "100%",
          maxWidth: isHorizontal ? "100%" : "85%",
          width: isHorizontal && fillMode !== "contain" ? "100%" : "auto",
          height: !isHorizontal && fillMode !== "contain" ? "100%" : "auto",
          objectFit,
          display: "block",
          ...(imgStyle || {}),
        }}
      />
    </div>
  );

  const textNode = (
    <div
      style={{
        color: "#fff",
        fontWeight: 800,
        letterSpacing: 1,
        textAlign: isHorizontal ? "left" : "center",
        marginTop: isHorizontal ? 0 : 8,
        marginLeft: isHorizontal && imgPos === "left" ? 6 : 0,
        marginRight: isHorizontal && imgPos === "right" ? 6 : 0,
        lineHeight: 1.1,
        minHeight: isHorizontal ? "auto" : 36,
      }}
    >
      {label}
    </div>
  );

  // Orden del contenido según imgPos
  const contentOrder =
    imgPos === "bottom" || imgPos === "right"
      ? [textNode, imageNode]
      : [imageNode, textNode];

  // Contenido “full” (imagen ocupa todo)
  const fullContent = (
    <div style={{ ...tileBaseStyle, padding: 0 }}>
      {/* Imagen de fondo a pantalla del tile */}
      <img
        src={img}
        alt={label}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "saturate(1.05)",
        }}
      />
      {/* Velo para legibilidad */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            overlayAlign === "bottom"
              ? "linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,.15) 45%, rgba(0,0,0,0) 70%)"
              : overlayAlign === "top"
              ? "linear-gradient(to bottom, rgba(0,0,0,.55), rgba(0,0,0,.15) 45%, rgba(0,0,0,0) 70%)"
              : "linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.25))",
        }}
      />
      {/* Texto sobrepuesto */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems:
            overlayAlign === "bottom" ? "flex-end" : overlayAlign === "top" ? "flex-start" : "center",
          justifyContent: "center",
          padding: 12,
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: "white",
            fontWeight: 900,
            letterSpacing: 1.2,
            fontSize: 18,
            textShadow: "0 2px 6px rgba(0,0,0,.45)",
            background: "rgba(0,0,0,0.15)",
            padding: "6px 10px",
            borderRadius: 10,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );

  // Botón Info (igual que antes)
  const infoBtn = (
    <Button
      className="p-button-rounded p-button-text p-button-plain"
      icon="pi pi-info-circle"
      onClick={(e) => {
        if (!isStatic) e.preventDefault();
        onInfo && onInfo();
      }}
      aria-label={`Info ${label}`}
      style={{
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 2,
        background: "rgba(255,255,255,0.9)",
        borderRadius: 14,
      }}
    />
  );

  const content = (
    <div style={tileBaseStyle}>
      {infoBtn}
      {!isFull ? contentOrder : fullContent}
    </div>
  );

  const Wrapper = isStatic ? React.Fragment : Link;
  const wrapperProps = isStatic ? {} : { to: path, style: { textDecoration: "none" } };

  return (
    <Card
      className="shadow-2"
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Wrapper {...wrapperProps}>{content}</Wrapper>
    </Card>
  );
}

/* ================== MENU PRINCIPAL ================== */
export default function MenuPrincipal() {
  const toast = useRef(null);

  const showInfo = (text) => {
    if (toast.current) {
      toast.current.show({ severity: "info", summary: "Información", detail: text, life: 3000 });
    }
  };

  return (
    <div className="surface-0 p-3 md:p-5" style={{ minHeight: "100vh", background: "#f4f6f8" }}>
      <Toast ref={toast} />
      <div className="flex flex-column align-items-center mb-4">
        <Logo />
        <h2 className="m-0 mt-2" style={{ fontWeight: 800 }}>MENU PRINCIPAL</h2>
      </div>

      <div className="grid">
        {tiles.map((t) => (
          <div key={t.label} className="col-12 sm:col-6 lg:col-3">
            <Tile {...t} onInfo={() => showInfo(t.hint)} />
          </div>
        ))}
      </div>
    </div>
  );
}
