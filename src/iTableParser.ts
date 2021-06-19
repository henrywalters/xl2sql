import DataTable from "./dataTable";

export default interface ITableParser {
    fileTypes: string[];
    parse(file: File): Promise<DataTable>;
}