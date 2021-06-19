import DataCell from "./dataCell";

export default class DataTable {
    public readonly header: string[];
    public readonly data: DataCell[][];

    constructor(header: string[], data: DataCell[][]) {
        this.header = header;
        this.data = data;
    }
}