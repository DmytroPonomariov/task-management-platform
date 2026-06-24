import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { App } from './app';

// Mock Globals
const mockCategories = [
  { id: 'cat-1', name: 'Work', userId: 'user-alice', createdAt: '2026-06-20T10:00:00.000Z' },
  { id: 'cat-2', name: 'Personal', userId: 'user-alice', createdAt: '2026-06-20T10:00:00.000Z' },
];

const mockTasks = [
  {
    id: 'task-1',
    title: 'Task One',
    description: 'Description One',
    status: 'TODO',
    userId: 'user-alice',
    categoryId: 'cat-1',
    createdAt: '2026-06-20T10:00:00.000Z',
    updatedAt: '2026-06-20T10:00:00.000Z',
  },
  {
    id: 'task-2',
    title: 'Task Two',
    description: 'Description Two',
    status: 'IN_PROGRESS',
    userId: 'user-alice',
    categoryId: 'cat-2',
    createdAt: '2026-06-20T10:00:00.000Z',
    updatedAt: '2026-06-20T10:00:00.000Z',
  },
];

describe('Frontend App', () => {
  let container: HTMLDivElement | null = null;
  let root: ReturnType<typeof createRoot> | null = null;
  let fetchMock: any;

  beforeEach(() => {
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);

    // Mock fetch API
    fetchMock = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (url.includes('/api/categories')) {
        if (options?.method === 'POST') {
          const body = JSON.parse(options.body as string);
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 'cat-new', name: body.name, userId: 'user-alice', createdAt: new Date().toISOString() }),
          });
        }
        if (options?.method === 'PATCH') {
          const body = JSON.parse(options.body as string);
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 'cat-1', name: body.name, userId: 'user-alice', createdAt: new Date().toISOString() }),
          });
        }
        if (options?.method === 'DELETE') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        });
      }

      if (url.includes('/api/tasks')) {
        if (options?.method === 'POST') {
          const body = JSON.parse(options.body as string);
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 'task-new', ...body, userId: 'user-alice', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
          });
        }
        if (options?.method === 'PATCH') {
          const body = JSON.parse(options.body as string);
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 'task-1', ...body, userId: 'user-alice', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
          });
        }
        if (options?.method === 'DELETE') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          });
        }
        // GET returns list
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              tasks: mockTasks,
              total: 2,
              page: 1,
              limit: 6,
            }),
        });
      }

      return Promise.reject(new Error(`Unhandled request: ${url}`));
    });

    global.fetch = fetchMock;
    global.confirm = vi.fn().mockReturnValue(true);
  });

  afterEach(() => {
    if (root) {
      act(() => {
        root!.unmount();
      });
      root = null;
    }
    if (container) {
      document.body.removeChild(container);
      container = null;
    }
    vi.restoreAllMocks();
  });

  const setInputValue = (input: HTMLInputElement | HTMLTextAreaElement, value: string) => {
    const prototype = input instanceof HTMLInputElement ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
    const nativeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    nativeValueSetter?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const renderApp = async () => {
    await act(async () => {
      root = createRoot(container!);
      root.render(<App />);
    });
    // Wait for initial fetches (categories and tasks)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  };

  it('renders logo title and fetches initial categories and tasks', async () => {
    await renderApp();
    expect(container!.innerHTML).toContain('TaskFlow');
    expect(container!.innerHTML).toContain('Task One');
    expect(container!.innerHTML).toContain('Task Two');
    expect(container!.innerHTML).toContain('Work');
    expect(container!.innerHTML).toContain('Personal');
  });

  it('triggers task search filtering when typing in search input', async () => {
    await renderApp();
    const searchInput = container!.querySelector('input[placeholder="Search title or description..."]') as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    await act(async () => {
      setInputValue(searchInput, 'Specific Search');
    });

    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('search=Specific+Search'));
  });

  it('triggers category filtering when clicking category from sidebar', async () => {
    await renderApp();
    const workCatItem = Array.from(container!.querySelectorAll('li')).find(
      (el) => el.textContent?.includes('Work') && !el.textContent?.includes('Rename')
    );
    expect(workCatItem).toBeTruthy();

    await act(async () => {
      workCatItem!.click();
    });

    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('categoryId=cat-1'));
  });

  it('allows task deletion and refreshes lists', async () => {
    await renderApp();
    const deleteButtons = Array.from(container!.querySelectorAll('button')).filter(
      (btn) => btn.getAttribute('title') === 'Delete Task'
    );
    expect(deleteButtons.length).toBeGreaterThan(0);

    await act(async () => {
      deleteButtons[0].click();
    });

    expect(global.confirm).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/api/tasks/task-1'), expect.objectContaining({ method: 'DELETE' }));
  });

  it('allows opening create modal, submitting form, and triggering POST api/tasks', async () => {
    await renderApp();
    const addTaskButton = Array.from(container!.querySelectorAll('button')).find(
      (btn) => btn.textContent?.includes('Add Task')
    );
    expect(addTaskButton).toBeTruthy();

    // Click Add Task to open Modal
    await act(async () => {
      addTaskButton!.click();
    });

    expect(container!.innerHTML).toContain('Create Task');

    // Fill Title
    const titleInput = container!.querySelector('input[placeholder="e.g. Learn React router"]') as HTMLInputElement;
    const forms = container!.querySelectorAll('form');
    const form = forms[forms.length - 1] as HTMLFormElement;
    expect(titleInput).toBeTruthy();
    expect(form).toBeTruthy();

    await act(async () => {
      setInputValue(titleInput, 'New Interview Task');
    });

    // Submit form
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/tasks',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"title":"New Interview Task"'),
      })
    );
  });

  it('allows task sharing and shows success message', async () => {
    await renderApp();
    const shareInput = container!.querySelector('input[placeholder="recipient@example.com"]') as HTMLInputElement;
    const forms = container!.querySelectorAll('form');
    const shareForm = forms[1] as HTMLFormElement;
    
    expect(shareInput).toBeTruthy();
    expect(shareForm).toBeTruthy();

    await act(async () => {
      setInputValue(shareInput, 'friend@example.com');
    });

    // Mock share response
    fetchMock.mockImplementationOnce((url: string, options?: RequestInit) => {
      if (url.includes('/api/tasks/share')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Mock email sent' }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    await act(async () => {
      shareForm.dispatchEvent(new Event('submit', { bubbles: true }));
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/tasks/share',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"email":"friend@example.com"'),
      })
    );

    expect(container!.innerHTML).toContain('Mock email sent');
  });
});
