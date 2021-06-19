import DataCell from "../dataCell";
import DataTable from "../dataTable";
import ITableParser from "../iTableParser";

export default class CSVParser implements ITableParser {
    public readonly fileTypes = [
        'text/csv',
    ];

    public async parse(file: File): Promise<DataTable> {
        let header = [];
        let data = [];
        let setHeader = false;
        const content = await file.text();
        const lines = content.split('\n');
        
        for (const line of lines) {
            const cells = line.split(',');
            if (!setHeader) {
                header = cells;
                setHeader = true;
            } else {
                if (cells.length === header.length) {
                    data.push(cells.map(cell => new DataCell(cell)));
                }
            }
        }

        return new DataTable(header, data);
    }
}