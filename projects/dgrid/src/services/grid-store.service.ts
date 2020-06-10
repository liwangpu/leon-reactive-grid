import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GridStoreService {

    public readonly gridId: string;
    public constructor() {
        this.gridId = `${Date.now()}@${uuidv4()}`;
    }

    
}
