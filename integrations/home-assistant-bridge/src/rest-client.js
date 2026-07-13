export class HomeAssistantRestClient {
  constructor({ baseUrl, token, fetchImpl = fetch }) {
    if (!baseUrl) throw new Error('baseUrl is required');
    if (!token) throw new Error('token is required');
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.token = token;
    this.fetch = fetchImpl;
  }

  async request(path, options = {}) {
    const response = await this.fetch(`${this.baseUrl}/api${path}`, {
      ...options,
      headers: