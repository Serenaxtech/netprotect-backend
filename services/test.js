const bcrypt = require('bcrypt');

const inputPassword = 'hassan1230'; // Replace with real plain password


const passHash = async () =>  { return await bcrypt.hash(inputPassword, 10); }
console.log(passHash);
const storedHash = '$2b$10$gQp0N9PRabq8Q2SeC9wrJOlzEVFFUlO.9Kda1tz3n.1e0ZNcM872.';

bcrypt.compare(inputPassword.trim(), storedHash, (err, res) => {
  if (err) return console.error('Error comparing passwords:', err);
  console.log('Password matches?', res); // Should be true if correct
});
