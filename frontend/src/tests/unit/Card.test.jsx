import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Card } from '../../components/ui/Card'


vi.mock('./Taskcard', () => ({
  TaskCard: vi.fn(({ task, onedit, ondelete, onDragStart }) => (
    <div data-testid={`task-${task._id}`}>
      <span>{task.title}</span>
      <button onClick={onedit}>Edit</button>
      <button onClick={ondelete}>Delete</button>
      <div onDragStart={() => onDragStart(task)}>Drag Me</div>
    </div>
  ))
}))

describe('Card Component', () => {
  let mockOnEditTask
  let mockOnDeleteTask
  let mockOnDragStart
  let mockOnDropTask

  beforeEach(() => {
    mockOnEditTask = vi.fn()
    mockOnDeleteTask = vi.fn()
    mockOnDragStart = vi.fn()
    mockOnDropTask = vi.fn()
  })

  it('displays the column title', () => {
    render(
      <Card
        title="To Do"
        column="todo"
        tasks={[]}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onDragStart={mockOnDragStart}
        onDropTask={mockOnDropTask}
      />
    )
    
    expect(screen.getByText('To Do')).toBeInTheDocument()
  })


  it('displays correct task count', () => {
    const tasks = [
      { _id: '1', title: 'Task 1', column: 'todo', priority: 'low', description: '' },
      { _id: '2', title: 'Task 2', column: 'todo', priority: 'low', description: '' },
      { _id: '3', title: 'Task 3', column: 'todo', priority: 'low', description: '' },
    ]
    
    render(
      <Card
        title="To Do"
        column="todo"
        tasks={tasks}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onDragStart={mockOnDragStart}
        onDropTask={mockOnDropTask}
      />
    )
    
  
    expect(screen.getByText('3')).toBeInTheDocument()
  })


  it('displays empty state message when no tasks', () => {
    render(
      <Card
        title="To Do"
        column="todo"
        tasks={[]}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onDragStart={mockOnDragStart}
        onDropTask={mockOnDropTask}
      />
    )
    
    expect(screen.getByText('Drop tasks here')).toBeInTheDocument()
  })


  it('renders a TaskCard for each task', () => {
    const tasks = [
      { _id: '1', title: 'Task 1', column: 'todo', priority: 'low', description: '' },
      { _id: '2', title: 'Task 2', column: 'todo', priority: 'low', description: '' },
    ]
    
    render(
      <Card
        title="To Do"
        column="todo"
        tasks={tasks}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onDragStart={mockOnDragStart}
        onDropTask={mockOnDropTask}
      />
    )
    
  
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

 
  it('calls onEditTask with correct task when edit is clicked', () => {
    const tasks = [
      { _id: '1', title: 'Task 1', column: 'todo', priority: 'low', description: '' },
    ]
    
    render(
      <Card
        title="To Do"
        column="todo"
        tasks={tasks}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onDragStart={mockOnDragStart}
        onDropTask={mockOnDropTask}
      />
    )
    

    const editButton = screen.getByTitle('Edit task')
    fireEvent.click(editButton)
   
    expect(mockOnEditTask).toHaveBeenCalledWith(tasks[0])
    expect(mockOnEditTask).toHaveBeenCalledTimes(1)
  })


  it('calls onDeleteTask with correct task when delete is clicked', () => {
    const tasks = [
      { _id: '1', title: 'Task 1', column: 'todo', priority: 'low', description: '' },
    ]
    
    render(
      <Card
        title="To Do"
        column="todo"
        tasks={tasks}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onDragStart={mockOnDragStart}
        onDropTask={mockOnDropTask}
      />
    )
    

    const deleteButton = screen.getByTitle('Delete task')
    fireEvent.click(deleteButton)
    
    
    expect(mockOnDeleteTask).toHaveBeenCalledWith(tasks[0])
    expect(mockOnDeleteTask).toHaveBeenCalledTimes(1)
  })

 
  it('calls onDragStart when dragging task', () => {
    const tasks = [
      { _id: '1', title: 'Task 1', column: 'todo', priority: 'low', description: '' },
    ]
    
    const { container } = render(
      <Card
        title="To Do"
        column="todo"
        tasks={tasks}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onDragStart={mockOnDragStart}
        onDropTask={mockOnDropTask}
      />
    )
    
  
    const dragElement = container.querySelector('[draggable="true"]')
    fireEvent.dragStart(dragElement)
    
    expect(mockOnDragStart).toHaveBeenCalledWith(tasks[0])
  })

  it('calls onDropTask with column when task is dropped', () => {
    const { container } = render(
      <Card
        title="To Do"
        column="todo"
        tasks={[]}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onDragStart={mockOnDragStart}
        onDropTask={mockOnDropTask}
      />
    )
    

    const dropZone = container.querySelector('.w-full')
    
 
    fireEvent.drop(dropZone)
   
    expect(mockOnDropTask).toHaveBeenCalledWith('todo')
  })


  it('prevents default on drag over to allow drop', () => {
    const { container } = render(
      <Card
        title="To Do"
        column="todo"
        tasks={[]}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onDragStart={mockOnDragStart}
        onDropTask={mockOnDropTask}
      />
    )
    
    const dropZone = container.querySelector('.w-full')
    

    const dragOverEvent = new Event('dragover', { bubbles: true, cancelable: true })

    dropZone.dispatchEvent(dragOverEvent)

    expect(dragOverEvent.defaultPrevented).toBe(true)
  })

  it('shows 0 when tasks array is empty', () => {
    render(
      <Card
        title="To Do"
        column="todo"
        tasks={[]}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onDragStart={mockOnDragStart}
        onDropTask={mockOnDropTask}
      />
    )
    

    expect(screen.getByText('0')).toBeInTheDocument()
  })


  it('renders multiple tasks in order', () => {
    const tasks = [
      { _id: '1', title: 'First Task', column: 'todo', priority: 'low', description: '' },
      { _id: '2', title: 'Second Task', column: 'todo', priority: 'low', description: '' },
      { _id: '3', title: 'Third Task', column: 'todo', priority: 'low', description: '' },
    ]
    
    render(
      <Card
        title="To Do"
        column="todo"
        tasks={tasks}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onDragStart={mockOnDragStart}
        onDropTask={mockOnDropTask}
      />
    )
    
    expect(screen.getByText('First Task')).toBeInTheDocument()
    expect(screen.getByText('Second Task')).toBeInTheDocument()
    expect(screen.getByText('Third Task')).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    const { container } = render(
      <Card
        title="To Do"
        column="todo"
        tasks={[]}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onDragStart={mockOnDragStart}
        onDropTask={mockOnDropTask}
      />
    )
    
    const mainContainer = container.querySelector('.w-full')
    expect(mainContainer).toHaveClass('min-h-[200px]')
    

    const title = screen.getByText('To Do')
    expect(title).toHaveClass('uppercase')
  })


  it('works correctly with different column names', () => {
    const columns = [
      { name: 'todo', title: 'To Do' },
      { name: 'in-prog', title: 'In Progress' },
      { name: 'done', title: 'Completed' },
    ]
    
    columns.forEach(({ name, title }) => {
      const { unmount } = render(
        <Card
          title={title}
          column={name}
          tasks={[]}
          onEditTask={mockOnEditTask}
          onDeleteTask={mockOnDeleteTask}
          onDragStart={mockOnDragStart}
          onDropTask={mockOnDropTask}
        />
      )
      
      expect(screen.getByText(title)).toBeInTheDocument()
      
      unmount()
    })
  })

  it('displays task count badge with correct styling', () => {
    const tasks = [
      { _id: '1', title: 'Task 1', column: 'todo', priority: 'low', description: '' },
    ]
    
    const { container } = render(
      <Card
        title="To Do"
        column="todo"
        tasks={tasks}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onDragStart={mockOnDragStart}
        onDropTask={mockOnDropTask}
      />
    )
    
    const badge = screen.getByText('1')
    

    expect(badge).toHaveClass('rounded-full')
    expect(badge).toHaveClass('bg-slate-100')
  })


  it('empty state has dashed border styling', () => {
    const { container } = render(
      <Card
        title="To Do"
        column="todo"
        tasks={[]}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
        onDragStart={mockOnDragStart}
        onDropTask={mockOnDropTask}
      />
    )
    
    const emptyState = screen.getByText('Drop tasks here').closest('div')
    
    expect(emptyState).toHaveClass('border-dashed')
    expect(emptyState).toHaveClass('border-slate-200')
  })
})

