import DataTable from "./dataTable";
import CSVParser from "./parsers/csvParser";

const parsers = [
    new CSVParser(),
]

export default class TableParser {
    public static async parse(file: File): Promise<DataTable> {
        for (const parser of parsers) {
            console.log(parser);
            if (parser.fileTypes.indexOf(file.type) !== -1) {
                return parser.parse(file);
            }
        }

        throw new Error("No parser exists for this file type");
    }
}