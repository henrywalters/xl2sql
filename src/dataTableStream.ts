import DataCell from "./dataCell";
import { ColumnMetaData } from "./dataTable";

// DataTableStream provides an interface for streaming a file and generating SQL inserts and collecting a type map.
export default class DataTableStream {
    public hasHeader: boolean;
    public readonly colIndexes: number[];
    public readonly header: string[];
    public readonly columnMetaData: ColumnMetaData[];

    constructor(header: string[] = []) {
        this.columnMetaData = [];
        this.header = [];
        this.colIndexes = [];        this.hasHeader = false;
        for (let i = 0; i < header.length; i++) {
            const cell = header[i];
            if (cell.trim() === '') {
                continue;
            }
            this.colIndexes.push(i);
            this.header.push(cell);
            this.hasHeader = true;
            this.columnMetaData.push({
                name: cell,
                datatypes: [],
                isNullable: false,
                isUnique: true,
                isPrimary: false,
                isForeign: false,
                maxLength: 0,
            });
        }
    }

    public setPrimaryKey(col: number | string) {
        for (const cell of this.columnMetaData) {
            if (cell.isPrimary) {
                cell.isPrimary = false;
            }
        }
        this.columnMetaData[this.getColumnIndex(col)].isPrimary = true;
    }

    public getColumnIndex(col: number | string): number {
        return typeof col === 'string' ? this.header.indexOf(col) : col;
    }

    public accumulateMetaData(line: DataCell[]) {

        if (!this.hasHeader) {
            for (let i = 0; i < line.length; i++) {
                if (line[i].rawValue.trim() === '') {
                    console.log("Skipping empty col");
                    continue;
                }
                this.columnMetaData.push({
                    name: line[i].rawValue,
                    datatypes: [],
                    isNullable: false,
                    isUnique: true,
                    isPrimary: false,
                    isForeign: false,
                    maxLength: 0,
                });
                this.colIndexes.push(i);
                this.header.push(line[i].rawValue)
            }
            this.hasHeader = true;
        } else {
            for (let i = 0; i < this.header.length; i++) {

                const cell = line[this.colIndexes[i]];

                let hasType = false;

                if (cell.isNull) {
                    this.columnMetaData[i].isNullable = true;
                }

                if (cell.rawValue.length > this.columnMetaData[i].maxLength) {
                    this.columnMetaData[i].maxLength = cell.rawValue.length;
                }

                for (const type of this.columnMetaData[i].datatypes) {
                    if (type === cell.type) {
                        hasType = true;
                        break;
                    }
                }
                if (!hasType) {
                    this.columnMetaData[i].datatypes.push(cell.type);
                }
            }
        }
    }
}