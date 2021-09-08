import DataCell, { DataType } from "./dataCell";

export type DataTableRow = {[header: string]: DataCell};

export interface ColumnMetaData {
    name: string;
    datatypes: DataType[];
    isNullable: boolean;
    isUnique: boolean;
}

export default class DataTable {
    public readonly header: string[];
    public readonly data: DataCell[][];
    public readonly datatable: DataTableRow[];

    constructor(header: string[], data: DataCell[][]) {
        this.header = header;
        this.data = data;
        this.datatable = this.data.map((row) => {
            const rowMap = {};
            for (let i = 0; i < this.header.length; i++) {
                rowMap[this.header[i]] = row[i];
            }
            return rowMap;
        });
    }

    public getHtml(): HTMLTableElement {
        const el = document.createElement('table');
        el.className = 'table table-striped';
        const headerRow = el.appendChild(document.createElement('thead')).appendChild(document.createElement('tr'));
        for (const header of this.header) {
            const cell = document.createElement('th');
            cell.innerHTML = header;
            headerRow.appendChild(cell);
        }

        const body = el.appendChild(document.createElement('tbody'));

        for (let i = 0; i < this.data.length; i++) {
            const row = body.appendChild(document.createElement('tr'));
            for (let j = 0; j < this.header.length; j++) {
                const cell = document.createElement('td');
                cell.innerHTML = this.data[i][j].rawValue;
                row.appendChild(cell);
            }
        }

        return el;
    }

    public getColumnIndex(col: number | string): number {
        return typeof col === 'string' ? this.header.indexOf(col) : col;
    }

    public getColumnInfo(col: number | string): ColumnMetaData {
        const index = this.getColumnIndex(col);
        const info: ColumnMetaData = {
            datatypes: [],
            isNullable: false,
            isUnique: true,
            name: this.header[index],
        }
        
        for (let i = 0; i < this.data.length; i++) {
            let hasType = false;

            if (this.data[i][col].isNull) {
                info.isNullable = true;
            }

            for (const type of info.datatypes) {
                if (type === this.data[i][col].type) {
                    hasType = true;
                    break;
                }
            }
            if (!hasType) {
                info.datatypes.push(this.data[i][col].type);
            }
        }

        return info;
    }
}