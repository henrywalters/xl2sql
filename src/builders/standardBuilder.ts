import DataTable, { ColumnMetaData, DataTableRow } from "../dataTable";
import { ISqlBuilder } from "../iSqlBuilder";
import SqlUtils from "../sqlUtils";

export default class StandardBuilder implements ISqlBuilder {
    createTable(tableName: string, columns: ColumnMetaData[]): string {

        const sqlColumns = [];

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].name.trim() !== '') {
                sqlColumns.push(`"${SqlUtils.toSnakeCase(columns[i].name)}" ${SqlUtils.getCommonType(columns[i].datatypes)}${columns[i].isNullable ? '' : ' not null'}`)
            }
            
        }

        return `create table ${tableName} (${sqlColumns.join(', ')})`;
    }

    createInsert(tableName: string, row: DataTableRow): string {
        let cols = [];
        let vals = [];

        for (let col in row) {
            cols.push(`"${SqlUtils.toSnakeCase(col)}"`);
            vals.push(`'${row[col].rawValue.replace("'", "''")}'`);
        }
        return `insert into "${tableName}" (${cols.join(', ')}) values (${vals.join(', ')})`;
    }

}