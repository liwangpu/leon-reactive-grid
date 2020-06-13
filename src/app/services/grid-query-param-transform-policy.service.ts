import { Injectable } from '@angular/core';
import { IHistory, IQueryParamTransformPolicy } from '@cxist/xcloud-grid';

@Injectable()
export class GridQueryParamTransformPolicyService implements IQueryParamTransformPolicy {

    public transform(param?: IHistory): { [key: string]: any } {
        console.log('transform', param);

        // if (param.filters?.length) {
        //     let logicalExpression: Array<{ [key: string]: any }> = [];
        //     param.filters.forEach(f => {
        //         logicalExpression.push({
        //             [f.field]: { [f.operator]: f.value }
        //         });
        //     });
        //     param['filter'] = { [param.filterLogic]: logicalExpression };
        //     delete param.filters;
        //     delete param.filterLogic;
        // }

        return param;
    }
}
