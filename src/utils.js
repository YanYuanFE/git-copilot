const inquirer = require('inquirer');

/**
 * Confirm commit
 * @returns {Promise<boolean>} Whether to confirm the commit
 */
async function confirmCommit() {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Do you want to commit these changes?',
      default: true
    }
  ]);
  
  return answer.confirm;
}

module.exports = {
  confirmCommit
};