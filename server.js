const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    switch (req.method) {
        case 'GET':
            if (req.url === '/') {
                serveFile(res, 'public/index.html', 'text/html');
            } else if (req.url.endsWith('.css')) {
                serveFile(res, path.join('public', req.url), 'text/css');
            } else if (req.url.endsWith('.js')) {
                serveFile(res, path.join('public', req.url), 'application/javascript');
            } else if (req.url === '/students.json') {
                serveFile(res, path.join('public', req.url), 'application/json');
            } else {
                // You can serve a 404 error here or handle other file types
                handleError(res, 404);
            }
            break;

        case 'POST':
            if (req.url === '/add-student') {
                console.log("Received POST request to /add-student");

                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    console.log("Finished receiving request body");

                    const receivedStudent = JSON.parse(body);
                    console.log("Parsed received student:", receivedStudent);

                    const newStudent = {
                        id: 0, // placeholder; we'll replace this shortly
                        firstName: receivedStudent.firstName,
                        lastName: receivedStudent.lastName,
                        dateOfBirth: receivedStudent.dob,
                        currentGrade: receivedStudent.grade
                    };

                    fs.readFile('public/students.json', 'utf-8', (err, data) => {
                        if (err) {
                            console.error("Error reading students.json:", err);
                            handleError(res, 500);
                            return;
                        }
                        const students = JSON.parse(data);
                        newStudent.id = students.length + 1;
                        students.push(newStudent);
                        console.log("Added student to the list", newStudent);

                        const updatedData = JSON.stringify(students);

                        fs.writeFile('public/students.json', updatedData, (err) => {
                            if (err) {
                                console.error('Error writing to students.json:', err);
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ success: false }));
                                return;
                            }

                            console.log("Successfully added student to students.json");
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: true }));
                        });
                    });
                });
            }
            break;

        default:
            handleError(res, 405);  // Method not allowed
            break;
    }
});

function serveFile(res, filepath, contentType) {
    console.log(`Serving file: ${filepath} with Content-Type: ${contentType}`);
    fs.readFile(filepath, (err, content) => {
        if (err) {
            handleError(res, 500);
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
}


function handleError(res, code) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false }));

}

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
