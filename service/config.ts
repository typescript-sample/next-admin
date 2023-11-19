export const config = {
  authentication_url: 'http://localhost:8082',
  signup_url: 'http://localhost:8082/signup',
  password_url: 'http://localhost:8082/password',
  oauth2_url: 'http://localhost:8082/oauth2',

  user_url: 'http://localhost:8082/users',
  role_url: 'http://localhost:8082/roles',
  privilege_url: 'http://localhost:8082/privileges',
  audit_log_url: 'http://localhost:8082/audit-logs',

};

export const env = {
  sit: {
    authentication_url: 'http://10.1.0.234:3003'
  },
  deploy: {
    authentication_url: '/server'
  }
};
