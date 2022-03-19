import DataTable, { ColumnMetaData, DataTableRow } from "./dataTable";

export interface ISqlBuilder {
    createTable(tableName: string, columns: ColumnMetaData[], databaseName?: string): string;
    createInsert(tableName: string, row: DataTableRow | string[], databaseName?: string): string;
}