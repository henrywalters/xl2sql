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
            const cells = line.replace('\r', '').replace('\\', '').split(',').map((cell) => {
                if (cell[0] === '"' && cell[cell.length - 1] === '"') {
                    return cell.substr(1, cell.length - 2);
                } else {
                    return cell;
                }
            });
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