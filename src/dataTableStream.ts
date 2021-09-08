import { FileStream } from "hcore/dist/fileStream";
import DataCell from "./dataCell";
import { ColumnMetaData } from "./dataTable";

// DataTableStream provides an interface for streaming a file and generating SQL inserts and collecting a type map.
export default class DataTableStream {
    public hasHeader: boolean;
    public readonly header: string[];
    public readonly columnMetaData: ColumnMetaData[];

    constructor(header: string[] = []) {
        this.header = header;
        this.columnMetaData = [];
        this.hasHeader = false;
        for (const cell of this.header) {
            this.hasHeader = true;
            this.columnMetaData.push({
                name: cell,
                datatypes: [],
                isNullable: false,
                isUnique: true,
            });
        }
    }

    public getColumnIndex(col: number | string): number {
        return typeof col === 'string' ? this.header.indexOf(col) : col;
    }

    public accumulateMetaData(line: DataCell[]) {
        if (!this.hasHeader) {
            for (let i = 0; i < line.length; i++) {
                this.columnMetaData.push({
                    name: line[i].rawValue,
                    datatypes: [],
                    isNullable: false,
                    isUnique: true,
                });
                this.header.push(line[i].rawValue)
            }
            this.hasHeader = true;
        } else {
            for (let i = 0; i < line.length; i++) {
                let hasType = false;

                if (line[i].isNull) {
                    this.columnMetaData[i].isNullable = true;
                }

                for (const type of this.columnMetaData[i].datatypes) {
                    if (type === line[i].type) {
                        hasType = true;
                        break;
                    }
                }
                if (!hasType) {
                    this.columnMetaData[i].datatypes.push(line[i].type);
                }
            }
        }
    }
}