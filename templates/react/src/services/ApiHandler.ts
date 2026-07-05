import ApiFormatter from '@/services/ApiFormatter';

class ApiHandler {
  static async get(endpoint: string, contentType?: string): Promise<any> {
    const formattedEndpoint = ApiFormatter.formatEndpoint(endpoint);
    try {
      const req = ApiFormatter.formatFetch('GET', undefined, contentType);
      const res = await fetch(formattedEndpoint, req);
      const data = await res.json();
      ApiFormatter.handleError(res, data);
      return data;
    } catch (err: any) {
      return { ErrorMsg: err.message || err };
    }
  }

  static async post(endpoint: string, body?: any, contentType?: string): Promise<any> {
    const formattedEndpoint = ApiFormatter.formatEndpoint(endpoint);
    try {
      const req = ApiFormatter.formatFetch('POST', body, contentType);
      const res = await fetch(formattedEndpoint, req);
      const data = await res.json();
      ApiFormatter.handleError(res, data);
      return data;
    } catch (err: any) {
      return { ErrorMsg: err.message || err };
    }
  }
}

export default ApiHandler;
