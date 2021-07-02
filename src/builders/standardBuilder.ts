import DataTable, { DataTableRow } from "../dataTable";
import { ISqlBuilder } from "../iSqlBuilder";
import SqlUtils from "../sqlUtils";

export default class StandardBuilder implements ISqlBuilder {
    createTable(tableName: string, datatable: DataTable): string {
        let columns = [];

        for (let i = 0; i < datatable.header.length; i++) {
            const info = datatable.getColumnInfo(i);
            if (datatable.header[i].trim() !== '') {
                columns.push(`${SqlUtils.toSnakeCase(datatable.header[i])} ${SqlUtils.getCommonType(info.datatypes)} ${info.isNullable ? '' : ' not null'}`)
            }
            
        }

        return `create table ${tableName} (${columns.join(', ')})`;
    }

    createInsert(tableName: string, row: DataTableRow): string {
        let cols = [];
        let vals = [];

        for (let col in row) {
            cols.push(col);
            vals.push(`'${row[col].rawValue.replace("'", "''")}'`);
        }
        return `insert into ${tableName} (${cols.join(', ')}) values (${vals.join(', ')})`;
    }

}