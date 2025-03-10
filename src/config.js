const Conf = require('conf');

// Create configuration instance
const config = new Conf({
  projectName: 'git-copilot',
  schema: {
    api_key: {
      type: 'string',
      default: ''
    }
  }
});

/**
 * Get configuration item
 * @param {string} key Configuration key name
 * @returns {any} Configuration value
 */
function getConfig(key) {
  return config.get(key);
}

/**
 * Set configuration item
 * @param {string} key Configuration key name
 * @param {any} value Configuration value
 */
function setConfig(key, value) {
  config.set(key, value);
}

module.exports = {
  getConfig,
  setConfig
};