import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskCard } from '../../components/ui/Taskcard'

describe('TaskCard Component', () => {
  const mockTask = {
    _id: '123',
    title: 'Test Task',
    description: 'Test Description',
    priority: 'high',
    column: 'in-prog',
    category: 'Development',
    attachments: []
  }

  it('renders task title correctly', () => {
    render(<TaskCard task={mockTask} onedit={vi.fn()} ondelete={vi.fn()} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('renders task description', () => {
    render(<TaskCard task={mockTask} onedit={vi.fn()} ondelete={vi.fn()} />)
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('calls onedit when edit button is clicked', async () => {
    const mockEdit = vi.fn()
    render(<TaskCard task={mockTask} onedit={mockEdit} ondelete={vi.fn()} />)
    
    const editButton = screen.getByTitle('Edit task')
    await userEvent.click(editButton)
    
    expect(mockEdit).toHaveBeenCalledTimes(1)
  })

  it('calls ondelete when delete button is clicked', async () => {
    const mockDelete = vi.fn()
    render(<TaskCard task={mockTask} onedit={vi.fn()} ondelete={mockDelete} />)
    
    const deleteButton = screen.getByTitle('Delete task')
    await userEvent.click(deleteButton)
    
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  it('displays correct priority badge', () => {
    render(<TaskCard task={mockTask} onedit={vi.fn()} ondelete={vi.fn()} />)
    expect(screen.getByText('#high')).toBeInTheDocument()
  })

  it('displays correct state badge', () => {
    render(<TaskCard task={mockTask} onedit={vi.fn()} ondelete={vi.fn()} />)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('shows checkmark for completed tasks', () => {
    const completedTask = { ...mockTask, column: 'done' }
    const { container } = render(<TaskCard task={completedTask} onedit={vi.fn()} ondelete={vi.fn()} />)
    const checkmark = container.querySelector('.bg-emerald-500')
    expect(checkmark).toBeInTheDocument()
  })

  it('displays category badge when present', () => {
    render(<TaskCard task={mockTask} onedit={vi.fn()} ondelete={vi.fn()} />)
    expect(screen.getByText('Development')).toBeInTheDocument()
  })

  it('displays image attachments when present', () => {
    const taskWithImage = {
      ...mockTask,
      attachments: [
        { name: 'test-image.jpg', url: '/uploads/test-image.jpg', type: 'image' }
      ]
    }
    const { container } = render(<TaskCard task={taskWithImage} onedit={vi.fn()} ondelete={vi.fn()} />)
    const image = container.querySelector('img[src="http://localhost:3001/uploads/test-image.jpg"]')
    expect(image).toBeInTheDocument()
  })

  it('displays PDF attachments with button', () => {
    const taskWithPdf = {
      ...mockTask,
      attachments: [
        { name: 'document.pdf', url: '/uploads/document.pdf', type: 'pdf' }
      ]
    }
    render(<TaskCard task={taskWithPdf} onedit={vi.fn()} ondelete={vi.fn()} />)
    expect(screen.getByText('document.pdf')).toBeInTheDocument()
  })

  it('is draggable', () => {
    const { container } = render(<TaskCard task={mockTask} onedit={vi.fn()} ondelete={vi.fn()} onDragStart={vi.fn()} />)
    const draggableElement = container.querySelector('[draggable="true"]')
    expect(draggableElement).toBeInTheDocument()
  })

  it('calls onDragStart when dragging', () => {
    const mockDragStart = vi.fn()
    const { container } = render(<TaskCard task={mockTask} onedit={vi.fn()} ondelete={vi.fn()} onDragStart={mockDragStart} />)
    
    const draggableElement = container.querySelector('[draggable="true"]')
    draggableElement.dispatchEvent(new Event('dragstart', { bubbles: true }))
    
    expect(mockDragStart).toHaveBeenCalledWith(mockTask)
  })
})