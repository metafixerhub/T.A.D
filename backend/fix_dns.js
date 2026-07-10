const https = require('https');
const fs = require('fs');

async function doHQuery(name, type) {
  return new Promise((resolve, reject) => {
    https.get(`https://dns.google/resolve?name=${name}&type=${type}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function fixMongoURI() {
  try {
    console.log('Fetching SRV records via DoH...');
    const srvRes = await doHQuery('_mongodb._tcp.cluster1.ekb4cia.mongodb.net', 'SRV');
    if (!srvRes.Answer || srvRes.Answer.length === 0) {
      throw new Error('No SRV records found');
    }

    // SRV data format: "priority weight port target."
    const hosts = srvRes.Answer.map(ans => {
      const parts = ans.data.split(' ');
      const port = parts[2];
      const target = parts[3].replace(/\.$/, '');
      return `${target}:${port}`;
    });

    console.log('Fetching TXT records via DoH...');
    const txtRes = await doHQuery('cluster1.ekb4cia.mongodb.net', 'TXT');
    let authSource = 'admin';
    let replicaSet = 'atlas-11sxxo-shard-0'; // Common default, but let's parse if we can, actually TXT holds authSource and replicaSet!
    
    let txtData = '';
    if (txtRes.Answer && txtRes.Answer.length > 0) {
      txtData = txtRes.Answer[0].data.replace(/"/g, '');
    }

    console.log('Hosts:', hosts);
    console.log('TXT Data:', txtData);

    const oldURI = 'mongodb+srv://metafixerhub_db_user:qerZYLxCqH7rO4A7@cluster1.ekb4cia.mongodb.net/lms_materials';
    
    // Construct standard connection string
    // mongodb://user:pass@host1,host2,host3/db?options
    const newURI = `mongodb://metafixerhub_db_user:qerZYLxCqH7rO4A7@${hosts.join(',')}/lms_materials?ssl=true&${txtData}`;
    
    console.log('New URI:', newURI);

    const envContent = `MONGO_URI=${newURI}\n`;
    fs.writeFileSync('.env', envContent);
    console.log('.env updated successfully!');
  } catch (err) {
    console.error('Failed to fix URI:', err);
  }
}

fixMongoURI();
