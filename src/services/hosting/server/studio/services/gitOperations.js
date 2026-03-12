'use strict';

const simpleGit      = require('simple-git');
const { REPO_ROOT }  = require('./fileSystem');

function getGit() {
  return simpleGit(REPO_ROOT);
}

async function status() {
  const git    = getGit();
  const result = await git.status();
  return {
    branch:   result.current,
    modified: result.modified,
    created:  result.created,
    deleted:  result.deleted,
    staged:   result.staged,
  };
}

async function diff(filePath) {
  const git = getGit();
  if (filePath) {
    return git.diff([filePath]);
  }
  return git.diff();
}

async function commit(message) {
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new Error('Commit message is required');
  }
  const git    = getGit();
  await git.add('.');
  const result = await git.commit(message.trim());
  return { commit: result.commit, summary: result.summary };
}

async function push() {
  const git = getGit();
  await git.push('origin', 'main');
  return { pushed: true };
}

module.exports = { status, diff, commit, push };
