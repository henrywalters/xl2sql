import DataTable from "./dataTable";
import ITableParser from "./iTableParser";
import CSVParser from "./parsers/csvParser";

const parsers = [
    new CSVParser(),
]

export default class TableParser {

    private static getParser(extension): ITableParser {
        for (const parser of parsers) {
            if (parser.fileTypes.indexOf(extension) !== -1) {
                return parser;
            }
        }

        throw new Error("Parser does not exist for this file type");
    }

    public static async parseFile(file: File): Promise<DataTable> {
        const parser = this.getParser(file.type);
        return parser.parse(await file.text());
    }

    public static parseText(ext: string, content: string): Promise<DataTable> {
        const parser = this.getParser(ext);
        return parser.parse(content);   
    }
}