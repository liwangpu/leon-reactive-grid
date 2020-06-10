import { InjectionToken } from '@angular/core';

export interface IGridConfig {
    idProperty: string;
    rowsPerPageOptions: Array<number>;
}

export const GRIDCONFIG: InjectionToken<IGridConfig> = new InjectionToken<IGridConfig>('grid config');
