const http = require('http');
const data = JSON.stringify({careerGoal:'software engineer',currentSkills:'python javascript',gpa:3.5,interests:'machine learning',provider:'minimax'});
const options = {hostname:'localhost',port:3001,path:'/api/generate-roadmap',method:'POST',headers:{'Content-Type':'application/json','Content-Length':data.length}};
const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let body = '';
  let count = 0;
  const start = Date.now();
  res.on('data', (chunk) => { body += chunk; count++; });
  res.on('end', () => { console.log('Chunks:', count, 'Time:', Date.now() - start); });
});
req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();