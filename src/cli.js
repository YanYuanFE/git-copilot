#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { version } = require('../package.json');
const { analyzeChanges, analyzeLastCommit } = require('./git');
const { generateCommitMessage } = require('./ai');
const { getConfig, setConfig } = require('./config');
const { confirmCommit } = require('./utils');

// Set version and description
program
  .version(version)
  .description('An AI-based Git commit assistant tool that automatically analyzes your code changes and generates standardized commit messages');

// Add options
program
  .option('-a, --add', 'Automatically add all changes to staging area')
  .option('-l, --last', 'Analyze the most recent commit instead of staged changes')
  .option('-c, --commit', 'Generate commit message and commit (requires confirmation by default)')
  .option('--auto', 'When used with --commit, commit automatically without confirmation')
  .option('--config <key> <value>', 'Set configuration item');

// Parse command line arguments
program.parse(process.argv);
const options = program.opts();

// Handle configuration command
if (options.config) {
  const args = program.args;
  if (args.length > 0) {
    setConfig(options.config, args[0]);
    console.log(chalk.green(`Configuration item ${options.config} has been set to ${args[0]}`));
    process.exit(0);
  } else {
    console.log(chalk.red('Please provide a configuration value'));
    process.exit(1);
  }
}

// Main function
async function main() {
  try {
    // Check API key configuration
    const apiKey = getConfig('api_key');
    if (!apiKey) {
      console.log(chalk.yellow('Please set the deepseek API key first:'));
      console.log(chalk.cyan('git-copilot --config api_key YOUR_API_KEY'));
      process.exit(1);
    }

    let changes;
    let commitMessage;

    if (options.last) {
      // Analyze the most recent commit
      changes = await analyzeLastCommit();
      console.log(chalk.blue('Analyzing changes from the most recent commit:'));
    } else {
      // Analyze current changes
      if (options.add) {
        console.log(chalk.blue('Adding all changes to staging area...'));
      }
      changes = await analyzeChanges(options.add);
      console.log(chalk.blue('Analyzing current changes:'));
    }

    // Display change statistics
    console.log(chalk.cyan(`Added: ${changes.added.length} files`));
    console.log(chalk.cyan(`Modified: ${changes.modified.length} files`));
    console.log(chalk.cyan(`Deleted: ${changes.deleted.length} files`));

    if (changes.added.length === 0 && changes.modified.length === 0 && changes.deleted.length === 0) {
      console.log(chalk.yellow('No changes detected'));
      process.exit(0);
    }

    // Generate commit message
    console.log(chalk.blue('Generating commit message...'));
    commitMessage = await generateCommitMessage(changes);
    console.log(chalk.green('Generated commit message:'));
    console.log(chalk.white(commitMessage));

    // 处理提交
    if (!options.last) {
      if (options.commit) {
        if (options.auto) {
          // 自动提交模式，无需确认
          await changes.git.commit(commitMessage);
          console.log(chalk.green('Changes automatically committed'));
        } else {
          // 确认后提交模式（默认）
          const confirmed = await confirmCommit();
          if (confirmed) {
            await changes.git.commit(commitMessage);
            console.log(chalk.green('Changes committed'));
          } else {
            console.log(chalk.yellow('Commit canceled'));
          }
        }
      }
      // 如果没有指定提交选项，只显示提交消息建议
    }
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

// Execute main function
main();