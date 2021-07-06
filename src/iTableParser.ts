import DataTable from "./dataTable";

export default interface ITableParser {
    fileTypes: string[];
    parse(content: string): Promise<DataTable>;
}