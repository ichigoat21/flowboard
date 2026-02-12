import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputComponent } from '../../components/ui/Input'


describe('InputComponent', () => {

  it('allows user to type text', async () => {
    const handleChange = vi.fn()
    
    render(
      <InputComponent 
        placeholder="Enter text" 
        type="text" 
        value="" 
        onchange={handleChange} 
      />
    )
    

    const input = screen.getByPlaceholderText('Enter text')
    
  
    await userEvent.type(input, 'Hello World')
    

    expect(handleChange).toHaveBeenCalled()
    expect(handleChange).toHaveBeenCalledTimes(11)
  })

 
  it('displays placeholder text', () => {
    render(
      <InputComponent 
        placeholder="Type something..." 
        type="text" 
        value="" 
        onchange={vi.fn()} 
      />
    )
    
    const input = screen.getByPlaceholderText('Type something...')
    expect(input).toBeInTheDocument()
  })

 
  it('displays the current value', () => {
    render(
      <InputComponent 
        placeholder="Name" 
        type="text" 
        value="John Doe" 
        onchange={vi.fn()} 
      />
    )
    
    const input = screen.getByPlaceholderText('Name')
    expect(input).toHaveValue('John Doe')
  })

  it('applies correct styles for text type', () => {
    render(
      <InputComponent 
        placeholder="Test" 
        type="text" 
        value="" 
        onchange={vi.fn()} 
      />
    )
    
    const input = screen.getByPlaceholderText('Test')
   
    expect(input).toHaveClass('w-full')
    expect(input).toHaveClass('rounded-[10px]')
  })

 
  it('can be cleared after typing', async () => {
    const handleChange = vi.fn()
    
    render(
      <InputComponent 
        placeholder="Clear me" 
        type="text" 
        value="Initial text" 
        onchange={handleChange} 
      />
    )
    
    const input = screen.getByPlaceholderText('Clear me')
    

    await userEvent.clear(input)
    

    expect(handleChange).toHaveBeenCalled()
  })

  it('handles Enter key press', async () => {
    const handleChange = vi.fn()
    
    render(
      <InputComponent 
        placeholder="Press Enter" 
        type="text" 
        value="" 
        onchange={handleChange} 
      />
    )
    
    const input = screen.getByPlaceholderText('Press Enter')
    
 
    await userEvent.type(input, 'Test{Enter}')
    
  
    expect(handleChange).toHaveBeenCalledTimes(4) 
  })
})
