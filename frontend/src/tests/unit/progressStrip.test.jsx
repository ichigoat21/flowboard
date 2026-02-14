import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressStrip } from '../../components/ui/progressStrip'




vi.mock('react-chartjs-2', () => ({
  Bar: vi.fn(({ data, options }) => {

    return (
      <div data-testid="mock-chart">
        <div data-chart-data={JSON.stringify(data)} />
        <div data-chart-options={JSON.stringify(options)} />
      </div>
    )
  })
}))


vi.mock('../../utils/chartsetup', () => ({}))

describe('ProgressStrip Component', () => {
  beforeEach(() => {
    
    vi.clearAllMocks()
  })


  it('renders correctly with no tasks', () => {
    render(<ProgressStrip tasks={[]} />)
    
    expect(screen.getByText('0% finished')).toBeInTheDocument()
  })

  
  it('calculates percentage correctly', () => {
    const tasks = [
      { column: 'todo', _id: '1' },
      { column: 'in-prog', _id: '2' },
      { column: 'done', _id: '3' },
      { column: 'done', _id: '4' },
    ]
    
    render(<ProgressStrip tasks={tasks} />)
    
    expect(screen.getByText('50% finished')).toBeInTheDocument()
  })


  it('shows 100% when all tasks are finished', () => {
    const tasks = [
      { column: 'done', _id: '1' },
      { column: 'done', _id: '2' },
    ]
    
    render(<ProgressStrip tasks={tasks} />)
    
    expect(screen.getByText('100% finished')).toBeInTheDocument()
  })

  it('sets correct width for progress indicator', () => {
    const tasks = [
      { column: 'todo', _id: '1' },
      { column: 'done', _id: '2' },
    ]
    
    const { container } = render(<ProgressStrip tasks={tasks} />)
    

    const progressBar = container.querySelector('.bg-emerald-500')
    expect(progressBar).toHaveStyle({ width: '50%' })
  })


  it('passes correct data to chart component', () => {
    const tasks = [
      { column: 'todo', _id: '1' },
      { column: 'todo', _id: '2' },
      { column: 'in-prog', _id: '3' },
      { column: 'done', _id: '4' },
    ]
    
    const { container } = render(<ProgressStrip tasks={tasks} />)

    const chartDataElement = container.querySelector('[data-chart-data]')
    const chartData = JSON.parse(chartDataElement.getAttribute('data-chart-data'))
    
   
    expect(chartData.datasets[0].data).toEqual([2, 1, 1])
  })


  it('uses correct colors for each status', () => {
    const tasks = [
      { column: 'todo', _id: '1' },
      { column: 'in-prog', _id: '2' },
      { column: 'done', _id: '3' },
    ]
    
    const { container } = render(<ProgressStrip tasks={tasks} />)
    
    const chartDataElement = container.querySelector('[data-chart-data]')
    const chartData = JSON.parse(chartDataElement.getAttribute('data-chart-data'))
    
  
    expect(chartData.datasets[0].backgroundColor).toEqual([
      'rgb(244 63 94)',   
      'rgb(59 130 246)',  
      'rgb(16 185 129)',  
    ])
  })


  it('uses correct labels for chart', () => {
    const tasks = [{ column: 'todo', _id: '1' }]
    
    const { container } = render(<ProgressStrip tasks={tasks} />)
    
    const chartDataElement = container.querySelector('[data-chart-data]')
    const chartData = JSON.parse(chartDataElement.getAttribute('data-chart-data'))
    
    expect(chartData.labels).toEqual(['Todo', 'In-Prog', 'Done'])
  })


  it('correctly counts tasks in each column', () => {
    const tasks = [
      { column: 'todo', _id: '1' },
      { column: 'todo', _id: '2' },
      { column: 'todo', _id: '3' },
      { column: 'in-prog', _id: '4' },
      { column: 'in-prog', _id: '5' },
      { column: 'done', _id: '6' },
    ]
    
    const { container } = render(<ProgressStrip tasks={tasks} />)
    
    const chartDataElement = container.querySelector('[data-chart-data]')
    const chartData = JSON.parse(chartDataElement.getAttribute('data-chart-data'))
    
    
    expect(chartData.datasets[0].data).toEqual([3, 2, 1])
  })


  it('has correct container structure', () => {
    const { container } = render(<ProgressStrip tasks={[]} />)
    
   
    const mainContainer = container.querySelector('.bg-white')
    expect(mainContainer).toBeInTheDocument()
    expect(mainContainer).toHaveClass('border-slate-200')
    expect(mainContainer).toHaveClass('rounded-xl')
  })

 
  it('renders the chart component', () => {
    render(<ProgressStrip tasks={[]} />)
    
   
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument()
  })


  it('displays various completion percentages correctly', () => {
 
    const tasks33 = [
      { column: 'todo', _id: '1' },
      { column: 'todo', _id: '2' },
      { column: 'done', _id: '3' },
    ]
    
    const { rerender } = render(<ProgressStrip tasks={tasks33} />)
    expect(screen.getByText('33% finished')).toBeInTheDocument()
    
 
    const tasks80 = [
      { column: 'todo', _id: '1' },
      { column: 'done', _id: '2' },
      { column: 'done', _id: '3' },
      { column: 'done', _id: '4' },
      { column: 'done', _id: '5' },
    ]
    
    rerender(<ProgressStrip tasks={tasks80} />)
    expect(screen.getByText('80% finished')).toBeInTheDocument()
  })

  it('configures chart with correct options', () => {
    const { container } = render(<ProgressStrip tasks={[]} />)
    
    const chartOptionsElement = container.querySelector('[data-chart-options]')
    const chartOptions = JSON.parse(chartOptionsElement.getAttribute('data-chart-options'))
    
   
    expect(chartOptions.responsive).toBe(true)
    
  
    expect(chartOptions.maintainAspectRatio).toBe(false)
    
    
    expect(chartOptions.plugins.legend.display).toBe(false)
    
   
    expect(chartOptions.scales.x.display).toBe(false)
    expect(chartOptions.scales.y.display).toBe(false)
  })

  it('contains all visual elements', () => {
    const tasks = [
      { column: 'todo', _id: '1' },
      { column: 'done', _id: '2' },
    ]
    
    const { container } = render(<ProgressStrip tasks={tasks} />)
    
  
    expect(container.querySelector('.bg-slate-200')).toBeInTheDocument()
    
   
    expect(container.querySelector('.bg-emerald-500')).toBeInTheDocument()
    
   
    expect(screen.getByText(/% finished/)).toBeInTheDocument()
    
   
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument()
  })


  it('rounds percentages to whole numbers', () => {
    const tasks = [
      { column: 'todo', _id: '1' },
      { column: 'done', _id: '2' },
      { column: 'done', _id: '3' },
    ]
    
    render(<ProgressStrip tasks={tasks} />)
    
    
    expect(screen.getByText('67% finished')).toBeInTheDocument()
  })

  it('updates chart data when tasks change', () => {
    const initialTasks = [
      { column: 'todo', _id: '1' },
    ]
    
    const { container, rerender } = render(<ProgressStrip tasks={initialTasks} />)
    
    let chartDataElement = container.querySelector('[data-chart-data]')
    let chartData = JSON.parse(chartDataElement.getAttribute('data-chart-data'))
    
  
    expect(chartData.datasets[0].data).toEqual([1, 0, 0])
    
 
    const newTasks = [
      { column: 'todo', _id: '1' },
      { column: 'done', _id: '2' },
      { column: 'done', _id: '3' },
    ]
    
    rerender(<ProgressStrip tasks={newTasks} />)
    
    chartDataElement = container.querySelector('[data-chart-data]')
    chartData = JSON.parse(chartDataElement.getAttribute('data-chart-data'))
    
  
    expect(chartData.datasets[0].data).toEqual([1, 0, 2])
  })
})

