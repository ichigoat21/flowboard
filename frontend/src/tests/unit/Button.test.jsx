import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Button}  from '../../components/ui/Button'





describe('Button Component', () => {

  it('renders with the correct text', () => {
 
    render(<Button text="Click me!" variant="primary" size="md" />)

    const button = screen.getByText('Click me!')

    expect(button).toBeInTheDocument()
  })

  it('calls onclick function when clicked', async () => {
  
    const handleClick = vi.fn()
    
    
    render(
      <Button 
        text="Click me!" 
        onclick={handleClick} 
        variant="primary" 
        size="md" 
      />
    )
    

    const button = screen.getByText('Click me!')
    await userEvent.click(button)
    

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies correct variant styles', () => {
    const { rerender } = render(
      <Button text="Test" variant="primary" size="md" />
    )
    
    let button = screen.getByText('Test')

    expect(button).toHaveClass('bg-blue')
    

    rerender(<Button text="Test" variant="red" size="md" />)
    button = screen.getByText('Test')
    expect(button).toHaveClass('bg-red-400')
  })

  it('applies correct size styles', () => {
    const { rerender } = render(
      <Button text="Test" variant="primary" size="sm" />
    )
    
    let button = screen.getByText('Test')
    expect(button).toHaveClass('px-1')

    rerender(<Button text="Test" variant="primary" size="lg" />)
    button = screen.getByText('Test')
    expect(button).toHaveClass('w-full')
  })

  it('can be clicked multiple times', async () => {
    const handleClick = vi.fn()
    
    render(
      <Button 
        text="Multi Click" 
        onclick={handleClick} 
        variant="primary" 
        size="md" 
      />
    )
    
    const button = screen.getByText('Multi Click')
    

    await userEvent.click(button)
    await userEvent.click(button)
    await userEvent.click(button)
    

    expect(handleClick).toHaveBeenCalledTimes(3)
  })
})
