import DataCell from "../dataCell";
import DataTable from "../dataTable";
import ITableParser from "../iTableParser";

export default class JSONParser implements ITableParser {

    fileTypes: string[] = [
        'json',
        'application/json',
    ];

    async parse(content: string): Promise<DataTable> {
        let parsed = JSON.parse(content);
        let header: string[] = [];
        let data: DataCell[][] = [];
        let hasHeader = false;

        if (!Array.isArray(parsed)) {
            throw new Error("Content must be an array of objects");
        }

        for (let row of parsed) {
            if (typeof(row) != 'object') {
                throw new Error("Each array element must be an object");
            }

            if (!hasHeader) {
                hasHeader = true;
                header = Object.keys(row);
            }

            data.push(header.map(col => {
                if (!(col in row)) {
                    throw new Error("Column missing from object");
                }

                return new DataCell(row[col].toString());
            }));
        }

        return new DataTable(header, data);
    }

    // Parse a single JSON object string
    async parseLine(line: string): Promise<string[]> {
        let parsed = JSON.parse(line);
        let out: string[] = [];

        if (typeof(parsed) != 'object') {
            throw new Error("Line must be an object");
        }

        for (let key of parsed) {
            out.push(parsed[key]);
        }
        return out;
    }

}