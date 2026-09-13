import os from 'os';

export class NetworkUtils {
  public static getLocalIpAddresses(): string[] {
    const interfaces = os.networkInterfaces();
    const addresses: string[] = [];

    for (const name of Object.keys(interfaces)) {
      const netInterface = interfaces[name];
      if (!netInterface) continue;

      for (const info of netInterface) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (info.family === 'IPv4' && !info.internal) {
          addresses.push(info.address);
        }
      }
    }

    return addresses.length > 0 ? addresses : ['127.0.0.1'];
  }

  public static getPrimaryLocalIp(): string {
    const ips = this.getLocalIpAddresses();
    return ips[0] || '127.0.0.1';
  }
}
