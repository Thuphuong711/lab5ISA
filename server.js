const http = require('http');
const url = require('url');
// const querystring = require('querystring');
const connection = require('./db_config');
const messages = require('./lang/en/en');


const server = http.createServer((req,res) => {
    const parseUrl = url.parse(req.url, true);

    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if(req.method === "POST" && parseUrl.pathname.startsWith("/insert")){
        //Check if Content-Type is set to application/json
        if(req.headers['content-type'] !== 'application/json'){
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({
                error: messages.errors.INVALID_CONTENT_TYPE
            }));
        }
        // Insert a new patient recorrd
        let body = "";
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () =>{
            const data = JSON.parse(body);
            const {name, dateOfBirth} = data;
            
            if(!name || !dateOfBirth){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({
                    error: messages.errors.MISSING_FIELDS
                }));
            }

            const insertQuery = 
            "INSERT INTO patient (name, dateOfBirth) VALUES (?,?)";
            console.log("Attempting to insert:", { name, dateOfBirth });

            connection.query(
                insertQuery,
                [name, dateOfBirth],
                (err, result) => {
                    if(err){
                        console.error("Insert Error:", err);
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        return res.end(JSON.stringify({
                            error: messages.errors.DB_ERROR
                        }));
                    }
                    
                    console.log("Insert Success:", result);

                    res.writeHead(201, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({
                        message: messages.success.PATIENT_ADDED,
                        patientId: result.insertId
                    }));
                }
            )
        })
        // GET SQL request
    } else if(req.method === "GET" && parseUrl.pathname.startsWith("/sql/")) {
       
        let sqlQuery = decodeURIComponent(parseUrl.pathname.replace("/sql/", ""));

        //Block DROP and DELETE queries
        if(/drop|delete/i.test(sqlQuery)){
            res.writeHead(403);
            return res.end(JSON.stringify({
                error: messages.errors.FORBIDDEN
            }));
        }

        //get query 
        connection.query(sqlQuery, (err, result)=>{
            if(err){
                res.writeHead(400);
                return res.end(JSON.stringify({
                    error: messages.errors.INVALID_QUERY
                }))
            };

            res.writeHead(200);
            res.end(JSON.stringify({data: result}));
        });
    } else {
        console.log(`Received ${req.method} request to ${req.url}`);

        res.writeHead(404);
        res.end(JSON.stringify({
            error: messages.errors.NOT_FOUND
        }));
    }
});

server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
})