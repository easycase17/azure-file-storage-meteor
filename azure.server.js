// Use Microsoft Azure Storage SDK
Azure = Npm.require('azure-storage');

/**
 * Create an Azure File Storage Service
 * @public
 * @constructor
 * @param   {String}    name
 * @param   {Object}    options
 * @param   {String}    options.share - The share name
 * @param   {String}    [options.storageAccount] - Azure storage account; required if not set in environment variables
 * @param   {String}    [options.storageAccessKey] - AWS storage key; required if not set in environment variables
 * @param   {String}    [options.folder='/'] - Which folder (key prefix) in the share we should use
 * @param   {Function}  [options.beforeSave] - Function to run before saving a file from the server. The context of the function will be the `FS.File` instance we're saving. The function may alter its properties.
 * @returns {FS.StorageAdapter} An instance of FS.StorageAdapter.
 */
FS.Store.Azure = function (name, options) {
    var self = this;
    if (!(self instanceof FS.Store.Azure))
        throw new Error('FS.Store.Azure missing keyword "new"');

    options = options || {};

    // Create the Azure File Service
    var FileService = Azure.createFileService(serviceParams.accountName, serviceParams.accountKey);

    // Determine which folder (key prefix) to use
    var folder = options.folder;
    if (typeof folder === "string" && folder.length) {
        if (folder.slice(0, 1) === "/") {
            folder = folder.slice(1);
        }
        if (folder.slice(-1) !== "/") {
            folder += "/";
        }
    } else {
        folder = "";
    }

    var serviceParams = FS.Utility.extend({
        storageAccount: null, //required
        storageAccessKey: null, //required
    }, options);

    // Return a new FS.StorageAdapter
    return new FS.StorageAdapter(name, options, {
        typeName: 'storage.azure',
        fileKey: function (fileObj) {

            // Lookup the copy
            var info = fileObj && fileObj._getInfo(name);

            // If the store and key is found return the key
            if (info && info.key) return info.key;

            var filename = fileObj.name();
            var filenameInStore = fileObj.name({ store: name });

            // If no store key found we resolve / generate a key
            return fileObj.collectionName + '/' + fileObj._id + '-' + (filenameInStore || filename);
        },
        createReadStream: function (fileKey, options) {
            return FileService.createReadStream(options.share, folder, fileKey, (error, result, response) => {
                if (!error) {
                    // Successfully create read stream
                    console.log(result);
                    console.log(response);
                }
            });
        },
        createWriteStream: function (fileKey, options) {
            return FileService.createWriteStream(options.share, folder, fileKey, (error, result, response) => {
                if (!error) {
                    // Successfully create write stream
                    console.log(result);
                    console.log(response);
                }
            });
        },
        remove: function (fileKey, callback) {
            FileService.deleteFile(options.share, folder, fileKey, callback);
        },
        watch: function() {
            throw new Error("Azure File Storage adapter does not support the sync option");
        }
    });
}

