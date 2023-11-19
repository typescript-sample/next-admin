import Link from 'next/link';
import * as React from 'react';
// import '../group.css';

export interface Item {
  name: string;
  resource?: string;
  path?: string;
  icon?: string;
  children?: Item[];
}
export interface StringMap {
  [key: string]: string;
}
export interface ItemProps {
  groups: Item[];
  resource?: StringMap;
  className?: string;
  headerClass?: string;
  subClass?: string;
}
export interface Props extends ItemProps {
  groupClass?: string;
  title?: string;
}
export function Groups(props: Props) {
  return (React.createElement('div', { className: props.className },
    React.createElement('header', null,
      React.createElement('h2', null, props.title)),
    React.createElement('br', null),
    React.createElement('br', null),
    React.createElement(GroupItems, { groups: props.groups, resource: props.resource, className: props.groupClass, headerClass: props.headerClass, subClass: props.subClass })));
  /* return (
    <div className={props.className}>
      <header>
        <h2>{props.title}</h2>
      </header>
      <br />
      <br />
      <GroupItems groups={props.groups} resource={props.resource} className={props.groupClass} headerClass={props.headerClass} subClass={props.subClass} />
    </div>
  );*/
}
export function GroupItems(props: ItemProps) {
  return (React.createElement(React.Fragment, null,
    React.createElement('section', { className: props.className }, renderGroups(props.groups, props.resource, props.headerClass, props.subClass))));
  /*
  return (
    <React.Fragment>
      <section className={props.className}>{renderGroups(props.groups, props.resource, props.headerClass, props.subClass)}</section>
    </React.Fragment>
  );*/
}
export default GroupItems;
export const renderGroups = (items: Item[], resource?: StringMap, headerClass?: string, subClass?: string) => {
  return items.map((form, idx) => {
    return renderGroup(form, idx, resource, headerClass, subClass);
  });
};
export const renderGroup = (item: Item, idx: number, resource?: StringMap, headerClass?: string, subClass?: string): JSX.Element => {
  let name = item.name;
  if (resource && item.resource) {
    const text = resource[item.resource];
    name = !text || text.length === 0 ? item.name : text;
  }
  const className = getIconClass(item.icon);
  if (item.children && Array.isArray(item.children) && item.children.length > 0) {
    const subs = item.children;
    return (React.createElement('label', { className: headerClass, key: idx },
      React.createElement('div', null,
        React.createElement('i', { className: 'material-icons group-header' }, className),
        React.createElement('span', { className: 'group-header' }, name)),
      React.createElement('ul', { className: 'group-ul' }, renderGroups(subs, resource, headerClass, subClass)),
      React.createElement('hr', null)));
    /*
    return (
      <label className={headerClass} key={idx}>
        <div>
          <i className='material-icons group-header'>{className}</i>
          <span className='group-header'>{name}</span>
        </div>
        <ul className='group-ul'>{renderGroups(subs, resource, headerClass, subClass)}</ul>
        <hr />
      </label>
    );*/
  } else {
    return (React.createElement('label', { className: subClass, key: idx },
      React.createElement(Link, { href: item.path as any },
        React.createElement('div', null,
          React.createElement('i', { className: 'material-icons' }, className),
          React.createElement('span', null, name)))));
    /*
    return (
      <label className={subClass} key={idx}>
        <Link to={item.path as any}>
          <div>
            <i className='material-icons'>{className}</i>
            <span>{name}</span>
          </div>
        </Link>
      </label>
    );*/
  }
};
export function getIconClass(icon?: string): string {
  return !icon || icon.length === 0 ? 'settings' : icon;
}
export function buildShownItems(keyword: string, items: Item[]): Item[] {
  if (!keyword || keyword === '') {
    return items;
  }
  const w = keyword.toLowerCase();
  const shownItems = items.map(parent => {
    const parentCopy = Object.assign({}, parent);
    if (parentCopy.children) {
      parentCopy.children = parentCopy.children.filter(child => child.name.toLowerCase().includes(w));
    }
    return parentCopy;
  }).filter(item => (item.children && item.children.length > 0) || item.name.toLowerCase().includes(w));
  return shownItems;
}
