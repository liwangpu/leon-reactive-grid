import { DStoreOption, IDStore } from './i-dstore';
import { IFilterView } from './i-filter-view';
import { IQueryResult } from './i-query-result';
import { ITableButton } from './i-table-button';
import { ITableColumn } from './i-table-column';

export abstract class DStore implements IDStore {

    public tableButtons: Array<ITableButton>;
    public dynamicTableButtons?: (data: any) => Promise<Array<ITableButton>>;
    private gridStartupFn: (option?: DStoreOption) => void;
    public abstract getColumns(): Promise<Array<ITableColumn>>;
    public abstract onQuery(queryParam?: { [key: string]: any }): Promise<IQueryResult>;
    public abstract getFilterViews(): Promise<Array<IFilterView>>;
    public abstract onFilterViewCreate(view: IFilterView): Promise<IFilterView>;
    public abstract onFilterViewUpdate(view: IFilterView): Promise<void>;
    public async onQueryReset(): Promise<void> {/***/ }
    public async onDataSelected(datas: Array<any>): Promise<void> {/***/ }
    public async onLinkFieldClick(field: string, data: any): Promise<void> {/***/ }
    public async onTableButtonClick(data: any, key: string, button: any, buttonType: 'static' | 'dynamic'): Promise<void> {/***/ }
    public async gridStartup(option?: DStoreOption): Promise<void> {
        option = option || {};

        this.gridStartupFn(option);
    }
    public registryGridStartup(fn: (option: DStoreOption) => void): void {
        this.gridStartupFn = fn;
    }
}