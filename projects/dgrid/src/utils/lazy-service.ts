import { AbstractType, InjectFlags, InjectionToken, Type } from '@angular/core';
import * as _ from 'lodash';

/**
 * 懒加载服务,需要使用该装饰器的时候,构造函数必须要有injector,名称一模一样
 * @param token token
 * @param notFoundValue notFoundValue
 * @param flags flags
 */
export function LazyService(token: Type<any> | InjectionToken<any> | AbstractType<any>, notFoundValue?: any, flags?: InjectFlags): any {
    return function (target: object, propertyKey: string): any {
        const getter: any = function (): any {
            let service: any = this[`__${propertyKey}`];
            if (service === undefined) {
                service = this.injector.get(token, notFoundValue, flags);
                this[`__${propertyKey}`] = service;
            }
            return service;
        };
        Object.defineProperty(target, propertyKey, {
            get: getter,
            enumerable: true
        });
    };
}
