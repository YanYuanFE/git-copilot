# Git-Copilot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://www.npmjs.com/package/git-copilot)

An AI-powered Git commit assistant that automatically analyzes your code changes and generates standardized commit messages following the Conventional Commits specification.

## 📋 Overview

Git-Copilot streamlines your Git workflow by leveraging AI to generate meaningful and standardized commit messages. It analyzes the changes in your staging area or most recent commit, providing you with well-formatted commit messages that follow best practices.

## ✨ Features

- **Intelligent Analysis**: Automatically analyzes code changes in the staging area or the most recent commit
- **AI-Powered**: Uses AI (via deepseek API) to generate contextually relevant commit messages
- **Conventional Commits**: Generated messages follow the [Conventional Commits](https://www.conventionalcommits.org/) specification
- **Staging Support**: Optionally adds all changes to the staging area automatically
- **Change Statistics**: Provides detailed file change statistics (added, modified, deleted files)
- **Flexible Workflow**: Supports automatic commit or commit after confirmation

## 🔧 Requirements

- Node.js (v12 or higher)
- Git
- deepseek API key

## 📦 Installation

```bash
npm install -g git-copilot
```

After installation, you can use either `git-copilot` or the shorter alias `gc` to run the tool.

## 🚀 Usage

```bash
# Analyze current changes and generate commit message
git-copilot

# Automatically add all changes to staging area and generate commit message
git-copilot --add
# or use short option
git-copilot -a

# Analyze the most recent commit
git-copilot --last
# or use short option
git-copilot -l

# Generate commit message and commit (requires confirmation by default)
git-copilot --commit
# or use short option
git-copilot -c

# Generate commit message and commit automatically without confirmation
git-copilot --commit --auto
# or use short option
git-copilot -c

# Generate commit message and commit after confirmation
git-copilot --commit --confirm
```

## ⚙️ Configuration

When running for the first time, the tool will ask you to provide a deepseek API key. You can also set it manually:

```bash
# Set API key
git-copilot --config api_key YOUR_API_KEY
```

## 🔍 Command Options

| Option | Description |
|--------|-------------|
| `-a, --add` | Automatically add all changes to staging area |
| `-l, --last` | Analyze the most recent commit instead of staged changes |
| `-c, --commit` | Generate commit message and commit (requires confirmation by default) |
| `--auto` | When used with --commit, commit automatically without confirmation |
| `--config <key> <value>` | Set configuration item |
| `-v, --version` | Display version information |
| `-h, --help` | Display help information |

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ❓ Troubleshooting

### API Key Issues

If you encounter issues with your API key, ensure it's correctly set using the `--config` option.

### No Changes Detected

If the tool reports "No changes detected", make sure you have changes in your working directory or staging area.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.