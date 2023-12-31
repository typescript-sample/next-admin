import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { useMergeState } from '@lib/react-hook-core';
import { collapseAll, expandAll, Nav, sub } from 'reactx-navigator';
import { hasClass, options, parentHasClass, Privilege, storage, StringMap, UserAccount } from '@lib/uione';
import logo from '@assets/images/logo.png';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface InternalState {
  isToggleSearch?: boolean;
  isToggleMenu?: boolean;
  isMenu?: boolean;
  classicMenu?: boolean;
  darkMode?: boolean;
  keyword: string;
  showProfile: string;
  items: Privilege[];
  username?: string;
  userType?: string;
  pinnedItems: Privilege[];
}
let sysBody: HTMLElement | null | undefined;
function getBody(): HTMLElement | null | undefined {
  if (!sysBody) {
    sysBody = global.document?.getElementById('sysBody');
  }
  return sysBody;
}
export const renderItem = (resource: StringMap): any => {
  const top = hasClass('top-menu', getBody());
  if (top) {
    return (
      <><i className='material-icons'>view_list</i><span>{resource.sidebar}</span></>
    );
  } else {
    return (
      <><i className='material-icons'>credit_card</i><span>{resource.menu}</span></>
    );
  }
};
export const renderClassicMenu = (resource: StringMap): any => {
  const top = hasClass('classic', getBody());
  if (top) {
    return (
      <><i className='material-icons'>assessment</i><span>{resource.modern_menu}</span></>
    );
  } else {
    return (
      <><i className='material-icons'>credit_card</i><span>{resource.classic_menu}</span></>
    );
  }
};
export const renderMode = (resource: StringMap): any => {
  const dark = parentHasClass('dark', getBody());
  if (dark) {
    return (
      <><i className='material-icons'>radio_button_checked</i><span>{resource.light_mode}</span></>
    );
  } else {
    return (
      <><i className='material-icons'>timelapse</i><span>{resource.dark_mode}</span></>
    );
  }
};
const initialState: InternalState = {
  isMenu: false,
  darkMode: false,
  keyword: '',
  showProfile: '',
  items: [],
  username: '',
  userType: '',
  pinnedItems: []
};
export const LayoutPage = ({children}:{children:React.ReactNode}) => {
  const resource = storage.getResource();
  const router = useRouter()
  const [state, setState] = useMergeState<InternalState>(initialState);
  const [topClass, setTopClass] = useState('');
  const [user, setUser] = useState<UserAccount | null | undefined>();

  useEffect(() => {
    const items = storage.privileges();
    if (items && items.length > 0) {
      for (let i = 0; i <= items.length; i++) {
        if (items[i]) {
          items[i].sequence = i + 1;
        }
      }
    }
    setState({ items });

    const username = storage.username();
    const userType = storage.getUserType();
    if (username || userType) {
      setState({ username, userType });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearQ = () => {
    setState({ keyword: '' });
    router.push(`home?q=`);
  };
  const search = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
  };
  const handleInput = (e: { target: { value: string } }) => {
    const v = e.target.value;
    setState({ keyword: v });
    router.push(`home?q=${v}`);
  };
  const toggleSearch = () => {
    setState({ isToggleSearch: !state.isToggleSearch });
  };

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setState({ isToggleMenu: !state.isToggleMenu });
  };

  function toggleProfile() {
    if (!user) {
      router.push('/authentication/signin');
    } else {
      setState({ showProfile: state.showProfile === 'show' ? '' : 'show' });
    }
  }
  const changeClassicMenu = () => {
    const body = getBody();
    if (body) {
      if (body.classList.contains('classic')) {
        body.classList.remove('classic');
        setState({ classicMenu: true });
      } else {
        body.classList.add('classic');
        setState({ classicMenu: false });
      }
    }
  };
  const changeMenu = () => {
    const body = getBody();
    if (body) {
      if (body.classList.contains('top-menu')) {
        body.classList.remove('top-menu');
        setState({ isMenu: true });
      } else {
        body.classList.add('top-menu');
        setState({ isMenu: false });
      }
    }
  };
  const changeMode = () => {
    const body = getBody();
    if (body) {
      const parent = body.parentElement;
      if (parent) {
        if (parent.classList.contains('dark')) {
          parent.classList.remove('dark');
          setState({ darkMode: false });
        } else {
          parent.classList.add('dark');
          setState({ darkMode: true });
        }
      }
    }
  };
  const signout = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const request = new HttpRequest(axios, options);
    const config: any = storage.config();
    const url = config.authentication_url + '/authentication/signout/' + storage.username();
    request.get(url).catch(() => { });
    sessionStorage.removeItem('authService');
    sessionStorage.clear();
    storage.setUser(null);
    router.push('/authentication/signin');
  };

  const pin = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, item: Privilege) => {
    event.stopPropagation();
    const { items, pinnedItems } = state;
    if (items.find((i) => i === item)) {
      const removedItem = items.splice(index, 1);
      pinnedItems.push(removedItem[0]);
      items.sort((moduleA, moduleB) => sub(moduleA.sequence, moduleB.sequence));
      pinnedItems.sort((moduleA, moduleB) => sub(moduleA.sequence, moduleB.sequence));
      setState({ items: items, pinnedItems: pinnedItems });
    } else {
      const removedModule = pinnedItems.splice(index, 1);
      items.push(removedModule[0]);
      items.sort((moduleA, moduleB) => sub(moduleA.sequence, moduleB.sequence));
      pinnedItems.sort((moduleA, moduleB) => sub(moduleA.sequence, moduleB.sequence));
      setState({ items: items, pinnedItems: pinnedItems });
    }
  };
  useEffect(() => {    
    setUser(storage.user());
  }, [storage.user()]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    setState({ keyword: router.query.q as string });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);
  useEffect(() => {
    const { isToggleMenu, isToggleSearch } = state;
    const topClassList = ['sidebar-parent'];
    if (isToggleMenu) {
      topClassList.push('menu-on');
    }
    if (isToggleSearch) {
      topClassList.push('search');
    }
    setTopClass(topClassList.join(' '));
  }, [state]);

  return (
    <div id='root'>
      <div className={topClass}>
      <div className='top-banner'>
        <div className='logo-banner-wrapper'>
          <img src='https://jacobspradlin.files.wordpress.com/2014/10/banner-people-connected.png' alt='Banner of The Company' />
          <img src='https://jacobspradlin.files.wordpress.com/2014/10/banner-people-connected.png' className='banner-logo-title' alt='Logo of The Company' />
        </div>
      </div>
      <div className='menu sidebar'>
        <Nav className='expanded-all'
          iconClass='material-icons'
          path={global.location?.pathname}
          pins={state.pinnedItems}
          items={state.items}
          resource={resource}
          pin={pin}
          toggle={toggleMenu}
          expand={expandAll}
          collapse={collapseAll} />
      </div>
      <div className='page-container'>
        <div className='page-header'>
          <form>
            <div className='search-group'>
              <section>
                <button type='button' className='toggle-menu' onClick={toggleMenu} />
                <button type='button' className='toggle-search' onClick={toggleSearch} />
                <button type='button' className='close-search' onClick={toggleSearch} />
              </section>
              <div className='logo-wrapper'>
                <img className='logo' src={logo.src} alt='Logo of The Company' />
              </div>
              <label className='search-input'>
                <input type='text' id='q' name='q' maxLength={1000} placeholder={resource.keyword} value={state.keyword || ''} style={{ paddingLeft: '12px' }} onChange={handleInput} autoComplete='off' />
                <button type='button' hidden={!state.keyword} className='btn-remove-text' onClick={clearQ} />
                <button type='button' className='btn-search' onClick={search} />
              </label>
              <section className='quick-nav'>
                {/*<button type='button' className='notifications'><i className='material-icons'>notifications</i></button>
                <button type='button' className='mail'><i className='material-icons'>mail</i></button>*/}
                {global.location?.pathname !== '/welcome' && <Link href='welcome'><i className='material-icons'>home</i></Link>}
                <div className='dropdown-menu-profile'>
                  {(!user || !user.imageURL) && (
                    <i className='material-icons' onClick={toggleProfile}>
                      person
                    </i>
                  )}
                  {!user &&
                    <ul id='dropdown-basic' className={state.showProfile + ' dropdown-content-profile'}>
                      <li className='menu' onClick={changeMenu}>{renderItem(resource)}</li>
                      <li className='classic-menu' onClick={changeClassicMenu}>{renderClassicMenu(resource)}</li>
                      <hr style={{ margin: 0 }} />
                      <li onClick={changeMode}>{renderMode(resource)}</li>
                      <hr style={{ margin: 0 }} />
                      <li><i className='material-icons'>account_circle</i><Link href={'/authentication/signin'} >{resource.signin}</Link></li>
                    </ul>
                  }
                  {user &&
                    <ul id='dropdown-basic' className={state.showProfile + ' dropdown-content-profile'}>
                      <li className='menu' onClick={changeMenu}>{renderItem(resource)}</li>
                      <li className='classic-menu' onClick={changeClassicMenu}>{renderClassicMenu(resource)}</li>
                      <hr style={{ margin: 0 }} />
                      <li onClick={changeMode}>{renderMode(resource)}</li>
                      <hr style={{ margin: 0 }} />
                      <li><i className='material-icons'>account_circle</i><Link href={'my-profile'} >{state.username}</Link></li>
                      <li><i className='material-icons'>settings</i><Link href={'my-profile/settings'}>{resource.my_settings}</Link></li>
                      <hr style={{ margin: 0 }} />
                      <li>
                        <i className='material-icons'>exit_to_app</i>
                        <button onClick={signout}>
                          {resource.button_signout}
                        </button>
                      </li>
                    </ul>
                  }
                </div>
              </section>
            </div>
          </form>
        </div>
        <div className='page-body'>
          {children}
        </div>
      </div>
    </div>
    </div>
  );
};
export default LayoutPage;
