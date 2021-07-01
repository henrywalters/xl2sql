import DataTable, { DataTableRow } from "./dataTable";

export interface ISqlBuilder {
    createTable(tableName: string, datatable: DataTable): string;
    createInsert(tableName: string, row: DataTableRow): string;
}