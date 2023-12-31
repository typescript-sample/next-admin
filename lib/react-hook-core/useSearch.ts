import {useEffect, useState} from 'react';
import {error, getDecodeFromForm, getName, getRemoveError, getValidateForm, handleToggle, hideLoading, initForm, Locale, PageChange, pageSizes, removeFormError, ResourceService, SearchParameter, SearchResult, SearchService, showLoading} from './core';
import {DispatchWithCallback, useMergeState} from './merge';
import {clone} from './reflect';
import {buildFromUrl} from './route';
import {addParametersIntoUrl, append, buildMessage, formatResults, getFieldsFromForm, getModel, handleAppend, handleSort, initFilter, mergeFilter as mergeFilter2, Pagination, removeSortStatus, showPaging, Sortable, validate} from './search';
import {enLocale} from './state';
import {useUpdate} from './update';

export interface Searchable extends Pagination, Sortable {
  nextPageToken?: string;
  excluding?: string[]|number[];
}
interface Filter {
  page?: number;
  limit?: number;
  firstLimit?: number;
  fields?: string[];
  sort?: string;
}

export const callSearch = <T, S extends Filter>(se: S, search3: (s: S, limit?: number, offset?: number|string, fields?: string[]) => Promise<SearchResult<T>>, showResults3: (s: S, sr: SearchResult<T>, lc: Locale) => void, searchError3: (err: any) => void, lc: Locale, nextPageToken?: string) => {
  const s = clone(se);
  let page = se.page;
  if (!page || page < 1) {
    page = 1;
  }
  let offset: number;
  if (!se.limit || se.limit <= 0) {
    se.limit = 24;
  }
  if (se.firstLimit && se.firstLimit > 0) {
    offset = se.limit * (page - 2) + se.firstLimit;
  } else {
    offset = se.limit * (page - 1);
  }
  const limit = (page <= 1 && se.firstLimit && se.firstLimit > 0 ? se.firstLimit : se.limit);
  const next = (nextPageToken && nextPageToken.length > 0 ? nextPageToken : offset);
  const fields = se.fields;
  delete se['page'];
  delete se['fields'];
  delete se['limit'];
  delete se['firstLimit'];
  search3(s, limit, next, fields).then(sr => {
    showResults3(s, sr, lc);
  }).catch(err => err && searchError3(err));
};
const appendListOfState = <T, S extends Filter>(results: T[], list: T[]|undefined, setState2: DispatchWithCallback<Partial<SearchComponentState<T, S>>>) => {
  const arr = append(list, results);
  setState2({ list: arr } as any);
};
const setListOfState = <T, S extends Filter>(list: T[], setState2: DispatchWithCallback<Partial<SearchComponentState<T, S>>>) => {
  setState2({ list } as any);
};
export interface InitSearchComponentParam<T, M extends Filter, S> extends SearchComponentParam<T, M> {
  createFilter?: () => M;
  initialize?: (ld: (s: M, auto?: boolean) => void, setState2: DispatchWithCallback<Partial<S>>, com?: SearchComponentState<T, M>) => void;
}
export interface HookPropsSearchParameter<T, S extends Filter, ST extends SearchComponentState<T, S>, P> extends HookPropsBaseSearchParameter<T, S, ST, P> {
  createFilter?: () => S;
  initialize?: (ld: (s: S, auto?: boolean) => void, setState2: DispatchWithCallback<Partial<ST>>, com?: SearchComponentState<T, S>) => void;
}
export interface SearchComponentParam<T, M extends Filter> {
  addable?: boolean;
  editable?: boolean;
  approvable?: boolean;
  deletable?: boolean;

  keys?: string[];
  sequenceNo?: string;
  hideFilter?: boolean;
  name?: string;
  fields?: string[];
  appendMode?: boolean;
  pageSizes?: number[];
  pageIndex?: number;
  pageSize?: number;
  initPageSize?: number;
  pageMaxSize?: number;
  ignoreUrlParam?: boolean;

  load?: (s: M, auto?: boolean) => void;
  getModelName?: () => string;
  getCurrencyCode?: () => string;
  setFilter?: (s: M) => void;
  getFilter?: (se?: Searchable) => M;
  getFields?: () => string[]|undefined;
  validateSearch?: (se: M, callback: () => void) => void;
  // prepareCustomData?: (data: any) => void;
  format?(obj: T, locale?: Locale): T;
  showResults?(s: M, sr: SearchResult<T>, lc: Locale): void;
  appendList?(results: T[], list: T[]|undefined, s: DispatchWithCallback<Partial<SearchComponentState<T, M>>>): void;
  setList?(list: T[], s: DispatchWithCallback<Partial<SearchComponentState<T, M>>>): void;
  /*
  showLoading?(firstTime?: boolean): void;
  hideLoading?(): void;
  decodeFromForm?(form: HTMLFormElement, locale?: Locale, currencyCode?: string): any;
  registerEvents?(form: HTMLFormElement): void;
  validateForm?(form: HTMLFormElement, locale?: Locale, focusFirst?: boolean, scroll?: boolean): boolean;
  removeFormError?(form: HTMLFormElement): void;
  removeError?(el: HTMLInputElement): void;
  */
}
export interface HookBaseSearchParameter<T, S extends Filter, ST extends SearchComponentState<T, S>> extends SearchComponentParam<T, S> {
  refForm: any;
  initialState: ST;
  service: ((s: S, limit?: number, offset?: number|string, fields?: string[]) => Promise<SearchResult<T>>) | SearchService<T, S>;
  resource: ResourceService;
  showMessage: (msg: string) => void;
  showError: (m: string, header?: string, detail?: string, callback?: () => void) => void;
  getLocale?: () => Locale;
  autoSearch?: boolean;
}
export interface HookPropsBaseSearchParameter<T, S extends Filter, ST extends SearchComponentState<T, S>, P> extends HookBaseSearchParameter<T, S, ST> {
  props?: P;
  // prepareCustomData?: (data: any) => void;
}
export interface SearchComponentState<T, S> extends Pagination, Sortable {
  view?: string;
  nextPageToken?: string;
  keys?: string[];
  filter?: S;
  list?: T[];

  format?: (obj: T, locale: Locale) => T;
  fields?: string[];
  initFields?: boolean;
  triggerSearch?: boolean;
  tmpPageIndex?: number;

  pageMaxSize?: number;
  pageSizes?: number[];
  excluding?: string[]|number[];
  hideFilter?: boolean;

  ignoreUrlParam?: boolean;
  viewable?: boolean;
  addable?: boolean;
  editable?: boolean;
  approvable?: boolean;
  deletable?: boolean;
}

export function mergeParam<T, S extends Filter>(p?: SearchComponentParam<T, S>): SearchComponentParam<T, S> {
  if (p) {
    if (!p.sequenceNo) {
      p.sequenceNo = 'sequenceNo';
    }
    if (!p.pageSize) {
      p.pageSize = 24;
    }
    if (!p.pageSizes) {
      p.pageSizes = pageSizes;
    }
    if (!p.pageMaxSize || p.pageMaxSize <= 0) {
      p.pageMaxSize = 7;
    }
    if (p.hideFilter === undefined) {
      p.hideFilter = true;
    }
    if (p.addable === undefined) {
      p.addable = true;
    }
    if (p.editable === undefined) {
      p.editable = true;
    }
    if (p.approvable === undefined) {
      p.approvable = true;
    }
    if (p.deletable === undefined) {
      p.deletable = true;
    }
    return p;
  } else {
    return {
      sequenceNo: 'sequenceNo',
      pageSize: 24,
      pageSizes,
      pageMaxSize: 7,
      hideFilter: true,
      addable: true,
      editable: true,
      approvable: true,
      deletable: true
    };
  }
}
export const useSearch = <T, S extends Filter, ST extends SearchComponentState<T, S>>(
  refForm: any,
  initialState: ST,
  service: ((s: S, limit?: number, offset?: number|string, fields?: string[]) => Promise<SearchResult<T>>) | SearchService<T, S>,
  p2: SearchParameter,
  p?: InitSearchComponentParam<T, S, ST>,
) => {
  const baseProps = useCoreSearch(refForm, initialState, service, p2, p);

  useEffect(() => {
    const { load, setState, component, searchError } = baseProps;
    if (refForm) {
      const registerEvents = (p2.ui ? p2.ui.registerEvents : undefined);
      initForm(refForm.current, registerEvents);
    }
    if (p && p.initialize) {
      p.initialize(load, setState, component);
    } else {
      const se: S|undefined = (p && p.createFilter ? p.createFilter() : undefined);
      try {
        const s: any = mergeFilter2(buildFromUrl<S>(se), se, component.pageSizes);
        load(s, p2.auto);
      } catch (error) {
        searchError(error);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { ...baseProps };
};
export const useSearchOneProps = <T, S extends Filter, ST extends SearchComponentState<T, S>, P>(p: HookPropsSearchParameter<T, S, ST, P>) => {
  return useSearch(p.refForm, p.initialState, p.service, p, p);
};
export const useSearchOne = <T, S extends Filter, ST extends SearchComponentState<T, S>>(p: HookBaseSearchParameter<T, S, ST>) => {
  return useCoreSearch(p.refForm, p.initialState, p.service, p, p);
};
export const useCoreSearch = <T, S extends Filter, ST>(
  refForm: any,
  initialState: ST,
  service: ((s: S, limit?: number, offset?: number|string, fields?: string[]) => Promise<SearchResult<T>>) | SearchService<T, S>,
  p1: SearchParameter,
  p2?: SearchComponentParam<T, S>
) => {
  const p = mergeParam(p2);
  const [running, setRunning] = useState<boolean>();

  const _getModelName = (): string => {
    return getName('filter', p && p.name ? p.name : undefined);
  };
  const getModelName = (p && p.getModelName ? p.getModelName : _getModelName);

  // const setState2: <K extends keyof S, P>(st: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null), cb?: () => void) => void;
  const baseProps = useUpdate<ST>(initialState, getModelName, p1.getLocale, getRemoveError(p1));
  const { state, setState } = baseProps;
  const [rerender, setRerender] = useState(false);

  // trigger re-render page when change state in useSearch
  useEffect(() => {
    setRerender(!rerender);
  }, [state]);

  const _getCurrencyCode = (): string => {
    return refForm && refForm.current ? refForm.current.getAttribute('currency-code') : null;
  };
  const getCurrencyCode = p && p.getCurrencyCode ? p.getCurrencyCode : _getCurrencyCode;

  // const p = createSearchComponentState<T, S>(p1);
  const [component, setComponent] = useMergeState<SearchComponentState<T, S>>(p);

  const toggleFilter = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    const x = !component.hideFilter;
    handleToggle(event.target as HTMLInputElement, !x);
    setComponent({ hideFilter: x });
  };

  const _getFields = (): string[]|undefined => {
    const { fields, initFields } = component;
    const fs = getFieldsFromForm(fields, initFields, refForm.current);
    setComponent({ fields: fs, initFields: true });
    return fs;
  };
  const getFields = p && p.getFields ? p.getFields : _getFields;

  const _getFilter = (se?: Searchable): S => {
    if (!se) {
      se = component;
    }
    let keys = p && p.keys ? p.keys : undefined;
    if (!keys && typeof service !== 'function' && service.keys) {
      keys = service.keys();
    }
    const n = getModelName();
    let fs = p && p.fields;
    if (!fs || fs.length <= 0) {
      fs = getFields();
    }
    const obj3 = getModel<S>(state, n, se, fs, se.excluding);
    return obj3;
  };
  const getFilter = p && p.getFilter ? p.getFilter : _getFilter;
  const _setFilter = (s: S): void => {
    const objSet: any = {};
    const n = getModelName();
    objSet[n] = s;
    setState(objSet);
  };

  const setFilter = p && p.setFilter ? p.setFilter : _setFilter;

  const _load = (s: S, auto?: boolean): void => {
    const com = Object.assign({}, component);
    const obj2 = initFilter(s, com);
    setComponent(com);
    setFilter(obj2);
    const runSearch = doSearch;
    if (auto) {
      setTimeout(() => {
        runSearch((obj2 as Searchable), true);
      }, 0);
    }
  };
  const load = p && p.load ? p.load : _load;

  const doSearch = (se: Searchable, isFirstLoad?: boolean) => {
    removeFormError(p1, refForm.current);
    const s = getFilter(se);

    if (isFirstLoad){
      setState(state); // force update state if we refresh again page
    }
    const isStillRunning = running;
    validateSearch(s, () => {
      if (isStillRunning === true) {
        return;
      }
      setRunning(true);
      showLoading(p1.loading);
      if (p && !p.ignoreUrlParam) {
        addParametersIntoUrl(s, isFirstLoad);
      }
      const lc = p1.getLocale ? p1.getLocale() : enLocale;
      if (typeof service === 'function') {
        callSearch<T, S>(s, service, showResults, searchError, lc, se.nextPageToken);
      } else {
        callSearch<T, S>(s, service.search, showResults, searchError, lc, se.nextPageToken);
      }
    });
  };

  const _validateSearch = (se: S, callback: () => void) => {
    validate(se, callback, refForm.current, (p1.getLocale ? p1.getLocale() : undefined), getValidateForm(p1));
  };
  const validateSearch = p && p.validateSearch ? p.validateSearch : _validateSearch;

  const pageSizeChanged = (event: any) => {
    const size = parseInt(event.currentTarget.value, 10);
    component.pageSize = size;
    component.pageIndex = 1;
    component.tmpPageIndex = 1;
    setComponent({
      pageSize: size,
      pageIndex: 1,
      tmpPageIndex: 1
    });
    doSearch(component);
  };

  const clearQ = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }
    const n = getModelName();
    if (n && n.length > 0) {
      const m = (state as any)[n];
      if (m) {
        m.q = '';
        const setObj: any = {};
        setObj[n] = m;
        setState(setObj);
        return;
      }
    }
  };

  const search = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.MouseEvent<HTMLElement, MouseEvent>): void => {
    if (event) {
      event.preventDefault();
    }
    resetAndSearch();
  };

  const sort = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (event && event.target) {
      const target = event.target as any;
      const s = handleSort(target, component.sortTarget, component.sortField, component.sortType);
      setComponent({
        sortField: s.field,
        sortType: s.type,
        sortTarget: target
      });
      component.sortField = s.field;
      component.sortType = s.type;
      component.sortTarget = target;
    }
    if (!component.appendMode) {
      doSearch(component);
    } else {
      resetAndSearch();
    }
  };
  const changeView = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, view?: string) => {
    if (view && view.length > 0) {
      setComponent({view});
    } else if (event && event.target) {
      const target = event.target as any;
      const v: string = target.getAttribute('data-view');
      if (v && v.length > 0) {
        setComponent({view: v});
      }
    }
  };

  const resetAndSearch = () => {
    if (running === true) {
      setComponent({ pageIndex: 1, triggerSearch: true });
      return;
    }
    setComponent({ pageIndex: 1, tmpPageIndex: 1 });
    removeSortStatus(component.sortTarget);
    setComponent({
      sortTarget: undefined,
      sortField: undefined,
      append: false,
      pageIndex: 1
    });
    component.sortTarget = undefined;
    component.sortField = undefined;
    component.append = false;
    component.pageIndex = 1;
    doSearch(component);
  };

  const searchError = (err: any): void => {
    setComponent({ pageIndex: component.tmpPageIndex });
    error(err, p1.resource.value, p1.showError);
    hideLoading(p1.loading)
  };
  const appendList = (p && p.appendList ? p.appendList : appendListOfState);
  const setList = (p && p.setList ? p.setList : setListOfState);
  const _showResults = (s: S, sr: SearchResult<T>, lc: Locale) => {
    if (sr === undefined) {
      return;
    }
    const results = sr?.list || [];
    if (results && results.length > 0) {
      formatResults(results, component.pageIndex, component.pageSize, component.pageSize, p ? p.sequenceNo : undefined, p ? p.format : undefined, lc);
    }
    const am = component.appendMode;
    const pi = (s.page && s.page >= 1 ? s.page : 1);
    setComponent({ total: sr.total, pageIndex: pi, nextPageToken: sr.next });
    if (am) {
      let limit = s.limit;
      if ((!s.page || s.page <= 1) && s.firstLimit && s.firstLimit > 0) {
        limit = s.firstLimit;
      }
      handleAppend(component, sr.list, limit, sr.next);
      if (component.append && (s.page && s.page > 1)) {
        appendList(results, component.list, setState as any);
      } else {
        setList(results, setState as any);
      }
    } else {
      showPaging(component, sr.list, s.limit, sr.total);
      setList(results, setState as any);
      setComponent({ tmpPageIndex: s.page });
      if (s.limit) {
        const m1 = buildMessage(p1.resource, s.page, s.limit, sr.list, sr.total);
        p1.showMessage(m1);
      }
    }
    setRunning(false);
    hideLoading(p1.loading);
    if (component.triggerSearch) {
      setComponent({ triggerSearch: false });
      resetAndSearch();
    }
  };
  const showResults = (p && p.showResults ? p.showResults : _showResults);

  const showMore = (event: any) => {
    event.preventDefault();
    const n = component.pageIndex ? component.pageIndex + 1 : 2;
    const m = component.pageIndex;
    setComponent({ tmpPageIndex: m, pageIndex: n, append: true });
    component.tmpPageIndex = m;
    component.pageIndex = n;
    component.append = true;
    doSearch(component);
  };

  const pageChanged = (data: PageChange) => {
    const { page, size } = data;
    setComponent({ pageIndex: page, pageSize: size, append: false });
    component.pageIndex = page;
    component.pageSize = size;
    component.append = false;
    doSearch(component);
  };

  return {
    ...baseProps,
    running,
    setRunning,
    getCurrencyCode,
    resource: p1.resource.resource(),
    setComponent,
    component,
    showMessage: p1.showMessage,
    load,
    search,
    sort,
    changeView,
    showMore,
    toggleFilter,
    doSearch,
    pageChanged,
    pageSizeChanged,
    clearQ,
    showResults,
    getFields,
    getModelName,
    format: p ? p.format : undefined,
    searchError
  };
};
