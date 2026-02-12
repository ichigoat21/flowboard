import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import KanbanBoard from '../../components/KanbanBoard'


let mockSocket
let eventCallbacks = {}

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => {
    mockSocket = {
      on: vi.fn((event, callback) => {
        eventCallbacks[event] = callback
      }),
      emit: vi.fn(),
      disconnect: vi.fn(),
    }
    return mockSocket
  })
}))


vi.mock('../../components/ui/progressStrip', () => ({
  ProgressStrip: vi.fn(({ tasks }) => (
    <div data-testid="mock-progress-strip">
      Progress: {tasks?.length || 0} tasks
    </div>
  ))
}))

describe('KanbanBoard Integration', () => {
  beforeEach(() => {
    eventCallbacks = {}
    vi.clearAllMocks()
  })


  it('shows loading state before connection', () => {
    render(<KanbanBoard />)
    
    expect(screen.getByText('Kanban Board')).toBeInTheDocument()
  })


  it('connects to socket on mount', async () => {
    render(<KanbanBoard />)

    await act(async () => {
      if (eventCallbacks.connect) {
        eventCallbacks.connect()
      }
    })
    
    await waitFor(() => {
      expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function))
    })
  })


  it('displays tasks after sync', async () => {
    render(<KanbanBoard />)
    

    await act(async () => {
      if (eventCallbacks.connect) {
        eventCallbacks.connect()
      }
      
      const mockTasks = [
        {
          _id: '1',
          title: 'Task 1',
          column: 'todo',
          priority: 'high',
          description: 'First task',
          attachments: [],
        },
        {
          _id: '2',
          title: 'Task 2',
          column: 'in-prog',
          priority: 'low',
          description: 'Second task',
          attachments: [],
        }
      ]
      
      if (eventCallbacks['sync:tasks']) {
        eventCallbacks['sync:tasks'](mockTasks)
      }
    })
    
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()
    })
  })

  it('opens modal when Add Task button is clicked', async () => {
    render(<KanbanBoard />)
    
    await act(async () => {
      if (eventCallbacks.connect) {
        eventCallbacks.connect()
      }
      
      if (eventCallbacks['sync:tasks']) {
        eventCallbacks['sync:tasks']([])
      }
    })
    
    await waitFor(() => {
      const addButton = screen.getByText('Add Task')
      expect(addButton).toBeInTheDocument()
    })
    
    const addButton = screen.getByText('Add Task')
    await userEvent.click(addButton)
    
   
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument()
    })
  })

/
  it('displays correct task counts in columns', async () => {
    render(<KanbanBoard />)
    
    await act(async () => {
      if (eventCallbacks.connect) {
        eventCallbacks.connect()
      }
      
      const mockTasks = [
        { _id: '1', title: 'Task 1', column: 'todo', priority: 'low', description: '', attachments: [] },
        { _id: '2', title: 'Task 2', column: 'todo', priority: 'low', description: '', attachments: [] },
        { _id: '3', title: 'Task 3', column: 'done', priority: 'low', description: '', attachments: [] },
      ]
      
      if (eventCallbacks['sync:tasks']) {
        eventCallbacks['sync:tasks'](mockTasks)
      }
    })
    
    await waitFor(() => {
      const badges = screen.getAllByText('2')
      expect(badges.length).toBeGreaterThan(0)
    })
  })

  it('renders all three kanban columns', async () => {
    render(<KanbanBoard />)
    
    await act(async () => {
      if (eventCallbacks.connect) {
        eventCallbacks.connect()
      }
      
      if (eventCallbacks['sync:tasks']) {
        eventCallbacks['sync:tasks']([])
      }
    })
    
    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument()
      expect(screen.getByText('In Progress')).toBeInTheDocument()
      expect(screen.getByText('Completed')).toBeInTheDocument()
    })
  })

  it('adds new task when task:created event is received', async () => {
    render(<KanbanBoard />)
    
    await act(async () => {
      if (eventCallbacks.connect) {
        eventCallbacks.connect()
      }
      
      if (eventCallbacks['sync:tasks']) {
        eventCallbacks['sync:tasks']([])
      }
      
  
      const newTask = {
        _id: '999',
        title: 'Brand New Task',
        column: 'todo',
        priority: 'high',
        description: 'Just created!',
        attachments: [],
      }
      
      if (eventCallbacks['task:created']) {
        eventCallbacks['task:created'](newTask)
      }
    })
    
    await waitFor(() => {
      expect(screen.getByText('Brand New Task')).toBeInTheDocument()
    })
  })


  it('updates task when task:updated event is received', async () => {
    render(<KanbanBoard />)
    
    const originalTask = {
      _id: '1',
      title: 'Original Title',
      column: 'todo',
      priority: 'low',
      description: 'Original',
      attachments: [],
    }
    
    // Set up initial task
    await act(async () => {
      if (eventCallbacks.connect) {
        eventCallbacks.connect()
      }
      
      if (eventCallbacks['sync:tasks']) {
        eventCallbacks['sync:tasks']([originalTask])
      }
    })
    
    await waitFor(() => {
      expect(screen.getByText('Original Title')).toBeInTheDocument()
    })
  
    const updatedTask = {
      ...originalTask,
      title: 'Updated Title'
    }
    
    await act(async () => {
      if (eventCallbacks['task:updated']) {
        eventCallbacks['task:updated'](updatedTask)
      }
    })
    
    await waitFor(() => {
      expect(screen.getByText('Updated Title')).toBeInTheDocument()
      expect(screen.queryByText('Original Title')).not.toBeInTheDocument()
    })
  })

  it('removes task when task:deleted event is received', async () => {
    render(<KanbanBoard />)
    
    const tasks = [
      { _id: '1', title: 'Keep Me', column: 'todo', priority: 'low', description: '', attachments: [] },
      { _id: '2', title: 'Delete Me', column: 'todo', priority: 'low', description: '', attachments: [] },
    ]
    

    await act(async () => {
      if (eventCallbacks.connect) {
        eventCallbacks.connect()
      }
      
      if (eventCallbacks['sync:tasks']) {
        eventCallbacks['sync:tasks'](tasks)
      }
    })
    
    await waitFor(() => {
      expect(screen.getByText('Delete Me')).toBeInTheDocument()
    })
    
 
    await act(async () => {
      if (eventCallbacks['task:deleted']) {
        eventCallbacks['task:deleted']('2')
      }
    })
    
    await waitFor(() => {
      expect(screen.queryByText('Delete Me')).not.toBeInTheDocument()
      expect(screen.getByText('Keep Me')).toBeInTheDocument()
    })
  })

  it('disconnects socket when component unmounts', async () => {
    const { unmount } = render(<KanbanBoard />)
    
    await act(async () => {
      if (eventCallbacks.connect) {
        eventCallbacks.connect()
      }
    })
    
    unmount()
    
    expect(mockSocket.disconnect).toHaveBeenCalled()
  })
})

