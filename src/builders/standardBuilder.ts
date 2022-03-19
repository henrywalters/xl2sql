import { DataType } from "../dataCell";
import DataTable, { ColumnMetaData, DataTableRow } from "../dataTable";
import { ISqlBuilder } from "../iSqlBuilder";
import SqlUtils from "../sqlUtils";

export default class StandardBuilder implements ISqlBuilder {
    createTable(tableName: string, columns: ColumnMetaData[], databaseName?: string): string {

        const sqlColumns = [];

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].name.trim() !== '') {
                const name = SqlUtils.toSnakeCase(columns[i].name);
                const type = SqlUtils.getCommonType(columns[i].datatypes);
                const size = type === DataType.varchar ? `(${columns[i].maxLength})` : '';
                const nullable = columns[i].isNullable ? '' : ' not null'
                sqlColumns.push(`\`${name}\` ${type}${size}${nullable}`);
            }
            
        }

        return `create table if not exists ${databaseName ? `\`${databaseName}\`.` : ''}\`${tableName}\` (${sqlColumns.join(', ')});`;
    }

    createInsert(tableName: string, row: DataTableRow, databaseName?: string): string {
        let cols = [];
        let vals = [];

        for (let col in row) {
            cols.push(`\`${SqlUtils.toSnakeCase(col)}\``);
            let value = row[col].rawValue;

            if (row[col].type === DataType.datetime) {
                value = row[col].sqlDatetime;
            }
            vals.push(`'${value.replace("'", "''")}'`);
        }
        return `insert into ${databaseName ? `\`${databaseName}\`.` : ''}\`${tableName}\` (${cols.join(', ')}) values (${vals.join(', ')})`;
    }

}