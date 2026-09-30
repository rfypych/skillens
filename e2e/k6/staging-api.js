import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
  },
};

const BASE = __ENV.BASE_URL || 'https://staging-api.socratech.my.id';

export function setup() {
  const login = http.post(
    `${BASE}/auth/login`,
    'username=recruiter@skillens.com&password=password123',
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  if (login.status !== 200) throw new Error('setup login failed: ' + login.status);
  return { token: login.json().access_token };
}

export default function (data) {
  const jobs = http.get(`${BASE}/jobs`, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
  check(jobs, { 'jobs 200': (r) => r.status === 200 });
  sleep(1);
}
