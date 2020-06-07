export interface ITableButton {
    [key: string]: any;
    key: string;
    name?: string;
    icon?: string;
    enable?(data: any): Promise<boolean>;
    onClick?(data: any, key?: string, param?: any): void;
    visible?(data: any): Promise<boolean>;
}
