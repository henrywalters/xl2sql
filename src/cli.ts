import { Command } from "commander";
import * as fs from 'fs';
import * as path  from 'path';
import { Stream } from "stream";
import { WriteStream } from "tty";
import HCore from "hcore";
import xl2sql from ".";
import { FileDescription } from "hcore/dist/fileSystem";
import * as cliProgress from 'cli-progress';

const program = new Command();

program
    .option('-f, --file <file>', 'File path to parse')
    .option('-d, --directory <dir>', 'Directory to parse', __dirname)
    .option('-r, --recursive', "If no file is present, recurse all files in directory", false)
    .option('-o, --output <file>', "Output queries to this file")
    .option('-n, --dry-run', 'Grab the files to run without processing them.', false)

interface FilePath {
    name: string;
    extension: string;
    path: string;
}

export async function cli(args) {
    program.parse(args);
    const options = program.opts();

    const files = new HCore.List<FileDescription>();
    let output: string | null = null;

    const builder = new xl2sql.SqlBuilder();

    if (options.file) {

        const fileInfo = HCore.FileSystem.ParsePath(options.file);
        fileInfo.name = xl2sql.SqlUtils.toSnakeCase(fileInfo.name);
        files.push(new FileDescription(fileInfo, "", fs.statSync(fileInfo.path).size));

    } else {
        for (const fileInfo of (await HCore.FileSystem.ListFiles(options.directory, options.recursive))) {
            fileInfo.name = xl2sql.SqlUtils.toSnakeCase(fileInfo.name);
            files.push(new FileDescription(fileInfo, "", fs.statSync(fileInfo.path).size));
        }
    }

    if (options.output) {
        output = options.output;
    }

    files.sort();

    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(files.sum(), 0);

    if (!options.dryRun) {
        let processed = 0;

        fs.writeFileSync(output, "");

        for (const file of files) {

            processed += file.size;

            try {
                const data = fs.readFileSync(file.path).toString();
                const table = await xl2sql.TableParser.parseText(file.extension, data);
                //const queries = builder.createFullQuery(file.name, table);
        
                const fileOutput = `# Creating table ${file.name}
        ${builder.createTable(file.name, table)}
        # Inserting data into ${file.name}
        ${builder.createInserts(file.name, table)}`
        
                if (output !== null) {
                    progressBar.update(processed);
                    fs.appendFileSync(output, fileOutput);
                } else {
                    process.stdout.write(fileOutput);
                }
            } catch (e) {

            }
            
        }
    } else {
        process.stdout.write(files.data.map(f => f.path).join("\n"));
    }

    

    process.exit(0);
}