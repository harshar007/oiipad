const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.extraNodeModules = {
  '@oiipad/domain': path.resolve(workspaceRoot, 'packages/domain/src'),
  '@oiipad/protocol': path.resolve(workspaceRoot, 'packages/protocol/src'),
  '@oiipad/shared-types': path.resolve(workspaceRoot, 'packages/shared-types/src'),
};

module.exports = config;
