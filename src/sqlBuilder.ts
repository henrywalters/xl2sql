import StandardBuilder from "./builders/standardBuilder";
import DataTable, { ColumnMetaData, DataTableRow } from "./dataTable";
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

    createTable(tableName: string, columns: ColumnMetaData[], databaseName?: string): string {
        return this.engine.createTable(tableName, columns, databaseName);
    }

    createInsert(tableName: string, row: DataTableRow, databaseName?: string): string {
        return this.engine.createInsert(tableName, row, databaseName);
    }

    createInserts(tableName: string, datatable: DataTable, databaseName?: string): string {
        let inserts = [];

        for (let i = 0; i < datatable.data.length; i++) {
            inserts.push(this.createInsert(tableName, datatable.datatable[i], databaseName));
        }

        return inserts.join(';\n') + ';\n';
    }

    createFullQuery(tableName: string, datatable: DataTable): string {
        const createTable = this.createTable(tableName, datatable.header.map((header, idx) => datatable.getColumnInfo(idx)));
        let inserts = [];

        for (let i = 0; i < datatable.data.length; i++) {
            inserts.push(this.createInsert(tableName, datatable.datatable[i]));
        }

        return `${createTable};\n ${inserts.join(';\n')}`;
    }
}