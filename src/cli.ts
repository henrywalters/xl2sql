import { Command, OptionValues } from "commander";
import * as fs from 'fs';
import * as path from 'path';
const { resolve, relative } = require('path');
import HCore from "hcore";
import xl2sql from ".";
import { FileDescription } from "hcore/dist/fileSystem";
import * as cliProgress from 'cli-progress';
import DataTableStream from "./dataTableStream";
import DataCell from "./dataCell";
import * as Inquirer from 'inquirer';

const program = new Command();
const builder = new xl2sql.SqlBuilder();
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const files = new HCore.List<FileDescription>();

program
    .option('-f, --file <file>', 'File path to parse')
    .option('-d, --directory <dir>', 'Directory to parse', __dirname)
    .option('-r, --recursive', "If no file is present, recurse all files in directory", false)
    .option('-o, --output <file>', "Output queries to this file")
    .option('-n, --dry-run', 'Grab the files to run without processing them.', false)
    .option(
        '-s, --stream', 
        `Stream the files instead of reading them into memory. Useful for large files or low memory environments`, 
        false
    )

let output: string | null = null;
let processed = 0;

function updateProcess(delta: number) {
    //if (output !== null) {
        processed += delta;
        progressBar.update(processed);
    //}
}

function startProcess(total: number) {
    //if (output !== null) {
        progressBar.start(total, 0);
    //}
}

function outputLine(line: string) {
    if (output !== null) {
        fs.appendFileSync(output, line + ";\n");
    } else {
        process.stdout.write(line + ";\n");
    }
}

async function choosePrimaryKey(tableName: string, headers: string[]): Promise<string> {
    return new Promise((res, rej) => {

        const possibleIdIndex = headers.findIndex((header) => {return header.indexOf('id') !== -1});
        let defaultPK = void 0;

        if (possibleIdIndex !== -1) {
            defaultPK = headers[possibleIdIndex];
        }

        Inquirer.prompt([
            {
                type: 'list',
                name: 'primaryKey',
                message: `Choose the primary key for ${tableName}`,
                choices: headers,
                default: defaultPK
            }
        ]).then((answers) => {
            console.log(answers);
            res("");
        }).catch((error) => {
            if (error.isTtyError) {
                console.log("TTY error");
            } else {
                console.log(error);
            }
            rej(error);
        })
    })
}

async function processStandard() {

    startProcess(files.sum());

    for (const file of files) {

        updateProcess(file.size);

        try {
            const data = fs.readFileSync(file.path).toString();
            const table = await xl2sql.TableParser.parseText(file.extension, data);
            //const queries = builder.createFullQuery(file.name, table);
    
            const fileOutput = `# Creating table ${file.name}\n
    ${builder.createTable(file.name, table.header.map((h, idx) => table.getColumnInfo(idx)))}\n
    # Inserting data into ${file.name}\n
    ${builder.createInserts(file.name, table)}\n\n\n`
    
            outputLine(fileOutput);
        } catch (e) {
            console.log(e);
        }
        
    }
}

async function processStream() {

    startProcess(files.sum() * 2);

    for (const file of files.data) {
    
        if (file.extension !== 'csv') continue;

        console.log(file.name);

        try {

            let stream = new HCore.FileStream(file.path);
            const datatable = new DataTableStream();

            await stream.readLines(async (line, completed) => {
                try {
                    updateProcess(Buffer.byteLength(line));
                    const parsedLine = await xl2sql.TableParser.parseLine(file.extension, line);
                    const cells = parsedLine.map((raw) => new DataCell(raw));
                    datatable.accumulateMetaData(cells);
                } catch (e) {
                    console.log(datatable.columnMetaData.length, line.length);
                    console.warn("Failed to accumate meta data", line, file, e);
                }
                
            })

            outputLine(builder.createTable(file.name, datatable.columnMetaData));

            stream = new HCore.FileStream(file.path);

            let isHeader = true;

            await stream.readLines(async (line, completed) => {
                if (isHeader) {
                    isHeader = false;
                    return;
                }
                updateProcess(Buffer.byteLength(line));
                const sqlColumns = {};
                const cells = await xl2sql.TableParser.parseLine(file.extension, line);
                for (let i = 0; i < cells.length; i++) {
                    if (datatable.colIndexes.indexOf(i) === -1) {
                        continue;
                    }
                    const cell = new DataCell(cells[i]);
                    sqlColumns[datatable.header[i]] = cell;
                }
                outputLine(builder.createInsert(file.name, sqlColumns));
            })
        } catch (e) {
            console.warn("Failed to parse file: ", file, e);
        }
    }
}

export async function cli(args) {
    program.parse(args);
    const options = program.opts();

    if (options.file) {
        const fileInfo = HCore.FileSystem.ParsePath(options.file);
        fileInfo.name = xl2sql.SqlUtils.toSnakeCase(fileInfo.name);
        files.push(new FileDescription(fileInfo, "", fs.statSync(fileInfo.path).size));
    } else {
        for (const fileInfo of (await HCore.FileSystem.ListFiles(options.directory, options.recursive))) {
            const fileBase = fileInfo.path.replace(resolve(fileInfo.path, options.directory) + '/', '');
            const fileBaseParts = fileBase.split('/');
            const tableBase = fileBaseParts.slice(0, fileBaseParts.length - 1).join("_");
            const tableName = tableBase + "_" + xl2sql.SqlUtils.toSnakeCase(fileInfo.name);
            fileInfo.name = tableName;
            const base = resolve(fileInfo.path, options.directory);
            files.push(new FileDescription(fileInfo, "", fs.statSync(fileInfo.path).size));
        }
    }

    files.sort();
    
    if (options.output) {
        output = options.output as string;
    }

    if (!options.dryRun) {
        if (output !== null) {
            fs.writeFileSync(output, "");
        }

        if (options.stream) {
            await processStream();
        } else {
            processStandard();
        }
        
    } else {
        process.stdout.write(files.data.map(f => f.path).join("\n"));
    }

    

    process.exit(0);
}