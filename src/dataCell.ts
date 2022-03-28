import Type from "hcore/dist/type";

export enum DataType {
    varchar = 'varchar',
    int = 'int',
    float = 'float',
    boolean = 'boolean',
    date = 'date',
    time = 'time',
    datetime = 'timestamp',
}

export const DataTypeHierarchy = {
    'varchar': ['int', 'float', 'boolean', 'date', 'datetime', 'time'],
    'int': ['boolean'],
    'float': ['int'],
    'boolean': ['int'],
    'date': [],
    'time': [],
    'timestamp': ['date', 'time'],
}

export default class DataCell {
    public readonly type: DataType;
    public readonly rawValue: string;
    public readonly isNull: boolean;

    constructor(rawValue: string) {
        this.rawValue = rawValue;
        this.type = DataType.varchar;

        if (this.rawValue.trim() === '') {
            this.isNull = true;
            return;
        }

        if (Type.isSqlDatetime(this.rawValue)) {
            this.type = DataType.datetime;
        } else if (Type.isSqlDate(this.rawValue)) {
            this.type = DataType.date;
        } else if (Type.isSqlTime(this.rawValue)) {
            this.type = DataType.time;
        } else if (Type.isDatetime(this.rawValue)) {
            this.type = DataType.datetime;
        } else if (Type.isDate(this.rawValue)) {
            this.type = DataType.date;
        }else if (Type.isTime(this.rawValue)) {
            this.type = DataType.time;
        }else if (Type.isInt(this.rawValue)) {
            this.type = DataType.int;
        } else if (Type.isFloat(this.rawValue)) {
            this.type = DataType.float;
        } else if (Type.isBoolean(this.rawValue)) {
            this.type = DataType.boolean;
        } 
    }

    public get sqlDatetime(): string {
        if (this.type !== DataType.datetime) {
            throw new Error("Must be SQL Datetime");
        }

        const date = new Date(this.rawValue);

        return date.toISOString().slice(0, 19).replace('T', ' ');
    }
}