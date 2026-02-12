import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModalComponent } from '../../components/ui/Modal'

describe('Modal Component', () => {
  let mockSocket

  beforeEach(() => {
    mockSocket = {
      emit: vi.fn(),
      on: vi.fn(),
      once: vi.fn(),
      off: vi.fn()
    }
  })

  it('renders when open is true', () => {
    render(<ModalComponent open={true} onclose={vi.fn()} socket={mockSocket} />)
    expect(screen.getByText('Add Task')).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    render(<ModalComponent open={false} onclose={vi.fn()} socket={mockSocket} />)
    expect(screen.queryByText('Add Task')).not.toBeInTheDocument()
  })

  it('shows Update Task when isUpdate is true', () => {
    const task = { _id: '123', title: 'Test', description: '', priority: 'low', column: 'todo' }
    render(<ModalComponent open={true} onclose={vi.fn()} socket={mockSocket} isUpdate={true} task={task} />)
    expect(screen.getByRole('heading', { name: 'Update Task' })).toBeInTheDocument()
  })

  it('calls onclose when close button is clicked', async () => {
    const mockClose = vi.fn()
    render(<ModalComponent open={true} onclose={mockClose} socket={mockSocket} />)
    
    const closeButton = screen.getByLabelText('Close modal')
    await userEvent.click(closeButton)
    
    expect(mockClose).toHaveBeenCalledTimes(1)
  })

  it('allows typing in title field', async () => {
    render(<ModalComponent open={true} onclose={vi.fn()} socket={mockSocket} />)
    
    const titleInput = screen.getByPlaceholderText('Task title')
    await userEvent.type(titleInput, 'New Task')
    
    expect(titleInput).toHaveValue('New Task')
  })

  it('allows typing in description field', async () => {
    render(<ModalComponent open={true} onclose={vi.fn()} socket={mockSocket} />)
    
    const descInput = screen.getByPlaceholderText('Add a description')
    await userEvent.type(descInput, 'Task description')
    
    expect(descInput).toHaveValue('Task description')
  })

  it('allows selecting priority', async () => {
    render(<ModalComponent open={true} onclose={vi.fn()} socket={mockSocket} />)
    
    const highButton = screen.getByText('#high')
    await userEvent.click(highButton)
    
    expect(highButton.className).toContain('bg-blue')
  })

  it('allows selecting status', async () => {
    render(<ModalComponent open={true} onclose={vi.fn()} socket={mockSocket} />)
    
    const inProgressButton = screen.getByText('In Progress')
    await userEvent.click(inProgressButton)
    
    expect(inProgressButton.className).toContain('bg-blue-500')
  })

  it('shows validation error when title is empty', async () => {
    window.alert = vi.fn()
    
    mockSocket.once.mockImplementation((event, handler) => {
      if (event === 'task:created') {
        setTimeout(() => handler({ _id: '123' }), 10)
      }
    })
    
    render(<ModalComponent open={true} onclose={vi.fn()} socket={mockSocket} />)
    
    const submitButton = screen.getByText('Submit Task')
    await userEvent.click(submitButton)
    
    expect(window.alert).toHaveBeenCalledWith('Please enter a task title')
  })

  it('emits task:create when submitting new task', async () => {
    mockSocket.once.mockImplementation((event, handler) => {
      if (event === 'task:created') {
        setTimeout(() => handler({ _id: '123' }), 10)
      }
    })
    
    render(<ModalComponent open={true} onclose={vi.fn()} socket={mockSocket} />)
    
    const titleInput = screen.getByPlaceholderText('Task title')
    await userEvent.type(titleInput, 'New Task')
    
    const submitButton = screen.getByText('Submit Task')
    await userEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockSocket.emit).toHaveBeenCalledWith('task:create', expect.objectContaining({
        title: 'New Task'
      }))
    })
  })

  it('emits task:update when updating existing task', async () => {
    const task = { _id: '123', title: 'Old Title', description: '', priority: 'low', column: 'todo' }
    render(<ModalComponent open={true} onclose={vi.fn()} socket={mockSocket} isUpdate={true} task={task} />)
    
    const titleInput = screen.getByPlaceholderText('Task title')
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Updated Title')
    
    const submitButton = screen.getByRole('button', { name: 'Update Task' })
    await userEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockSocket.emit).toHaveBeenCalledWith('task:update', expect.objectContaining({
        id: '123',
        updates: expect.objectContaining({
          title: 'Updated Title'
        })
      }))
    })
  })

  it('pre-fills form when editing task', () => {
    const task = {
      _id: '123',
      title: 'Existing Task',
      description: 'Existing Description',
      priority: 'high',
      column: 'in-prog',
      category: 'work'
    }
    render(<ModalComponent open={true} onclose={vi.fn()} socket={mockSocket} isUpdate={true} task={task} />)
    
    expect(screen.getByPlaceholderText('Task title')).toHaveValue('Existing Task')
    expect(screen.getByPlaceholderText('Add a description')).toHaveValue('Existing Description')
  })
})