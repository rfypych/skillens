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

export default function () {
  const login = http.post(
    `${BASE}/auth/login`,
    'username=recruiter@skillens.com&password=password123',
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  check(login, { 'login 200': (r) => r.status === 200 });
  if (login.status !== 200) {
    sleep(1);
    return;
  }
  const token = login.json().access_token;
  const jobs = http.get(`${BASE}/jobs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  check(jobs, { 'jobs 200': (r) => r.status === 200 });
  sleep(1);
}
