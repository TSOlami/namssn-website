import { describe, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Actions } from '../components';
import { expect } from 'vitest';

describe('test actions rendering', ()=> {
  test("show action buttons", ()=> {
    render(<Actions />)
    expect(screen.getByText(/upvote/i)).toBeDefined();
  })
})