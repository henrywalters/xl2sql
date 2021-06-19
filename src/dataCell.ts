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

export default class DataCell {
    public readonly type: DataType;
    public readonly rawValue: string;

    constructor(rawValue: string) {
        this.rawValue = rawValue;
        this.type = DataType.varchar;
        if (HCore.Type.isBoolean(this.rawValue)) {
            this.type = DataType.boolean;
        } else if (HCore.Type.isFloat(this.rawValue)) {
            this.type = DataType.float;
        } else if (HCore.Type.isInt(this.rawValue)) {
            this.type = DataType.int;
        } else if (HCore.Type.isSqlDatetime(this.rawValue)) {
            this.type = DataType.datetime;
        } else if (HCore.Type.isSqlDate(this.rawValue)) {
            this.type = DataType.date;
        } else if (HCore.Type.isSqlTime(this.rawValue)) {
            this.type = DataType.time;
        }
    }
}