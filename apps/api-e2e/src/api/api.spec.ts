import axios from 'axios';

describe('GET /api', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello API' });
  });
});

describe('GET /api/categories', () => {
  it('should list seed categories', async () => {
    const res = await axios.get('/api/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
  });
});

describe('GET /api/tasks', () => {
  it('should list seed tasks with pagination structure', async () => {
    const res = await axios.get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('tasks');
    expect(res.data).toHaveProperty('total');
    expect(Array.isArray(res.data.tasks)).toBe(true);
  });
});

describe('POST /api/tasks/share', () => {
  it('should successfully mock-send email', async () => {
    const res = await axios.post('/api/tasks/share', { email: 'test@example.com' });
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('success', true);
  });

  it('should return 400 for invalid email', async () => {
    try {
      await axios.post('/api/tasks/share', { email: 'invalid-email' });
    } catch (err: any) {
      expect(err.response.status).toBe(400);
    }
  });
});
