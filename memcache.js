import memcached from 'memcached';

let client = new memcached("localhost:11211");
client.connect();

client.on('connect', () => {
  client.set("file", "myFile", 0, (err) => {
    if (err) {
      console.error('Error:', err);
    } else {
      client.get("file", (err, data) => {
        if (err) {
          console.error('Error:', err);
        } else {
          console.log("======", data);
        }
      });
    }
  });
});

