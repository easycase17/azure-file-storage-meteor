// Information about this package:
Package.describe({
    // Short two-sentence summary
    summary: 'Azure File storage adapter for CollectionFS',
    // Version number
    version: '0.0.1',
    // Optional, default is package directory name
    name: 'easycase17:azure-file-storage-meteor',
    // Optional GitHub URL to your source repository
    git: 'https://github.com/easycase17/azure-file-storage-meteor.git'
});

// This lets you use npm packages in your package:
Npm.depends({
    'azure-storage': '2.6.0',
    'stream-buffers': '2.1.0'
});

// This defines your actual package:
Package.onUse((api) => {
    api.versionsFrom('1.0');

    api.use(['cfs:base-package@0.0.30', 'cfs:storage-adapter@0.2.3']);
    api.addFiles([
        'azure.server.js',
        'azure.upload.stream.js',
    ], 'server');
    api.addFiles('azure.client.js', 'client');
});

// This defines the tests for the package:
Package.onTest((api) => {
    api.use(['cfs:standard-packages', 'test-helpers', 'tinytest'], 'server');
    api.addFiles('tests/server-tests.js', 'server');
    api.addFiles('tests/client-tests.js', 'client');
});