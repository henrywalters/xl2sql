import { DataType, DataTypeHierarchy } from "./dataCell";

export default class SqlUtils {
    public static toSnakeCase(raw: string): string {

        raw = raw.replace(' ', '_').replace(' ', '_');

        // remove any extensions.
        const parts1 = raw.split('.');
        if (parts1.length > 1) {
            raw = parts1[0];
        }
        let out = "";

        for (let i = 0; i < raw.length; i++) {
            if (raw[i] === raw[i].toUpperCase() && i > 0 && raw[i] != '_' && raw[i - 1] !== raw[i - 1].toUpperCase()) {
                out += "_";
            }
            out += raw[i].toLowerCase();
        }

        return out;
    }

    public static getCommonType(types: DataType[]): DataType {
        if (types.length === 0) {
            throw new Error("No types given");
        }

        let type: DataType = types[0];

        for (let i = 1; i < types.length; i++) {
            if (DataTypeHierarchy[types[i]].indexOf(type) !== -1) {
                type = types[i];
            }
        }

        return type;
    }
}