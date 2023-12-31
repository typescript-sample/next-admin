import { useRouter } from 'next/router';
import {useEffect, useState} from 'react';
import {Attributes, buildId, createEditStatus, EditStatusConfig, ErrorMessage, getModelName as getModelName2, hideLoading, initForm, LoadingService, Locale, message, messageByHttpStatus, ResourceService, showLoading, UIService} from './core';
import {build, createModel as createModel2, EditParameter, GenericService, handleStatus, handleVersion, initPropertyNullInModel, ResultInfo} from './edit';
import {focusFirstError, readOnly as setReadOnly} from './formutil';
import {DispatchWithCallback, useMergeState} from './merge';
import {clone, makeDiff} from './reflect';
import {localeOf} from './state';
import {useUpdate} from './update';
import {  confirm } from 'ui-alert';
export interface BaseEditComponentParam<T, ID> {
  status?: EditStatusConfig;
  backOnSuccess?: boolean;
  name?: string;
  metadata?: Attributes;
  keys?: string[];
  version?: string;
  setBack?: boolean;
  patchable?: boolean;

  addable?: boolean;
  readOnly?: boolean;
  deletable?: boolean;

  insertSuccessMsg?: string;
  updateSuccessMsg?: string;

  handleNotFound?: (form?: HTMLFormElement) => void;
  getModelName?: (f?: HTMLFormElement) => string;
  getModel?: () => T;
  showModel?: (m: T) => void;
  createModel?: () => T;
  onSave?: (isBack?: boolean) => void;
  validate?: (obj: T, callback: (obj2?: T) => void) => void;
  succeed?: (msg: string, origin: T, version?: string, isBack?: boolean, model?: T) => void;
  fail?: (result: ErrorMessage[]) => void;
  handleError?: (error: any) => void;
  postSave?: (res: number|T|ErrorMessage[], origin: T, version?: string, isPatch?: boolean, backOnSave?: boolean) => void;
  handleDuplicateKey?: (result?: T) => void;
  load?: (i: ID|null, callback?: (m: T, showM: (m2: T) => void) => void) => void;
  doSave?: (obj: T, diff?: T, version?: string, isBack?: boolean) => void;
  // prepareCustomData?: (data: any) => void; // need to review
}
export interface HookBaseEditParameter<T, ID, S> extends BaseEditComponentParam<T, ID> {
  refForm: any;
  initialState: S;
  service: GenericService<T, ID, number|T|ErrorMessage[]>;
  resource: ResourceService;
  showMessage: (msg: string) => void;
  showError: (m: string, header?: string, detail?: string, callback?: () => void) => void;
  getLocale?: () => Locale;
  confirm: (m2: string, header?: string, yesCallback?: () => void, btnLeftText?: string, btnRightText?: string, noCallback?: () => void) => void;
  ui?: UIService;
  loading?: LoadingService;
}
export interface EditComponentParam<T, ID, S> extends BaseEditComponentParam<T, ID> {
  initialize?: (id: ID|null, ld: (i: ID|null, cb?: (m: T, showF: (model: T) => void) => void) => void, setState2: DispatchWithCallback<Partial<S>>, callback?: (m: T, showF: (model: T) => void) => void) => void;
  callback?: (m: T, showF: (model: T) => void) => void;
}
export interface HookPropsEditParameter<T, ID, S, P> extends HookPropsBaseEditParameter<T, ID, S, P> {
  initialize?: (id: ID|null, ld: (i: ID|null, cb?: (m: T, showF: (model: T) => void) => void) => void, setState2: DispatchWithCallback<Partial<S>>, callback?: (m: T, showF: (model: T) => void) => void) => void;
  callback?: (m: T, showF: (model: T) => void) => void;
}
export interface HookPropsBaseEditParameter<T, ID, S, P> extends HookBaseEditParameter<T, ID, S> {
  props: P;
  // prepareCustomData?: (data: any) => void;
}
export const useEdit = <T, ID, S>(
  refForm: any,
  initialState: S,
  service: GenericService<T, ID, number|T|ErrorMessage[]>,
  p2: EditParameter,
  p?: EditComponentParam<T, ID, S>
  ) => {
  const router = useRouter();
  const baseProps = useCoreEdit(refForm, initialState, service, p2, p);
  useEffect(() => {
    if (refForm) {
      const registerEvents = (p2.ui ? p2.ui.registerEvents : undefined);
      initForm(baseProps.refForm.current, registerEvents);
    }
    const n = baseProps.getModelName(refForm.current);
    const obj: any = {};
    obj[n] = baseProps.createModel();
    baseProps.setState(obj);
    let keys: string[]|undefined;
    if (p && !p.keys && service && service.metadata) {
      const metadata = (p.metadata ? p.metadata : service.metadata());
      if (metadata) {
        const meta = build(metadata);
        keys = (p.keys ? p.keys : (meta ? meta.keys : undefined));
        const version = (p.version ? p.version : (meta ? meta.version : undefined));
        p.keys = keys;
        p.version = version;
      }
    } else if (p) {
      keys = p.keys
    }
    const id = buildId<ID>(router.query , keys);
    if (p && p.initialize) {
      p.initialize(id, baseProps.load, baseProps.setState, p.callback);
    } else {
      baseProps.load(id, p ? p.callback : undefined);
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);
  return {...baseProps};
};
export const useEditProps = <T, ID, S, P>(
  props: P,
  refForm: any,
  initialState: S,
  service: GenericService<T, ID, number|T|ErrorMessage[]>,
  p2: EditParameter,
  p?: EditComponentParam<T, ID, S>
  ) => {
  const router = useRouter();
  const baseProps = useCoreEdit<T, ID, S, P>(refForm, initialState, service, p2, p, props);
  useEffect(() => {
    if (refForm) {
      const registerEvents = (p2.ui ? p2.ui.registerEvents : undefined);
      initForm(baseProps.refForm.current, registerEvents);
    }
    const n = baseProps.getModelName(refForm.current);
    const obj: any = {};
    obj[n] = baseProps.createModel();
    baseProps.setState(obj);
    let keys: string[]|undefined;
    if (p && !p.keys && service && service.metadata) {
      const metadata = (p.metadata ? p.metadata : service.metadata());
      if (metadata) {
        const meta = build(metadata);
        keys = (p.keys ? p.keys : (meta ? meta.keys : undefined));
        const version = (p.version ? p.version : (meta ? meta.version : undefined));
        p.keys = keys;
        p.version = version;
      }
    }
    const id = buildId<ID>(router.query, keys);
    if (p && p.initialize) {
      p.initialize(id, baseProps.load, baseProps.setState, p.callback);
    } else {
      baseProps.load(id, p ? p.callback : undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {...baseProps};
};
export const useEditOneProps = <T, ID, S, P>(p: HookPropsEditParameter<T, ID, S, P>) => {
  return useEditProps(p.props, p.refForm, p.initialState, p.service, p, p);
};
export const useEditOne = <T, ID, S>(p: HookBaseEditParameter<T, ID, S>) => {
  return useEdit(p.refForm, p.initialState, p.service, p, p);
};
export const useCoreEdit = <T, ID, S, P>(
  refForm: any,
  initialState: S,
  service: GenericService<T, ID, number|T|ErrorMessage[]>,
  p1: EditParameter,
  p?: BaseEditComponentParam<T, ID>,
  props?: P
  ) => {
    /*
  const {
    backOnSuccess = true,
    patchable = true,
    addable = true
  } = p; */
  const router = useRouter()
  const addable = (p && p.patchable !== false ? true : undefined);
  const back = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (event) {
      event.preventDefault();
    }
    router.back();
  };

  const [running, setRunning] = useState<boolean>();

  const getModelName = (f?: HTMLFormElement|null): string => {
    if (p && p.name && p.name.length > 0) {
      return p.name;
    }
    return getModelName2(f);
  };
  const baseProps = useUpdate<S>(initialState, getModelName, p1.getLocale);

  const { state, setState } = baseProps;
  const [flag, setFlag] = useMergeState({
    newMode: false,
    setBack: false,
    addable,
    readOnly: p ? p.readOnly : undefined,
    originalModel: undefined
  });

  const showModel = (model: T) => {
    const n = getModelName(refForm.current);
    const objSet: any = {};
    objSet[n] = model;
    setState(objSet);
    if (p && p.readOnly) {
      const f = refForm.current;
      setReadOnly(f);
    }
  };

  const resetState = (newMode: boolean, model: T, originalModel?: T) => {
    setFlag({ newMode, originalModel } as any);
    showModel(model);
  };

  const _handleNotFound = (form?: any): void => {
    const msg = message(p1.resource.value, 'error_404', 'error');
    if (form) {
      setReadOnly(form);
    }
    p1.showError(msg.message, msg.title, undefined, () => {
      debugger;
      window.history.back;
    });
  };
  const handleNotFound = (p && p.handleNotFound ? p.handleNotFound : _handleNotFound);

  const _getModel = () => {
    const n = getModelName(refForm.current);
    if (props) {
      return (props as any)[n] || (state as any)[n];
    } else {
      return (state as any)[n];
    }
  };
  const getModel = (p && p.getModel ? p.getModel : _getModel);

  const _createModel = (): T => {
    const metadata = (p && p.metadata ? p.metadata : (service.metadata ? service.metadata() : undefined));
    if (metadata) {
      const obj = createModel2<T>(metadata);
      return obj;
    } else {
      const obj: any = {};
      return obj;
    }
  };
  const createModel = (p && p.createModel ? p.createModel : _createModel);

  const create = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const obj = createModel();
    resetState(true, obj, undefined);
    const u = p1.ui;
    if (u) {
      setTimeout(() => {
        u.removeFormError(refForm.current);
      }, 100);
    }
  };

  const _onSave = (isBack?: boolean) => {
    if (flag.newMode === true && flag.addable === false) {
      const m = message(p1.resource.value, 'error_permission_add', 'error_permission');
      p1.showError(m.message, m.title);
      return;
    } else if (p && flag.newMode === false && p.readOnly) {
      const msg = message(p1.resource.value, 'error_permission_edit', 'error_permission');
      p1.showError(msg.message, msg.title);
      return;
    } else {
      if (running === true) {
        return;
      }
      const obj = getModel();
      const metadata = (p && p.metadata ? p.metadata : (service.metadata ? service.metadata() : undefined));
      let keys: string[]|undefined;
      let version: string|undefined;
      if (p && metadata && (!p.keys || !p.version)) {
        const meta = build(metadata);
        keys = (p.keys ? p.keys : (meta ? meta.keys : undefined));
        version = (p.version ? p.version : (meta ? meta.version : undefined));
      }
      if (flag.newMode) {
        validate(obj, () => {
          const msg = message(p1.resource.value, 'msg_confirm_save', 'confirm', 'yes', 'no');
          p1.confirm(msg.message, msg.title, () => {
            doSave(obj, undefined, version, isBack);
          }, msg.no, msg.yes);
        });
      } else {
        const diffObj = makeDiff(initPropertyNullInModel(flag.originalModel, metadata), obj, keys, version);
        const objKeys = Object.keys(diffObj);
        if (objKeys.length === 0) {
          p1.showMessage(p1.resource.value('msg_no_change'));
        } else {
          validate(obj, () => {
            const msg = message(p1.resource.value, 'msg_confirm_save', 'confirm', 'yes', 'no');
            p1.confirm(msg.message, msg.title, () => {
              doSave(obj, diffObj as any, version, isBack);
            }, msg.no, msg.yes);
          });
        }
      }
    }
  };
  const onSave = (p && p.onSave ? p.onSave : _onSave);

  const save = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    event.persist();
    onSave();
  };

  const _validate = (obj: T, callback: (obj2?: T) => void) => {
    if (p1.ui) {
      const valid = p1.ui.validateForm(refForm.current, localeOf(undefined, p1.getLocale));
      if (valid) {
        callback(obj);
      }
    } else {
      callback(obj);
    }
  };
  const validate = (p && p.validate ? p.validate : _validate);

  const _succeed = (msg: string, origin: T, version?: string, isBack?: boolean, model?: T) => {
    if (model) {
      setFlag({ newMode: false });
      if (model && flag.setBack === true) {
        resetState(false, model, clone(model));
      } else {
        handleVersion(origin, version);
      }
    } else {
      handleVersion(origin, version);
    }
    p1.showMessage(msg);
    if (isBack) {
      back(undefined);
    }
  };
  const succeed = (p && p.succeed ? p.succeed : _succeed);

  const _fail = (result: ErrorMessage[]) => {
    const f = refForm.current;
    const u = p1.ui;
    if (u && f) {
      const unmappedErrors = u.showFormError(f, result);
      focusFirstError(f);
      if (unmappedErrors && unmappedErrors.length > 0) {
        const t = p1.resource.value('error');
        if (p1.ui && p1.ui.buildErrorMessage) {
          const msg = p1.ui.buildErrorMessage(unmappedErrors);
          p1.showError(msg, t);
        } else {
          p1.showError(unmappedErrors[0].field + ' ' + unmappedErrors[0].code + ' ' + unmappedErrors[0].message, t);
        }
      }
    } else {
      const t = p1.resource.value('error');
      if (result.length > 0) {
        p1.showError(result[0].field + ' ' + result[0].code + ' ' + result[0].message, t);
      } else {
        p1.showError(t, t);
      }
    }
  };
  const fail = (p && p.fail ? p.fail : _fail);

  const _handleError = function (err: any) {
    if (err) {
      setRunning(false);
      hideLoading(p1.loading);
      const errMsg = p1.resource.value('error_internal');
      const data = (err && err.response) ? err.response : err;
      if (data.status === 400) {
        const errMsg = p1.resource.value('error_400');
        p1.showError(errMsg, "Error");
      } else{
        p1.showError(errMsg, "Error");
      }
    }
  };
  const handleError = (p && p.handleError ? p.handleError : _handleError);

  const _postSave = (r: number | T|ErrorMessage[], origin: T, version?: string, isPatch?: boolean, backOnSave?: boolean) => {
    setRunning(false);
    hideLoading(p1.loading);
    const x: any = r;
    const successMsg = p1.resource.value('msg_save_success');
    const newMod = flag.newMode;
    const st = createEditStatus(p ? p.status : undefined);
    if (Array.isArray(x)) {
      fail(x);
    } else if (!isNaN(x)) {
      if (x === st.success) {
        succeed(successMsg, origin, version, backOnSave);
      } else {
        if (newMod && x === st.duplicate_key) {
          handleDuplicateKey();
        } else if (!newMod && x === st.not_found) {
          handleNotFound();
        } else if (!newMod && x === st.version_error) {
          const title = p1.resource.value('error');
          const err = p1.resource.value('error_version');
          p1.showError(err, title);
        } else {
          handleStatus(x as number, st, p1.resource.value, p1.showError);
        }
      }
    } else {
      const result = r as T;
      if (isPatch) {
        const keys = Object.keys(result as any);
        const a: any = origin;
        for (const k of keys) {
          a[k] = (result as any)[k];
        }
        succeed(successMsg, a, undefined, backOnSave, a);
      } else {
        succeed(successMsg, origin, version, backOnSave, r as T);
      }
      p1.showMessage(successMsg);
    }
  };
  const postSave = (p && p.postSave ? p.postSave : _postSave);

  const _handleDuplicateKey = (result?: T) => {
    const msg = message(p1.resource.value, 'error_duplicate_key', 'error');
    p1.showError(msg.message, msg.title);
  };
  const handleDuplicateKey = (p && p.handleDuplicateKey ? p.handleDuplicateKey : _handleDuplicateKey);

  const _doSave = (obj: T, body?: Partial<T>, version?: string, isBack?: boolean) => {
    setRunning(true);
    showLoading(p1.loading);
    const isBackO = (isBack != null && isBack !== undefined ? isBack : false);
    const patchable = (p ? p.patchable : true);
    if (flag.newMode === false) {
      if (service.patch && patchable !== false && body && Object.keys(body).length > 0) {
        service.patch(body).then(result => {
          postSave(result, obj, version, true, isBackO);
        }).catch(handleError);
      } else {
        service.update(obj).then(result => postSave(result, obj, version, false, isBackO)).catch(handleError);
      }
    } else {
      service.insert(obj).then(result => postSave(result, obj, version, false, isBackO)).catch(handleError);
    }
  };

  const doSave = (p && p.doSave ? p.doSave : _doSave);

  const _load = (_id: ID|null, callback?: (m: T, showM: (m2: T) => void) => void) => {
    const id: any = _id;
    if (id && id !== '' && id !== 'new') {
      setRunning(true);
      showLoading(p1.loading);
      debugger
      service.load(id).then(obj => {
        if (!obj) {
          handleNotFound(refForm.current);
        } else {
          setFlag({ newMode: false, originalModel: clone(obj) });
          if (callback) {
            callback(obj, showModel);
          } else {
            showModel(obj);
          }
        }
        setRunning(false);
        hideLoading(p1.loading);
      }).catch(err => {
        const data = (err &&  err.response) ? err.response : err;
        const r = p1.resource;
        const title = r.value('error');
        let msg = r.value('error_internal');
        if (data && data.status === 404) {
          handleNotFound(refForm.current);
        } else {
          if (data.status && !isNaN(data.status)) {
            msg = messageByHttpStatus(data.status, r.value);
          }
          if (data && (data.status === 401 || data.status === 403)) {
            setReadOnly(refForm.current);
          }
          p1.showError(msg, title);
        }
        setRunning(false);
        hideLoading(p1.loading);
      });
    } else {
      const obj = createModel();
      setFlag({ newMode: true, originalModel: undefined });
      if (callback) {
        callback(obj, showModel);
      } else {
        showModel(obj);
      }
    }
  };
  const load = (p && p.load ? p.load : _load);

  return {
    ...baseProps,
    back,
    refForm,
    ui: p1.ui,
    resource: p1.resource.resource(),
    flag,
    running,
    setRunning,
    showModel,
    getModelName,
    resetState,
    handleNotFound,
    getModel,
    createModel,
    create,
    save,
    onSave,
    // eslint-disable-next-line no-restricted-globals
    confirm,
    validate,
    showMessage: p1.showMessage,
    succeed,
    fail,
    postSave,
    handleDuplicateKey,
    load,
    doSave
  };
};
