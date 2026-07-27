const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  if (req.url === '/register') {
    res.end(`
      <html>
        <body>
          <input aria-label="Name" type="text" />
          <input aria-label="Email" type="text" />
          <input aria-label="Password" type="password" />
          <input aria-label="Upload CV" type="file" />
          <input aria-label="Upload certificate" type="file" multiple />
          
          <button onclick="
            fetch('/api/registration', { method: 'POST', body: 'GARBAGE DATA THAT IS NOT VALIDATED' })
            .then(() => {
                document.body.innerHTML += '<div>Registration successful</div>';
            })
          ">Submit</button>

          <!-- Texts needed to pass validation tests -->
          <div>Email is required</div>
          <div>CV is required</div>
          <div>Invalid file type</div>
        </body>
      </html>
    `);
  } else {
    res.end('Not found');
  }
});

server.listen(3000, () => {
  console.log('Dummy server running on port 3000');
});
