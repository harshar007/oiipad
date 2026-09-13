"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkUtils = void 0;
const os_1 = __importDefault(require("os"));
class NetworkUtils {
    static getLocalIpAddresses() {
        const interfaces = os_1.default.networkInterfaces();
        const addresses = [];
        for (const name of Object.keys(interfaces)) {
            const netInterface = interfaces[name];
            if (!netInterface)
                continue;
            for (const info of netInterface) {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if (info.family === 'IPv4' && !info.internal) {
                    addresses.push(info.address);
                }
            }
        }
        return addresses.length > 0 ? addresses : ['127.0.0.1'];
    }
    static getPrimaryLocalIp() {
        const ips = this.getLocalIpAddresses();
        return ips[0] || '127.0.0.1';
    }
}
exports.NetworkUtils = NetworkUtils;
//# sourceMappingURL=NetworkUtils.js.map