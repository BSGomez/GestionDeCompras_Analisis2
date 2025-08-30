import React, { useMemo, useState } from "react";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";

/* ========= MOCKS (luego conecta a tu API) ========= */
const mockModules = [
  { MOD_Modulo: 1, MOD_Nombre: "Compras" },
  { MOD_Modulo: 2, MOD_Nombre: "Inventario" },
  { MOD_Modulo: 3, MOD_Nombre: "Contabilidad" },
];

const mockRoles = [
  { ROL_Rol: 10, ROL_Descripcion: "Solicitante", MOD_Modulo: 1 },
  { ROL_Rol: 20, ROL_Descripcion: "Aprobador", MOD_Modulo: 1 },
  { ROL_Rol: 30, ROL_Descripcion: "Bodega", MOD_Modulo: 2 },
  { ROL_Rol: 40, ROL_Descripcion: "Contador", MOD_Modulo: 3 },
];

const mockEmployees = [
  { EMP_Empleado: 100, nombre: "Ana López", cargo: "Analista" },
  { EMP_Empleado: 200, nombre: "Luis Pérez", cargo: "Jefe Compras" },
  { EMP_Empleado: 300, nombre: "María Díaz", cargo: "Aux. Bodega" },
];

const mockUsers = [
  { USR_Usuario: 1000, ROL_Rol: 10, EMP_Empleado: 100, estado: "Activo" },
  { USR_Usuario: 2000, ROL_Rol: 20, EMP_Empleado: 200, estado: "Activo" },
  { USR_Usuario: 3000, ROL_Rol: 30, EMP_Empleado: 300, estado: "Inactivo" },
];

export default function UsersModule() {
  const [activeIndex, setActiveIndex] = useState(0);

  // ======= Estados principales =======
  const [modules, setModules] = useState(mockModules);
  const [roles, setRoles] = useState(mockRoles);
  const [users, setUsers] = useState(mockUsers);

  // ======= Búsquedas por tab =======
  const [searchUsers, setSearchUsers] = useState("");
  const [searchRoles, setSearchRoles] = useState("");
  const [searchModules, setSearchModules] = useState("");

  // ======= Formularios =======
  const [userForm, setUserForm] = useState({
    EMP_Empleado: null,
    ROL_Rol: null,
    estado: "Activo",
  });

  const [roleForm, setRoleForm] = useState({
    ROL_Descripcion: "",
    MOD_Modulo: null,
  });

  const [moduleForm, setModuleForm] = useState({
    MOD_Nombre: "",
  });

  // ======= Mapas memoizados (evitan helpers volátiles) =======
  const rolesById = useMemo(() => new Map(roles.map(r => [r.ROL_Rol, r])), [roles]);
  const modulesById = useMemo(() => new Map(modules.map(m => [m.MOD_Modulo, m])), [modules]);
  const employeesById = useMemo(() => new Map(mockEmployees.map(e => [e.EMP_Empleado, e])), []);

  // ======= Filtros =======
  const filteredUsers = useMemo(() => {
    const t = searchUsers.trim().toLowerCase();
    if (!t) return users;

    return users.filter(u => {
      const emp = employeesById.get(u.EMP_Empleado);
      const role = rolesById.get(u.ROL_Rol);
      const mod  = role ? modulesById.get(role.MOD_Modulo) : null;

      return (
        String(u.USR_Usuario).includes(t) ||
        (emp?.nombre || "").toLowerCase().includes(t) ||
        (role?.ROL_Descripcion || "").toLowerCase().includes(t) ||
        (mod?.MOD_Nombre || "").toLowerCase().includes(t)
      );
    });
  }, [searchUsers, users, employeesById, rolesById, modulesById]);

  const filteredRoles = useMemo(() => {
    const t = searchRoles.trim().toLowerCase();
    if (!t) return roles;

    return roles.filter(r =>
      String(r.ROL_Rol).includes(t) ||
      (r.ROL_Descripcion || "").toLowerCase().includes(t) ||
      (modulesById.get(r.MOD_Modulo)?.MOD_Nombre || "").toLowerCase().includes(t)
    );
  }, [searchRoles, roles, modulesById]);

  const filteredModules = useMemo(() => {
    const t = searchModules.trim().toLowerCase();
    if (!t) return modules;

    return modules.filter(m =>
      String(m.MOD_Modulo).includes(t) ||
      (m.MOD_Nombre || "").toLowerCase().includes(t)
    );
  }, [searchModules, modules]);

  // ======= Guardar registros (mock) =======
  const handleSaveUser = () => {
    if (!userForm.EMP_Empleado || !userForm.ROL_Rol) return;
    const nuevo = { USR_Usuario: Date.now(), ...userForm };
    setUsers(prev => [nuevo, ...prev]);
    setUserForm({ EMP_Empleado: null, ROL_Rol: null, estado: "Activo" });
  };

  const handleSaveRole = () => {
    if (!roleForm.ROL_Descripcion || !roleForm.MOD_Modulo) return;
    const nuevo = { ROL_Rol: Date.now(), ...roleForm };
    setRoles(prev => [nuevo, ...prev]);
    setRoleForm({ ROL_Descripcion: "", MOD_Modulo: null });
  };

  const handleSaveModule = () => {
    if (!moduleForm.MOD_Nombre) return;
    const nuevo = { MOD_Modulo: Date.now(), ...moduleForm };
    setModules(prev => [nuevo, ...prev]);
    setModuleForm({ MOD_Nombre: "" });
  };

  // ======= Templates =======
  const UserCard = (u) => {
    const emp = employeesById.get(u.EMP_Empleado);
    const role = rolesById.get(u.ROL_Rol);
    const mod  = role ? modulesById.get(role.MOD_Modulo) : null;

    return (
      <Card className="p-3" pt={{ header: "pb-0" }}>
        <div className="flex justify-content-between align-items-start gap-3">
          <div className="flex gap-3">
            <div
              className="flex align-items-center justify-content-center"
              style={{ width: 48, height: 48, borderRadius: 12, background: "var(--icon-color)" }}
            >
              <i className="pi pi-user" style={{ fontSize: 22, color: "var(--icon-color-icon)" }} />
            </div>
            <div>
              <div className="font-medium text-lg">{emp?.nombre ?? "—"}</div>
              <div className="text-500 text-sm">ID Usuario: {u.USR_Usuario} · {emp?.cargo ?? "—"}</div>
              <div className="flex flex-wrap gap-4 text-600 text-sm mt-2">
                <span className="flex align-items-center gap-2">
                  <i className="pi pi-id-card" />
                  Rol: {role?.ROL_Descripcion ?? "—"}
                </span>
                <span className="flex align-items-center gap-2">
                  <i className="pi pi-th-large" />
                  Módulo: {mod?.MOD_Nombre ?? "—"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex align-items-center gap-3">
            <div className="text-right">
              <Tag value={u.estado} severity={u.estado === "Activo" ? "success" : "warning"} />
            </div>
            <div className="flex gap-2">
              <Button icon="pi pi-pencil" rounded text aria-label="Editar" />
              <Button icon="pi pi-trash" rounded text aria-label="Eliminar" severity="danger" />
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const RoleCard = (r) => {
    const mod = modulesById.get(r.MOD_Modulo);
    return (
      <Card className="p-3">
        <div className="flex justify-content-between align-items-start gap-3">
          <div className="flex gap-3">
            <div
              className="flex align-items-center justify-content-center"
              style={{ width: 48, height: 48, borderRadius: 12, background: "var(--icon-color)" }}
            >
              <i className="pi pi-verified" style={{ fontSize: 22, color: "var(--icon-color-icon)" }} />
            </div>
            <div>
              <div className="font-medium text-lg">{r.ROL_Descripcion ?? "—"}</div>
              <div className="text-500 text-sm">ID Rol: {r.ROL_Rol}</div>
              <div className="text-600 text-sm mt-2">Módulo: {mod?.MOD_Nombre ?? "—"}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded text aria-label="Editar" />
            <Button icon="pi pi-trash" rounded text aria-label="Eliminar" severity="danger" />
          </div>
        </div>
      </Card>
    );
  };

  const ModuleCard = (m) => (
    <Card className="p-3">
      <div className="flex justify-content-between align-items-start gap-3">
        <div className="flex gap-3">
          <div
            className="flex align-items-center justify-content-center"
            style={{ width: 48, height: 48, borderRadius: 12, background: "var(--icon-color)" }}
          >
            <i className="pi pi-th-large" style={{ fontSize: 22, color: "var(--icon-color-icon)" }} />
          </div>
          <div>
            <div className="font-medium text-lg">{m.MOD_Nombre}</div>
            <div className="text-500 text-sm">ID Módulo: {m.MOD_Modulo}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button icon="pi pi-pencil" rounded text aria-label="Editar" />
          <Button icon="pi pi-trash" rounded text aria-label="Eliminar" severity="danger" />
        </div>
      </div>
    </Card>
  );

  // ======= Tabs =======
  const UsersTab = () => (
    <div className="flex flex-column gap-3">
      <div className="flex gap-3">
        <span className="p-input-icon-left flex-1">
          <i className="pi pi-search" />
          <InputText
            value={searchUsers}
            onChange={(e) => setSearchUsers(e.target.value)}
            placeholder="  Buscar usuario, rol o módulo"
            className="w-full"
          />
        </span>
        <Button icon="pi pi-filter" label="Filter" outlined />
      </div>

      <Card>
        <div className="p-fluid grid formgrid">
          <div className="field col-12 md:col-5">
            <label>Empleado *</label>
            <Dropdown
              value={userForm.EMP_Empleado}
              options={mockEmployees.map((e) => ({
                label: `${e.nombre} (${e.cargo})`,
                value: e.EMP_Empleado,
              }))}
              onChange={(e) => setUserForm({ ...userForm, EMP_Empleado: e.value })}
              placeholder="Selecciona empleado"
              className="w-full"
              filter
            />
          </div>
          <div className="field col-12 md:col-5">
            <label>Rol *</label>
            <Dropdown
              value={userForm.ROL_Rol}
              options={roles.map((r) => ({
                label: `${r.ROL_Descripcion} — ${modulesById.get(r.MOD_Modulo)?.MOD_Nombre ?? ""}`,
                value: r.ROL_Rol,
              }))}
              onChange={(e) => setUserForm({ ...userForm, ROL_Rol: e.value })}
              placeholder="Selecciona rol"
              className="w-full"
              filter
            />
          </div>
          <div className="field col-12 md:col-2">
            <label>Estado</label>
            <Dropdown
              value={userForm.estado}
              options={[
                { label: "Activo", value: "Activo" },
                { label: "Inactivo", value: "Inactivo" },
              ]}
              onChange={(e) => setUserForm({ ...userForm, estado: e.value })}
              className="w-full"
            />
          </div>
          <Divider />
          <div className="flex gap-2">
            <Button icon="pi pi-check" label="Guardar Usuario" onClick={handleSaveUser} />
            <Button
              icon="pi pi-times"
              label="Cancelar"
              outlined
              onClick={() => setUserForm({ EMP_Empleado: null, ROL_Rol: null, estado: "Activo" })}
            />
          </div>
        </div>
      </Card>

      <DataView
        value={filteredUsers}
        layout="grid"
        paginator
        rows={6}
        itemTemplate={(item) => <div className="col-12">{UserCard(item)}</div>}
      />
    </div>
  );

  const RolesTab = () => (
    <div className="flex flex-column gap-3">
      <div className="flex gap-3">
        <span className="p-input-icon-left flex-1">
          <i className="pi pi-search" />
          <InputText
            value={searchRoles}
            onChange={(e) => setSearchRoles(e.target.value)}
            placeholder="  Buscar rol o módulo"
            className="w-full"
          />
        </span>
        <Button icon="pi pi-filter" label="Filter" outlined />
      </div>

      <Card>
        <div className="p-fluid grid formgrid">
          <div className="field col-12 md:col-8">
            <label>Descripción del Rol *</label>
            <InputText
              value={roleForm.ROL_Descripcion}
              onChange={(e) => setRoleForm({ ...roleForm, ROL_Descripcion: e.target.value })}
              placeholder="Ej. Aprobador"
            />
          </div>
          <div className="field col-12 md:col-4">
            <label>Módulo *</label>
            <Dropdown
              value={roleForm.MOD_Modulo}
              options={modules.map((m) => ({ label: m.MOD_Nombre, value: m.MOD_Modulo }))}
              onChange={(e) => setRoleForm({ ...roleForm, MOD_Modulo: e.value })}
              placeholder="Selecciona módulo"
              className="w-full"
            />
          </div>
          <Divider />
          <div className="flex gap-2">
            <Button icon="pi pi-check" label="Guardar Rol" onClick={handleSaveRole} />
            <Button
              icon="pi pi-times"
              label="Cancelar"
              outlined
              onClick={() => setRoleForm({ ROL_Descripcion: "", MOD_Modulo: null })}
            />
          </div>
        </div>
      </Card>

      <DataView
        value={filteredRoles}
        layout="grid"
        paginator
        rows={6}
        itemTemplate={(item) => <div className="col-12">{RoleCard(item)}</div>}
      />
    </div>
  );

  const ModulesTab = () => (
    <div className="flex flex-column gap-3">
      <div className="flex gap-3">
        <span className="p-input-icon-left flex-1">
          <i className="pi pi-search" />
          <InputText
            value={searchModules}
            onChange={(e) => setSearchModules(e.target.value)}
            placeholder="  Buscar módulo"
            className="w-full"
          />
        </span>
        <Button icon="pi pi-filter" label="Filter" outlined />
      </div>

      <Card>
        <div className="p-fluid grid formgrid">
          <div className="field col-12 md:col-8">
            <label>Nombre del Módulo *</label>
            <InputText
              value={moduleForm.MOD_Nombre}
              onChange={(e) => setModuleForm({ ...moduleForm, MOD_Nombre: e.target.value })}
              placeholder="Ej. Compras"
            />
          </div>
          <Divider />
          <div className="flex gap-2">
            <Button icon="pi pi-check" label="Guardar Módulo" onClick={handleSaveModule} />
            <Button
              icon="pi pi-times"
              label="Cancelar"
              outlined
              onClick={() => setModuleForm({ MOD_Nombre: "" })}
            />
          </div>
        </div>
      </Card>

      <DataView
        value={filteredModules}
        layout="grid"
        paginator
        rows={6}
        itemTemplate={(item) => <div className="col-12">{ModuleCard(item)}</div>}
      />
    </div>
  );

  // ======= Render =======
  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="title">Administración de Usuarios</h2>
        </div>
      </div>

      <TabView className="pill-tabs" activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Usuarios">
          <UsersTab />
        </TabPanel>
        <TabPanel header="Roles">
          <RolesTab />
        </TabPanel>
        <TabPanel header="Módulos">
          <ModulesTab />
        </TabPanel>
      </TabView>
    </div>
  );
}
