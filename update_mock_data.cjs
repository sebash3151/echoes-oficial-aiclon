const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

content = content.replace(/id: 'm[0-9]+',/g, match => `workspaceId: 'w1',\n    ${match}`);
content = content.replace(/id: 'r[0-9]+',/g, match => `workspaceId: 'w1',\n    ${match}`);
content = content.replace(/id: '[0-9]+',/g, match => `workspaceId: 'w1',\n    ${match}`);

fs.writeFileSync('src/data/mockData.ts', content);
