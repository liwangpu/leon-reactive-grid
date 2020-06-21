import { IFilterView } from './i-filter-view';
import { IQueryResult } from './i-query-result';
import { ITableButton } from './i-table-button';
import { ITableColumn } from './i-table-column';
import { IQueryParam } from './i-query-param';

export interface DStoreOption {
    rowsPerPageOptions?: Array<number>;
    selectMode?: 'single' | 'multiple';
    enableView?: boolean;
    enableColumnFrozen?: boolean;
    enableEdit?: boolean;
    showNestedDataLevel?: number;
    nestedToggleColumn?: string;
    noPagination?: boolean;
    enableUrlHistory?: boolean;
    otherQueryParams?: { [key: string]: any };
}

export interface ITableColumnStore {
    getColumns(): Promise<Array<ITableColumn>>;
}

export interface IDataStore {
    onQuery(queryParam?: { [key: string]: any }): Promise<IQueryResult>;
}

export interface IFilterStore {
    getFilterViews(): Promise<Array<IFilterView>>;
    onFilterViewCreate(view: IFilterView): Promise<IFilterView>;
    onFilterViewUpdate(view: IFilterView): Promise<void>;
}

export interface IDStore extends ITableColumnStore, IDataStore, IFilterStore {
    tableButtons: Array<ITableButton>;
    dynamicTableButtons?(data: any): Promise<Array<ITableButton>>;
    onTableButtonClick(data: any, key: string, button: any, buttonType: 'static' | 'dynamic'): Promise<void>;
    onLinkFieldClick(field: string, data: any): Promise<void>;
    onDataSelected(datas: Array<any>): Promise<void>;
    gridStartup(option?: DStoreOption): void;
    gridRefresh(queryParams?: { [key: string]: any }): void;
    registryGridStartup(fn: (option: DStoreOption) => void): void;
    registryGridRefresh(fn: (queryParams?: { [key: string]: any }) => void): void
}
