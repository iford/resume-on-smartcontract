// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      gas: 3000000,
      network_id: '15' // Match any network id
    }
  }
}
