const Datastore = require('nedb-promises');
const path = require('path');

// Data files — saved locally in server/data/
const Listing = Datastore.create({
  filename: path.join(__dirname, '../data/listings.db'),
  autoload: true
});

// Auto-increment helper (nedb uses random _id by default, we keep it as-is)
const initDatabase = async () => {
  console.log('Local database ready (nedb) ✓');
};

module.exports = { Listing, initDatabase };
