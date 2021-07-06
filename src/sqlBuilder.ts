import StandardBuilder from "./builders/standardBuilder";
import DataTable, { DataTableRow } from "./dataTable";
import { ISqlBuilder } from "./iSqlBuilder";
import SqlUtils from "./sqlUtils";

const ENGINES: {[key: string]: ISqlBuilder} = {
    'standard': new StandardBuilder(),
}

export type SqlTypes = 'standard';

export default class SqlBuilder implements ISqlBuilder {
    
    private engine: ISqlBuilder;
    
    constructor(engine: SqlTypes = 'standard') {
        this.engine = ENGINES[engine];
    }

    public setEngine(engine: SqlTypes) {
        this.engine = ENGINES[engine];
    }

    createTable(tableName: string, datatable: DataTable): string {
        return this.engine.createTable(tableName, datatable);
    }

    createInsert(tableName: string, row: DataTableRow): string {
        return this.engine.createInsert(tableName, row);
    }

    createInserts(tableName: string, datatable: DataTable): string {
        let inserts = [];

        for (let i = 0; i < datatable.data.length; i++) {
            inserts.push(this.createInsert(tableName, datatable.datatable[i]));
        }

        return inserts.join(';\n');
    }

    createFullQuery(tableName: string, datatable: DataTable): string {
        const createTable = this.createTable(tableName, datatable);
        let inserts = [];

        for (let i = 0; i < datatable.data.length; i++) {
            inserts.push(this.createInsert(tableName, datatable.datatable[i]));
        }

        return `${createTable};\n ${inserts.join(';\n')}`;
    }
}