import { render, screen, fireEvent } from '@testing-library/react'
import QueryEditor from './QueryEditor'

it('submits a question', () => {
  const onSubmit = vi.fn()
  render(<QueryEditor onSubmit={onSubmit} isLoading={false} currentQuery="" />)
  const input = screen.getByPlaceholderText(/Ex: Quero vendas/i)
  fireEvent.change(input, { target: { value: 'vendas por região' } })
  fireEvent.click(screen.getByText('Perguntar'))
  expect(onSubmit).toHaveBeenCalled()
})
