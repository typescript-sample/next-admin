import * as React from 'react';
import { PageSizeSelect, SearchComponentState, datetimeToString, useSearch, value } from "next-hook-core";
import { AuditLog, AuditLogFilter } from "@service/audit-log/audit-log";
import { Item } from "onecore";
import { formatLongDateTime } from 'ui-plus';
import { useAuditLog } from "@service/audit-log";
import { getLocale, inputSearch } from "uione";
import Pagination from "reactx-paging";


interface AuditLogSearch extends SearchComponentState<AuditLog, AuditLogFilter> {
  statusList: Item[];
}

const auditLogfilter: AuditLogFilter = {
  id: '',
  action: '',
  time: undefined
};

const AuditSearch: AuditLogSearch = {
  statusList: [],
  list: [],
  filter: auditLogfilter
};

const mapStyleStatus: Map<string, string> = new Map([
  ['success', 'badge-outline-success'],
  ['fail', 'badge-outline-danger '],
]);

const AuditLogsForm = () => {
  const dateFormat = getLocale().dateFormat.toUpperCase();
  const refForm = React.useRef();
  const hooks = useSearch<AuditLog, AuditLogFilter, AuditLogSearch>(refForm, AuditSearch, useAuditLog(), inputSearch());
  const { state, resource, component, updateState, pageSizeChanged, pageChanged, changeView, sort } = hooks;
  component.view = 'table';
  component.viewable = true;
  component.editable = true;
  const edit = (e: any, id: string) => {
    e.preventDefault();
    return
  };
  const filter = value(state.filter);
  return (
    <div className='view-container'>
      <header>
        <h2>{resource.audit_logs}</h2>
        <div className='btn-group float-left'>
          {component.view !== 'table' && <button type='button' id='btnTable' name='btnTable' className='btn-table' data-view='table' onClick={changeView} />}
          {component.view === 'table' && <button type='button' id='btnListView' name='btnListView' className='btn-list-view' data-view='listview' onClick={changeView} />}
        </div>
      </header>
      <div>
        <form id='rolesForm' name='rolesForm' noValidate={true} ref={refForm as any}>
          <section className='row search-group inline'>
            <label className='col s12 m6'>
              Action
              <input
                type='text'
                id='action'
                name='action'
                value={filter.action}
                onChange={updateState}
                maxLength={240}
              />
            </label>
            <label className='col s12 m4 l4'>
              {resource.audit_log_time}
              <input type='datetime-local' id='time_min' name='time_min' data-field='time.min' value={datetimeToString(filter?.time?.min || '')} onChange={updateState} />
              <input type='datetime-local' id='time_max' name='time_max' data-field='time.max' value={datetimeToString(filter?.time?.max || '')} onChange={updateState} />
            </label>
          </section>
          <section className='btn-group'>
            <label>
              {resource.page_size}
              <PageSizeSelect size={component.pageSize} sizes={component.pageSizes} onChange={pageSizeChanged} />
            </label>
            <button type='submit' className='btn-search' onClick={hooks.search}>{resource.search}</button>
          </section>

        </form>
        <form className='list-result'>
          {component.view === 'table' && (
            <div className='table-responsive'>
              <table>
                <thead>
                  <tr>
                    <th>{resource.sequence}</th>
                    <th data-field='time'>
                      <button type='button' id='sortTime' onClick={sort}>
                        {resource.audit_log_time}
                      </button>
                    </th>
                    <th data-field='resource'>
                      <button type='button' id='sortResource' onClick={sort}>
                        {resource.audit_log_resource_type}
                      </button>
                    </th>
                    <th data-field='action'>
                      <button type='button' id='sortAction' onClick={sort}>
                        {resource.audit_log_action}
                      </button>
                    </th>
                    <th data-field='status'>
                      <button type='button' id='sortStatus' onClick={sort}>
                        {resource.status}
                      </button>
                    </th>
                    <th data-field='userId'>
                      {resource.audit_log_created_by}
                    </th>
                    <th data-field='ip'>
                      <button type='button' id='sortIp' onClick={sort}>
                        {resource.ip}
                      </button>
                    </th>
                    <th data-field='remark'>
                      <button type='button' id='sortRemark' onClick={sort}>
                        {resource.remark}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {state.list &&
                    state.list.length > 0 &&
                    state.list.map((item: any, i: number) => {
                      return (
                        <tr key={i} onClick={(e) => edit(e, item.id)}>
                          <td className='text-right'>{(item as any).sequenceNo}</td>
                          <td>{formatLongDateTime(item.time, dateFormat)}</td>
                          <td>{item.resource}</td>
                          <td>{item.action}</td>
                          <td><span className={'badge badge-sm ' + mapStyleStatus.get(item.status)}>{item.status || ''}</span></td>
                          <td>{item.email}</td>
                          <td>{item.ip}</td>
                          <td>{item.remark}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
          {component.view === 'list' && (<ul className='row list-view'>
            {state.list && state.list.length > 0 && state.list.map((item, i) => {
              return (
                <li key={i} className='col s12 m6 l4 xl3' onClick={e => edit(e, item.userId)}>
                  <section>
                    <div>
                      <h3>{item.userId}</h3>
                      <h4>{item.action}</h4>
                      <p>{item.remark}</p>
                    </div>
                  </section>
                </li>
              );
            })}
          </ul>)}
          <Pagination className='col s12 m6' total={component.total} size={component.pageSize} max={component.pageMaxSize} page={component.pageIndex} onChange={pageChanged} />
        </form>
      </div>
    </div>
  );
};
export default AuditLogsForm
