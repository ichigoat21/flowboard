import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from '../../components/ui/progressBar'



describe('ProgressBar Component', () => {

  it('shows 0% when tasks array is empty', () => {
    render(<ProgressBar tasks={[]} />)
    
 
    expect(screen.getByText('0% completed')).toBeInTheDocument()
  })


  it('calculates correct percentage for completed tasks', () => {
    const tasks = [
      { column: 'todo', _id: '1' },
      { column: 'todo', _id: '2' },
      { column: 'done', _id: '3' },
      { column: 'done', _id: '4' },
    ]
    
    render(<ProgressBar tasks={tasks} />)
    
    
    expect(screen.getByText('50% completed')).toBeInTheDocument()
  })

  it('shows 100% when all tasks are completed', () => {
    const tasks = [
      { column: 'done', _id: '1' },
      { column: 'done', _id: '2' },
      { column: 'done', _id: '3' },
    ]
    
    render(<ProgressBar tasks={tasks} />)
    
    expect(screen.getByText('100% completed')).toBeInTheDocument()
  })

 
  it('rounds percentage to nearest whole number', () => {
    const tasks = [
      { column: 'todo', _id: '1' },
      { column: 'done', _id: '2' },
      { column: 'done', _id: '3' },
    ]
    
    render(<ProgressBar tasks={tasks} />)
    
  
    expect(screen.getByText('67% completed')).toBeInTheDocument()
  })

 
  it('sets correct width for progress bar', () => {
    const tasks = [
      { column: 'todo', _id: '1' },
      { column: 'done', _id: '2' },
    ]
    
    const { container } = render(<ProgressBar tasks={tasks} />)
    
  
    const progressBar = container.querySelector('.bg-emerald-500')
    
   
    expect(progressBar).toHaveStyle({ width: '50%' })
  })

  it('only counts done column tasks as completed', () => {
    const tasks = [
      { column: 'todo', _id: '1' },
      { column: 'in-prog', _id: '2' },
      { column: 'in-prog', _id: '3' },
      { column: 'done', _id: '4' },
    ]
    
    render(<ProgressBar tasks={tasks} />)
    
  
    expect(screen.getByText('25% completed')).toBeInTheDocument()
  })

  it('handles edge case of no tasks array', () => {
    
    render(<ProgressBar tasks={[]} />)
    
    expect(screen.getByText('0% completed')).toBeInTheDocument()
  })


  it('renders with correct structure', () => {
    const { container } = render(<ProgressBar tasks={[]} />)
    
    
    const progressContainer = container.querySelector('.bg-slate-200')
    expect(progressContainer).toBeInTheDocument()
    
 
    expect(progressContainer).toHaveClass('rounded-full')
  })

  it('correctly displays various percentages', () => {
   
    const tasks33 = [
      { column: 'todo', _id: '1' },
      { column: 'todo', _id: '2' },
      { column: 'done', _id: '3' },
    ]
    
    const { rerender } = render(<ProgressBar tasks={tasks33} />)
    expect(screen.getByText('33% completed')).toBeInTheDocument()
    
  
    const tasks75 = [
      { column: 'todo', _id: '1' },
      { column: 'done', _id: '2' },
      { column: 'done', _id: '3' },
      { column: 'done', _id: '4' },
    ]
    
    rerender(<ProgressBar tasks={tasks75} />)
    expect(screen.getByText('75% completed')).toBeInTheDocument()
  })

 
  it('renders all visual elements', () => {
    const tasks = [
      { column: 'todo', _id: '1' },
      { column: 'done', _id: '2' },
    ]
    
    const { container } = render(<ProgressBar tasks={tasks} />)
    

    expect(container.querySelector('.bg-slate-200')).toBeInTheDocument()
    
    expect(container.querySelector('.bg-emerald-500')).toBeInTheDocument()
   
    expect(screen.getByText(/% completed/)).toBeInTheDocument()
  })
})

