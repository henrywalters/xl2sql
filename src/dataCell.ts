import HCore from 'hcore';

export enum DataType {
    varchar = 'varchar',
    int = 'int',
    float = 'float',
    boolean = 'boolean',
    date = 'date',
    time = 'time',
    datetime = 'datetime',
}

export const DataTypeHierarchy = {
    'varchar': ['int', 'float', 'boolean', 'date', 'datetime', 'time'],
    'int': ['boolean'],
    'float': ['int'],
    'boolean': ['int'],
    'date': [],
    'time': [],
    'datetime': ['date', 'time']
}

export default class DataCell {
    public readonly type: DataType;
    public readonly rawValue: string;

    constructor(rawValue: string) {
        this.rawValue = rawValue;
        this.type = DataType.varchar;

        if (HCore.Type.isSqlDatetime(this.rawValue)) {
            this.type = DataType.datetime;
        } else if (HCore.Type.isSqlDate(this.rawValue)) {
            this.type = DataType.date;
        } else if (HCore.Type.isSqlTime(this.rawValue)) {
            this.type = DataType.time;
        } else if (HCore.Type.isDatetime(this.rawValue)) {
            this.type = DataType.datetime;
        } else if (HCore.Type.isDate(this.rawValue)) {
            this.type = DataType.date;
        }else if (HCore.Type.isTime(this.rawValue)) {
            this.type = DataType.time;
        }else if (HCore.Type.isInt(this.rawValue)) {
            this.type = DataType.int;
        } else if (HCore.Type.isFloat(this.rawValue)) {
            this.type = DataType.float;
        } else if (HCore.Type.isBoolean(this.rawValue)) {
            this.type = DataType.boolean;
        } 
    }
}