import * as React from 'react';
import { Fragment } from 'react';

import styles from './pagination.module.css';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

export interface PageChange {
  page: number; // currentPage
  size: number; // itemsPerPage
  totalPages?: number;
  total?: number;
}
export interface Props {
  init?: number;
  size?: number;
  page?: number;
  max?: number;
  total?: number;
  onChange?: (e: PageChange) => void;
  className?: string;
}
const range = (from: number, to: number, step: number = 1) => {
  let i = from;
  const ranges = [];
  while (i <= to) {
    ranges.push(i);
    i += step;
  }
  return ranges;
};

export function getNumber(n: number | undefined, m: number): number {
  return (typeof n === 'number' && n !== undefined && n != null && n > 0 ? n : m);
}
export function getMaxSize(maxSize: number | undefined, m: number) {
  return typeof maxSize === 'number' ? Math.max(0, Math.min(maxSize, 2)) : m;
}
export function getTotalPages(totalRecords: number, itemsPerPage: number): number {
  const x = Math.ceil(totalRecords / itemsPerPage);
  return (x <= 0 ? 1 : x);
}
export class Pagination extends React.Component<Props, any> {
  total: number;
  totalPages: number;
  max: number;
  size: number;
  page: number;
  initSize?: number;
  constructor(props: Props) {
    super(props);
    // const {totalRecords = 0, pageSize: itemsPerPage = 12, maxSize = 7, initPageSize} = props;
    // this.initDataPage(totalRecords, itemsPerPage, maxSize, initPageSize);
    this.total = getNumber(Number(props.total), 0);
    this.max = getMaxSize(props.max, 7);
    this.size = getNumber(props.size, 12);
    this.initSize = getNumber(props.init, this.size);
    this.totalPages = getTotalPages(this.total, this.size);
    this.page = getNumber(props.page, 1);
  }

  componentDidMount() {
    // this.gotoPage(1);
  }

  gotoPage = (page: number) => {
    const { onChange: onPageChanged = f => f } = this.props;
    this.page = Math.max(0, Math.min(page, this.totalPages));
    const paginationData = {
      page: this.page,
      size: this.size,
      totalPages: this.totalPages,
      totalRecords: this.total
    };

    this.setState(() => onPageChanged(paginationData));
  }
  handleClick = (page: number, evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    evt.preventDefault();
    this.gotoPage(page);
  }
  handleMoveLeft = (evt: { preventDefault: () => void; }) => {
    evt.preventDefault();
    this.gotoPage(this.page - this.max * 2 - 1);
  }
  handleMoveRight = (evt: { preventDefault: () => void; }) => {
    evt.preventDefault();
    this.gotoPage(this.page + this.max * 2 + 1);
  }
  fetchPageNumbers = () => {
    debugger
    const totalPages = this.totalPages;
    const maxSize = this.max;

    const totalNumbers = this.max * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      let pages = [];

      const leftBound = this.page - maxSize;
      const rightBound = this.page + maxSize;
      const beforeLastPage = totalPages - 1;

      const startPage = leftBound > 2 ? leftBound : 2;
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

      pages = range(startPage, endPage);

      const pagesCount = pages.length;
      const singleSpillOffset = totalNumbers - pagesCount - 1;

      const leftSpill = startPage > 2;
      const rightSpill = endPage < beforeLastPage;

      const leftSpillPage = LEFT_PAGE;
      const rightSpillPage = RIGHT_PAGE;

      if (leftSpill && !rightSpill) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        pages = [leftSpillPage, ...extraPages, ...pages];
      } else if (!leftSpill && rightSpill) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
        pages = [...pages, ...extraPages, rightSpillPage];
      } else if (leftSpill && rightSpill) {
        pages = [leftSpillPage, ...pages, rightSpillPage];
      }
      return [1, ...pages, totalPages];
    }
    return range(1, totalPages);
  }

  render() {
    this.size = getNumber(this.props.size, 12);
    this.total = getNumber(Number(Number(this.props.total)) , 0);
    // this.maxSize = getMaxSize(this.props.maxSize, 7);
    this.totalPages = getTotalPages(this.total, this.size);
    this.page = getNumber(this.props.page, 1);
    console.log("size", getNumber(this.props.size, 12),
      "total", getNumber(Number(this.props.total), 0),
      "totalPages", getTotalPages(this.total, this.size),
      "page", getNumber(this.props.page, 1));

    if (!this.total || this.total <= 0) {
      return null;
    }

    if (!this.totalPages || this.totalPages <= 1) {
      return null;
    }
    const pages = this.fetchPageNumbers();
    const x = this;
    return (React.createElement(Fragment, null,
      React.createElement('nav', { className: this.props.className, 'aria-label': 'Countries Pagination' },
        React.createElement('ul', { className: styles.pagination }, pages.map((page, index) => {
          if (page === LEFT_PAGE) {
            return (React.createElement('li', { key: index, className: styles['page-item'] },
              React.createElement('a', { className: styles['page-link'], 'aria-label': 'Previous', onClick: x.handleMoveLeft },
                React.createElement('span', { 'aria-hidden': 'true' }, '\u00AB'),
                React.createElement('span', { className: styles['sr-only'] }, 'Previous'))));
          }
          if (page === RIGHT_PAGE) {
            return (React.createElement('li', { key: index, className: styles['page-item'] },
              React.createElement('a', { className: styles['page-link'], 'aria-label': 'Next', onClick: x.handleMoveRight },
                React.createElement('span', { 'aria-hidden': 'true' }, '\u00BB'),
                React.createElement('span', { className: styles['sr-only'] }, 'Next'))));
          }
          return (React.createElement('li', { key: index, className: styles['page-item'] + (x.page === page ? ' active' : '') },
            React.createElement('a', { className: styles['page-link'], onClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) { return x.handleClick(page as any, e); } }, page)));
        })))));
    /*
    return (
      <Fragment>
        <nav className={this.props.className} aria-label='Countries Pagination'>
          <ul className='pagination'>
            {pages.map((page, index) => {
              if (page === LEFT_PAGE) {
                return (
                  <li key={index} className='page-item'>
                    <a className='page-link'
                       aria-label='Previous'
                       onClick={this.handleMoveLeft}
                    >
                      <span aria-hidden='true'>&laquo;</span>
                      <span className='sr-only'>Previous</span>
                    </a>
                  </li>
                );
              }

              if (page === RIGHT_PAGE) {
                return (
                  <li key={index} className='page-item'>
                    <a className='page-link'
                       aria-label='Next'
                       onClick={this.handleMoveRight}
                    >
                      <span aria-hidden='true'>&raquo;</span>
                      <span className='sr-only'>Next</span>
                    </a>
                  </li>
                );
              }
              return (
                <li
                  key={index}
                  className={`page-item${
                    this.currentPage === page ? ' active' : ''
                    }`}
                >
                  <a
                    className='page-link'
                    onClick={(e) => this.handleClick(page, e)}
                  >
                    {page}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </Fragment>
    );*/
  }
}
export default Pagination;
