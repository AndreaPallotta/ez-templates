import { app, server } from '@/utils/env';
import { nullSafe } from '@/utils/validation';

class ApiFormatter {
  static getHeaders(contentType: string = 'application/json'): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      Accept: 'application/json',
    };

    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);

        if (user?.authToken && app.isJWT) {
          headers['Authorization'] = `Bearer ${user.authToken}`;
        }
      }
    } catch {
      return headers;
    }
    return headers;
  }

  static formatEndpoint(endpoint: string): string {
    if (endpoint.startsWith(app.prefix)) {
      return endpoint;
    }

    if (!endpoint.startsWith('/')) {
      endpoint = `/${endpoint}`;
    }

    return `${app.prefix}/${server.host}:${server.port}${endpoint}`;
  }

  static handleError(res: Response, data: any): void {
    if (!res.ok || !nullSafe(data)) {
      throw new Error(`(${res.status}) ${data?.Error || res.statusText}`);
    }
  }

  static formatFetch(method: string, body?: any, contentType?: string): RequestInit {
    const headers = ApiFormatter.getHeaders(contentType);

    if (method === 'GET') {
      return { headers };
    }

    try {
      const bodyStr = JSON.stringify(body);
      return { headers, method, body: bodyStr };
    } catch {
      throw new Error('400: Request Body Invalid');
    }
  }
}

export default ApiFormatter;
