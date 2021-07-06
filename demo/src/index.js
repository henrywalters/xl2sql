import xl2sql from 'xl2sql';
import TableParser from '../../dist/tableParser';

const file = xl2sql.FileInput.generate(document.getElementById('content'));

file.onUpload(async (file) => {
    console.log(file);

    document.getElementById('file-info').innerHTML = `
        <p><b>Name: </b> ${file.name}</p>
        <p><b>Size: </b> ${file.size}</p>
        <p><b>Type: </b> ${file.type}</p>

        <div class='row'>
            <div class='col-6' >
                <div class='table-responsive'>
                    <h5>Data View</h5>
                    <div id='table'>

                    </div>
                </div>
            </div>
            <div class='col-6' >
                <h5>SQL View (copy this)</h5>
                <textarea id='sql' class='form-control' rows='100'>

                </textarea>
            </div>
        </div>
    `;


    const dt = (await TableParser.parseFile(file));

    console.log(dt.getHtml());

    document.getElementById('table').appendChild(dt.getHtml());

    const builder = new xl2sql.SqlBuilder();

    document.getElementById('sql').innerHTML = builder.createFullQuery(xl2sql.SqlUtils.toSnakeCase(file.name), dt);

})