// Configuration based on environment variables or defaults
const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://149.102.158.71:6002',
  apiHost: process.env.REACT_APP_HOST || '149.102.158.71',
  apiPort: process.env.REACT_APP_PORT || '6003',
};

export default config;
