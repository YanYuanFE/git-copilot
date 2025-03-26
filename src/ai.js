const axios = require('axios');
const { getConfig } = require('./config');

/**
 * Generate commit message
 * @param {Object} changes Change information
 * @returns {Promise<string>} Generated commit message
 */
async function generateCommitMessage(changes) {
  try {
    const apiKey = getConfig('api_key');
    if (!apiKey) {
      throw new Error('Deepseek API key not set');
    }

    // Prepare context for commit message
    const context = prepareContext(changes);

    // Call deepseek API
    const response = await callDeepseekAPI(apiKey, context);
    
    return response;
  } catch (error) {
    console.error('Error generating commit message:', error);
    throw error;
  }
}

/**
 * Prepare context for commit message
 * @param {Object} changes Change information
 * @returns {string} Context information
 */
function prepareContext(changes) {
  let context = 'Please generate a commit message that follows the Conventional Commits specification based on the following code changes. The message should follow this format:\n\ntype: short description\n\n- detailed change 1\n- detailed change 2\n- detailed change 3\n\nSupported type prefixes include:\n- feat: new feature (prefix with ✨ emoji)\n- fix: bug fix (prefix with 🐛 emoji)\n- docs: documentation changes (prefix with 📝 emoji)\n- style: code style changes (no functional changes) (prefix with 💄 emoji)\n- refactor: code refactoring (no new features or bug fixes) (prefix with ♻️ emoji)\n- perf: performance improvements (prefix with ⚡️ emoji)\n- test: test-related changes (prefix with ✅ emoji)\n- build: changes to build system or external dependencies (prefix with 👷 emoji)\n- ci: changes to CI configuration files and scripts (prefix with 🔧 emoji)\n- chore: other changes (prefix with 🔨 emoji)\n\nAlways include the appropriate emoji at the beginning of the commit message based on the type. For example: "✨ feat: add new feature" or "🐛 fix: resolve bug".\n\nBased on the following changes:\n\n';

  // Add file change statistics
  context += `Change statistics:\n`;
  context += `- Added: ${changes.added.length} files\n`;
  context += `- Modified: ${changes.modified.length} files\n`;
  context += `- Deleted: ${changes.deleted.length} files\n\n`;

  // Add detailed file changes
  context += 'Detailed changes:\n';

  // Add new files
  if (changes.added.length > 0) {
    context += '\nAdded files:\n';
    for (const file of changes.added) {
      context += `- ${file}\n`;
      if (changes.fileChanges[file]) {
        // Limit the length of diff content to avoid exceeding API limits
        const diffContent = changes.fileChanges[file].substring(0, 1000);
        context += `\n\`\`\`diff\n${diffContent}\n\`\`\`\n`;
      }
    }
  }

  // Add modified files
  if (changes.modified.length > 0) {
    context += '\nModified files:\n';
    for (const file of changes.modified) {
      context += `- ${file}\n`;
      if (changes.fileChanges[file]) {
        // Limit the length of diff content to avoid exceeding API limits
        const diffContent = changes.fileChanges[file].substring(0, 1000);
        context += `\n\`\`\`diff\n${diffContent}\n\`\`\`\n`;
      }
    }
  }

  // Add deleted files
  if (changes.deleted.length > 0) {
    context += '\nDeleted files:\n';
    for (const file of changes.deleted) {
      context += `- ${file}\n`;
    }
  }

  return context;
}

/**
 * Call deepseek API
 * @param {string} apiKey API key
 * @param {string} context Context information
 * @returns {Promise<string>} API response
 */
async function callDeepseekAPI(apiKey, context) {
  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a professional code review assistant, skilled at analyzing code changes and generating commit messages that comply with the Conventional Commits specification. Always generate commit messages in English, not in any other language. IMPORTANT: Return ONLY the commit message itself without any additional text, explanations, or descriptions. Do not include phrases like "Here\'s the commit message" or any concluding paragraphs.'
          },
          {
            role: 'user',
            content: context
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    // Extract the generated commit message
    const commitMessage = response.data.choices[0].message.content.trim();
    
    
    return commitMessage;
  } catch (error) {
    console.error('Error calling deepseek API:', error.response?.data || error.message);
    throw new Error('Failed to call deepseek API, please check your API key and network connection');
  }
}

module.exports = {
  generateCommitMessage
};