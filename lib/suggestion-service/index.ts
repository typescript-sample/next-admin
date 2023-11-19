export interface PreviousData<T> {
    keyword: string;
    list: T[];
  }
  
  export interface Suggestion<T> {
    list: T[];
    last: PreviousData<T>;
  }
  
  export class SuggestionService<T> {
    constructor(protected loadData: (keyword: string, max: number, ctx?: any) => Promise<T[]>, public max: number = 20, public displayField: string = '', public valueField: string = '') {
      this.load = this.load.bind(this);
    }
    load(keyword: string, last: PreviousData<T>, excludingValues?: T[]): Promise<Suggestion<T>> {
      if (
        keyword.length > 1 && keyword.startsWith(last.keyword) &&
        last.list.length < this.max
      ) {
        let list: T[] | undefined;
        keyword = keyword.toUpperCase();
        if (this.displayField !== '') {
          list = last.list.filter(item => (item as any)[this.displayField].toUpperCase().includes(keyword));
        } else {
          list = last.list.filter(item => String(item).toUpperCase().includes(keyword));
        }
        return Promise.resolve({ list: list, last });
      } else {
        return this.loadData(keyword, this.max).then(list => {
          if (excludingValues && excludingValues.length > 0) {
            if (this.valueField !== '') {
              list = list.filter(obj => !excludingValues.find(item => (obj as any)[this.valueField] === item));
            } else {
              list = list.filter(obj => !excludingValues.find(item => obj === item));
            }
          }
          last.keyword = keyword;
          last.list = list;
          return { list, last };
        })
      }
    }
  }
  