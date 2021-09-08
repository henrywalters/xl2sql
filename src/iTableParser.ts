import DataTable from "./dataTable";

export default interface ITableParser {
    fileTypes: string[];
    // Parse an entire file into a datatable
    parse(content: string): Promise<DataTable>;

    // Parse a line of a file into an array of strings
    parseLine(line: string): Promise<string[]>;
}