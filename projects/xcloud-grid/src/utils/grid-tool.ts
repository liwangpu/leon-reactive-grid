import { filter, map } from 'rxjs/operators';

export function topicFilter(topic: string): any {
    return filter((x: { topic: string; data: any }) => x.topic === topic);
}

export function topicFilters(...topics: Array<string>): any {
    return filter((x: { topic: string; data: any }) => topics.indexOf(x.topic) > -1);
}

export function tupleMap(t: [any]): any {
    return map(v => {
        t[0] = v;
        return t;
    });
}

export const dataMap: any = map((ms: { topic: string; data?: any }) => ms.data);

export const topicMap: any = map((ms: { topic: string; data?: any }) => ms.topic);
