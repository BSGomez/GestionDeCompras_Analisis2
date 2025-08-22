// src/layout/AppLayout.jsx
import React, { useMemo, useRef, useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';

export default function AppLayout({ menuModel = [], activeKey, onNavigate, children }) {
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const userMenuModel = useMemo(
    () => [
      { label: 'Perfil', icon: 'pi pi-user', command: () => console.log('Perfil') },
      { label: 'Preferencias', icon: 'pi pi-cog', command: () => console.log('Preferencias') },
      { separator: true },
      { label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => console.log('Logout') },
    ],
    []
  );

  // Mostrar SIEMPRE todos los items (en colapsado se ocultan solo los labels por CSS)
  const visibleItems = menuModel;

  return (
    <div className="app-shell">
      {/* Lateral fijo (desktop) */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        {/* Header barra lateral (branding + toggle) */}
        {/* Header barra lateral (branding + toggle) */}
<div className="sidebar-header">
  <div
    className="brand"
    onClick={() => {
      if (collapsed) setCollapsed(false); // 👉 se expande si estaba contraído
    }}
    style={{ cursor: 'pointer' }}
  >
    <span className="brand-badge" aria-hidden>
      <i className="pi pi-shopping-cart" />
    </span>
    <div className="brand-texts">
      <span className="brand-title">Compras App</span>
      <span className="brand-subtitle">Purchase Tracking</span>
    </div>
  </div>

  {/* Toggle expandir/contraer */}
  <button
    className="sidebar-toggle"
    onClick={() => setCollapsed((v) => !v)}
    aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
    title={collapsed ? 'Expandir menú' : 'Contraer menú'}
  >
    <i className={collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'} />
  </button>
</div>

        {/* Items del menú */}
        <nav className="nav">
          {visibleItems.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <div
                key={item.key}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => item.command?.() ?? onNavigate?.(item.key)}
                title={collapsed ? item.label : undefined}
              >
                {/* Contenedor del ícono para poder aplicar el “pill” al activo en colapsado */}
                <span className="nav-icon">
                  <i className={item.icon} />
                </span>
                <span className="label">{item.label}</span>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Área principal */}
      <section className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="flex align-items-center gap-2">
            {/* Botón abrir sidebar móvil */}
            <Button
              icon="pi pi-bars"
              text
              rounded
              className="lg:hidden"
              onClick={() => setMobileSidebar(true)}
              aria-label="open menu"
            />
            <div className="flex align-items-center gap-2">
              <i className="pi pi-compass" />
              <span className="font-medium">Panel</span>
              <span className="text-500">/</span>
              <span className="text-600">{menuModel.find((m) => m.key === activeKey)?.label ?? ''}</span>
            </div>
          </div>

          <div className="flex align-items-center gap-2">
            {/* Notificaciones */}
            <span className="p-overlay-badge">
              <Button
                icon="pi pi-bell"
                text
                rounded
                aria-label="notifications"
                onClick={(e) => notifRef.current?.toggle(e)}
              />
              <Badge value="3" severity="danger" />
            </span>

            {/* Usuario */}
            <Button text rounded aria-label="user menu" onClick={(e) => userMenuRef.current?.toggle(e)}>
              <div className="flex align-items-center gap-2">
                <Avatar icon="pi pi-user" shape="circle" />
                <span className="text-700">admin@empresa</span>
                <i className="pi pi-angle-down text-500" />
              </div>
            </Button>
            <Menu model={userMenuModel} popup ref={userMenuRef} />
          </div>
        </header>

        {/* Contenido */}
        <main className="content">{children}</main>
      </section>

      {/* Sidebar móvil (overlay) */}
      <Sidebar visible={mobileSidebar} onHide={() => setMobileSidebar(false)} position="left" showCloseIcon>
        <div className="p-2">
          {menuModel.map((item) => (
            <div
              key={item.key}
              className={`nav-item ${item.key === activeKey ? 'active' : ''}`}
              onClick={() => {
                item.command?.() ?? onNavigate?.(item.key);
                setMobileSidebar(false);
              }}
            >
              <span className="nav-icon">
                <i className={item.icon} />
              </span>
              <span className="label">{item.label}</span>
            </div>
          ))}
        </div>
      </Sidebar>

      {/* Overlay de notificaciones */}
      <OverlayPanel ref={notifRef} showCloseIcon dismissable className="w-20rem">
        <div className="p-2">
          <div className="font-medium mb-2">Notificaciones</div>
          <ul className="m-0 p-0" style={{ listStyle: 'none' }}>
            <li className="mb-2">
              <i className="pi pi-check mr-2" /> OC-7000 aprobada
            </li>
            <li className="mb-2">
              <i className="pi pi-box mr-2" /> Recepción registrada en Bodega Central
            </li>
            <li>
              <i className="pi pi-file-edit mr-2" /> Nueva solicitud pendiente de revisión
            </li>
          </ul>
        </div>
      </OverlayPanel>
    </div>
  );
}
