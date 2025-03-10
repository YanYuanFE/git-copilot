const simpleGit = require('simple-git');
const path = require('path');

/**
 * 初始化Git实例
 * @returns {Object} Git实例
 */
function initGit() {
  return simpleGit();
}

/**
 * 分析当前变更
 * @param {boolean} addAll 是否添加所有变更到暂存区
 * @returns {Object} 变更信息
 */
async function analyzeChanges(addAll = false) {
  const git = initGit();
  
  // 如果需要，添加所有变更到暂存区
  if (addAll) {
    await git.add('.');
  }
  
  // 获取状态
  const status = await git.status();
  
  // 获取暂存区的差异
  const stagedDiff = await git.diff(['--staged']);
  
  // Categorize files
  const added = status.created;
  const modified = status.modified;
  const deleted = status.deleted;
  
  // Get detailed changes for each file
  const fileChanges = {};
  
  // 处理暂存区的文件
  for (const file of [...added, ...modified]) {
    try {
      const fileDiff = await git.diff(['--staged', '--', file]);
      fileChanges[file] = fileDiff;
    } catch (error) {
      console.error(`Error getting differences for file ${file}:`, error);
    }
  }
  
  return {
    added,
    modified,
    deleted,
    fileChanges,
    diff: stagedDiff,
    git
  };
}

/**
 * 分析最近一次提交
 * @returns {Object} 变更信息
 */
async function analyzeLastCommit() {
  const git = initGit();
  
  // 获取最近一次提交的哈希
  const log = await git.log({ maxCount: 1 });
  const lastCommitHash = log.latest.hash;
  
  // 获取上一次提交的哈希
  const previousCommitHash = `${lastCommitHash}^`;
  
  // 获取两次提交之间的差异
  const diff = await git.diff([previousCommitHash, lastCommitHash]);
  
  // 获取变更的文件列表
  const diffSummary = await git.diffSummary([previousCommitHash, lastCommitHash]);
  
  // 分类文件
  const added = [];
  const modified = [];
  const deleted = [];
  
  diffSummary.files.forEach(file => {
    if (file.file) {
      if (file.insertions && !file.deletions) {
        added.push(file.file);
      } else if (!file.insertions && file.deletions) {
        deleted.push(file.file);
      } else {
        modified.push(file.file);
      }
    }
  });
  
  // Get detailed changes for each file
  const fileChanges = {};
  
  for (const file of [...added, ...modified]) {
    try {
      const fileDiff = await git.diff([previousCommitHash, lastCommitHash, '--', file]);
      fileChanges[file] = fileDiff;
    } catch (error) {
      console.error(`Error getting differences for file ${file}:`, error);
    }
  }
  
  return {
    added,
    modified,
    deleted,
    fileChanges,
    diff,
    git
  };
}

module.exports = {
  analyzeChanges,
  analyzeLastCommit
};