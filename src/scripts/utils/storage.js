import ext from "./ext";
window.__EXT = ext
module.exports = (ext.storage.sync ? ext.storage.sync : ext.storage.local);