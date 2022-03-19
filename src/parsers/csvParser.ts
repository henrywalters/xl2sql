import DataCell from "../dataCell";
import DataTable from "../dataTable";
import ITableParser from "../iTableParser";

export default class CSVParser implements ITableParser {
    
    public readonly fileTypes = [
        'text/csv',
        'csv',
    ];

    public async parse(content: string): Promise<DataTable> {
        let header = [];
        let data = [];
        let setHeader = false;
        const lines = content.split('\n');
        for (const line of lines) {
            const cells = await this.parseLine(line);
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

    public async parseLine(line: string): Promise<string[]> {
        const regex = /(?!\B"[^"]*),(?![^"]*"\B)/g;
        return line.replace('\r', '').replace('\\', '').split(regex).map((cell) => {
            if (cell[0] === '"' && cell[cell.length - 1] === '"') {
                cell = cell.substr(1, cell.length - 2);
            }
            return cell;
        });
    }
}