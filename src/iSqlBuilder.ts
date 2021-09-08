import DataTable, { ColumnMetaData, DataTableRow } from "./dataTable";

export interface ISqlBuilder {
    createTable(tableName: string, columns: ColumnMetaData[]): string;
    createInsert(tableName: string, row: DataTableRow | string[]): string;
}