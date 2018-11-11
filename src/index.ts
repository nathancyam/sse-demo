import * as http from 'http';
import fs from 'fs';
import path from 'path';

function sendEvent(res: http.ServerResponse, event: string, data: any) {
    res.write(`event: ${event}\n`);
    res.write('retry: 10000\n');
    res.write(`id: ${Date.now()}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
}

const server = http.createServer((req, res) => {
    switch (req.url) {
        case '/': {
            res.writeHead(200, {
                'Content-Type': 'application/json',
            });

            return res.end(JSON.stringify({
                message: 'hello world'
            }));
        }

        case '/index.html': {
            return fs.readFile(path.resolve(__dirname, 'index.html'), (err, body) => {
                const html = body.toString();
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Content-Length': html.length,
                });

                res.end(html);
            });
        }

        case '/sse': {
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            });

            let counter = 0;

            sendEvent(res, 'ping', { counter });

            setInterval(() => {
                console.log('Sending server sent event');
                sendEvent(res, 'ping', { counter });
                counter++;
            }, 4000);
        }
    }
});

server.listen(4000, () => {
    console.log('Listening on port 4000');
});