"use client"

import * as React from 'react';
import { createModel, DispatchWithCallback, EditComponentParam, useEdit } from '@lib/react-hook-core';
import { handleError, inputEdit, Status } from '@lib/uione';
import { getRoleService, Privilege, Role } from '@service/index';
import { useRouter } from 'next/navigation';

interface InternalState {
  role: Role;
  allPrivileges: Privilege[];
  shownPrivileges: Privilege[];
  checkedAll?: boolean;
  keyword: string;
  all: string[];
}
const initialState: InternalState = {
  role: {} as Role,
  allPrivileges: [],
  shownPrivileges: [],
  keyword: '',
  checkedAll: false,
  all: [],
};
const createRole = (): Role => {
  const user = createModel<Role>();
  user.status = Status.Active;
  return user;
};
function getPrivilege(id: string, all: Privilege[]): Privilege|undefined {
  if (!all || !id) {
    return undefined;
  }
  for (const root of all) {
    if (root.id === id) {
      return root;
    }
    if (root.children && root.children.length > 0) {
      const m = getPrivilege(id, root.children);
      if (m) {
        return m;
      }
    }
  }
  return undefined;
}
function containOne(privileges?: string[], all?: Privilege[]): boolean {
  if (!privileges || privileges.length === 0 || !all || all.length === 0) {
    return false;
  }
  for (const m of all) {
    if (privileges.includes(m.id)) {
      return true;
    }
  }
  return false;
}
function buildAll(privileges: string[], all: Privilege[]): void {
  for (const root of all) {
    privileges.push(root.id);
    if (root.children && root.children.length > 0) {
      buildAll(privileges, root.children);
    }
  }
}
function buildPrivileges(id: string, type: string, privileges: string[], all: Privilege[]): string[] {
  if (type === 'parent') {
    const parent = getPrivilege(id, all);
    if (parent && parent.children) {
      const ids = parent.children.map(i => i.id);
      const ms = privileges.filter(i => !ids.includes(i));
      if (containOne(privileges, parent.children)) {
        return ms;
      } else {
        return ms.concat(parent.children.map(i => i.id));
      }
    } else {
      return [];
    }
  } else {
    let checked = true;
    if (privileges && privileges.length > 0) {
      const m = privileges.find(item => item === id);
      checked = (m != null);
    } else {
      checked = false;
    }
    if (!checked) {
      return privileges.concat([id]);
    } else {
      return privileges.filter(item => item !== id);
    }
  }
}
function isCheckedAll(privileges: string[]|undefined, all: string[], setState2: DispatchWithCallback<Partial<InternalState>>) {
  const checkedAll = privileges && all && privileges.length === all.length;
  setState2({ checkedAll });
}
function buildShownModules(keyword: string, allPrivileges: Privilege[]): Privilege[] {
  if (!keyword || keyword === '') {
    return allPrivileges;
  }
  const w = keyword.toLowerCase();
  const shownPrivileges = allPrivileges.map(parent => {
    const parentCopy = Object.assign({}, parent);
    if (parentCopy.children) {
      parentCopy.children = parentCopy.children.filter(child => child.name.toLowerCase().includes(w));
    }
    return parentCopy;
  }).filter(item => (item.children && item.children.length > 0) || item.name.toLowerCase().includes(w));
  return shownPrivileges;
}
const initialize = async (roleId: string|null, load: (id: string|null) => void, set: DispatchWithCallback<Partial<InternalState>>) => {
  const roleService = getRoleService();
  roleService.getPrivileges().then(allPrivileges => {
    const all: string[] = [];
    buildAll(all, allPrivileges);
    set({ all, allPrivileges, shownPrivileges: allPrivileges }, () => load(roleId));
  }).catch(handleError);
};
const param: EditComponentParam<Role, string, InternalState> = {
  createModel: createRole,
  initialize
};
function RoleForm() {
  const router = useRouter();
  const refForm = React.useRef();
  // const history = useHistory();
  const { state, setState, back, flag, updateState, save, resource } = useEdit<Role, string, InternalState>(refForm, initialState, getRoleService(), inputEdit(), param);
  React.useEffect(() => {
    showModel(state.role);
  }, [state.role]); // eslint-disable-line react-hooks/exhaustive-deps
  function showModel(obj: Role) {
    if (!obj) {
      return;
    }
    const { all } = state;
    if (!obj.privileges) {
      obj.privileges = [];
    } else {
      obj.privileges = obj.privileges.map(p => p.split(' ', 1)[0]);
    }
    setState({ role: obj }, () => isCheckedAll(obj.privileges, all, setState));
  }
  const handleCheckAll = (event: any) => {
    const { all } = state;
    const obj = state.role;
    event.persist();
    const checkedAll = event.target.checked;
    obj.privileges = (checkedAll ? all : []);
    setState({ role: obj, checkedAll });
  };
  const handleCheck = (event: any) => {
    const { all, allPrivileges } = state;
    event.persist();
    const obj = state.role;
    const target = event.target;
    const id = target.getAttribute('data-id');
    const type = target.getAttribute('data-type');
    obj.privileges = buildPrivileges(id, type, obj.privileges ? obj.privileges : [], allPrivileges);
    setState({ role: obj }, () => isCheckedAll(role.privileges, all, setState));
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    const { allPrivileges } = state;
    const shownPrivileges = buildShownModules(q, allPrivileges);
    setState({ keyword: q, shownPrivileges });
  };
  const assign = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
    e.preventDefault();
    router.push(`/admin/roles/assign/${id}`);
    return;
  };

  const renderForms = (roles: Role, modules: Privilege[]|undefined, parentId: string, disableds: boolean, allPrivilege: Privilege[]) => {
    if (!modules || modules.length === 0) {
      return '';
    }
    return modules.map(m => renderForm(roles, m, parentId, disableds, allPrivilege));
  };

  const renderForm = (roles: Role, m: Privilege, parentId: string, disableds: boolean, allPrivilege: Privilege[]) => {
    if (m.children && m.children.length > 0) {
      const checked = containOne(roles.privileges, m.children);
      return (
        <section className='col s12' key={m.id}>
          <label className='checkbox-container'>
            <input
              type='checkbox'
              name='modules'
              disabled={disableds}
              data-id={m.id}
              data-type='parent'
              checked={checked}
              onChange={handleCheck} />
            {m.name}
          </label>
          <section className='row checkbox-group'>
            {renderForms(roles, m.children, m.id, disableds, allPrivilege)}
          </section>
          <hr />
        </section>
      );
    } else {
      return (
        <section className='col s12 m4 l3' key={m.id}>
          <label className='checkbox-container'>
            <input
              type='checkbox'
              name='modules'
              data-id={m.id}
              data-parent={parentId}
              checked={roles.privileges ? (roles.privileges.find(item => item === m.id) ? true : false) : false}
              onChange={handleCheck}
            />
            {m.name}
          </label>
        </section>
      );
    }
  };
  const role = state.role;
  return (
    <div className='view-container'>
      <form id='roleForm' name='roleForm' model-name='role' ref={refForm as any}>
        <header>
          <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
          <h2>{flag.newMode ? resource.create : resource.edit} {resource.role}</h2>
          <button className='btn-group btn-right'><i onClick={e => assign(e, role.roleId)} className='material-icons'>group</i></button>
        </header>
        <div>
          <section className='row'>
            <label className='col s12 m6'>
              {resource.role_id}
              <input type='text'
                id='roleId' name='roleId'
                value={role.roleId || ''}
                onChange={updateState}
                maxLength={20} required={true}
                readOnly={!flag.newMode}
                placeholder={resource.role_id} />
            </label>
            <label className='col s12 m6'>
              {resource.role_name}
              <input type='text'
                id='roleName' name='roleName'
                value={role.roleName || ''}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.role_name} />
            </label>
            <label className='col s12 m6'>
              {resource.remark}
              <input type='text'
                id='remark' name='remark'
                value={role.remark || ''}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.remark} />
            </label>
            <div className='col s12 m6 radio-section'>
              {resource.status}
              <div className='radio-group'>
                <label>
                  <input
                    type='radio'
                    id='active'
                    name='status'
                    onChange={(e) => updateState(e, () => setState)}
                    value='A' checked={role.status === 'A'} />
                  {resource.active}
                </label>
                <label>
                  <input
                    type='radio'
                    id='inactive'
                    name='status'
                    onChange={(e) => updateState(e, () => setState)}
                    value='I' checked={role.status === 'I'} />
                  {resource.inactive}
                </label>
              </div>
            </div>
          </section>
          <h4>
            <label>
              <input
                type='checkbox'
                value='all'
                disabled={state.keyword !== ''}
                data-type='all'
                checked={state.checkedAll}
                onChange={handleCheckAll} />
              {resource.all_privileges}
            </label>
            <label className='col s12 search-input'>
              <i className='btn-search' />
              <input type='text'
                id='keyword'
                name='keyword'
                maxLength={40}
                placeholder={resource.role_filter_modules}
                value={state.keyword}
                onChange={onChange} />
            </label>
          </h4>
          <section className='row hr-height-1'>
            {
              renderForms(state.role, state.shownPrivileges, '', state.keyword !== '', state.allPrivileges)}
          </section>
        </div>
        <footer>
          {!flag.readOnly &&
            <button type='submit' id='btnSave' name='btnSave' onClick={save}>
              {resource.save}
            </button>}
        </footer>
      </form>
    </div>
  );
}

export default RoleForm