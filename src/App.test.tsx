import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from '@testing-library/react';
import App from './App';

test('Add and Remove Option', async () => {
  render(<App />);
  // ACT
  userEvent.click(screen.getByPlaceholderText('Select...'));
  await screen.findAllByRole('img');

  userEvent.click(screen.getAllByRole('img')[0]);
  expect(screen.queryAllByRole('button')).toHaveLength(1);
  userEvent.keyboard('{Backspace}');
  expect(screen.queryAllByRole('button')).toHaveLength(0);
});

test('Keyboard Test', async () => {
  window.HTMLElement.prototype.scrollIntoView = function () {
    //for test
  };

  render(<App />);
  // ACT
  userEvent.click(screen.getByPlaceholderText('Select...'));
  await screen.findAllByRole('img');

  userEvent.keyboard('{ArrowDown}');
  userEvent.keyboard('{ArrowDown}');
  userEvent.keyboard('{ArrowDown}');
  userEvent.keyboard('{ArrowDown}');
  userEvent.keyboard('{ArrowDown}');
  userEvent.keyboard('{ArrowUp}');
  userEvent.keyboard('{Enter}');
  userEvent.keyboard('{ArrowDown}');
  userEvent.keyboard('{ArrowDown}');
  userEvent.keyboard('{Enter}');

  expect(screen.queryAllByRole('button')).toHaveLength(2);
  userEvent.keyboard('{ArrowUp}');
  userEvent.keyboard('{ArrowUp}');
  userEvent.keyboard('{ArrowUp}');
  userEvent.keyboard('{ArrowUp}');
  userEvent.keyboard('{ArrowUp}');
  userEvent.keyboard('{Enter}');
  expect(screen.queryAllByRole('button')).toHaveLength(3);
  userEvent.keyboard('{ArrowDown}');
  userEvent.keyboard('{ArrowDown}');
  userEvent.keyboard('{ArrowDown}');
  userEvent.keyboard('{Enter}');
  expect(screen.queryAllByRole('button')).toHaveLength(2);
  userEvent.keyboard('{Enter}');
  expect(screen.queryAllByRole('button')).toHaveLength(3);
  userEvent.keyboard('{ArrowLeft}');
  userEvent.keyboard('{ArrowLeft}');
  userEvent.keyboard('{Backspace}');
  expect(screen.queryAllByRole('button')).toHaveLength(2);
  userEvent.keyboard('{Backspace}');
  userEvent.keyboard('{Backspace}');
  expect(screen.queryAllByRole('button')).toHaveLength(0);
});

test('Click Checkbox', async () => {
  render(<App />);
  // ACT
  userEvent.click(screen.getByPlaceholderText('Select...'));
  await screen.findAllByRole('img');

  userEvent.click(screen.getAllByRole('checkbox')[0]);
  expect(screen.queryAllByRole('button')).toHaveLength(1);
  userEvent.click(screen.getAllByRole('checkbox')[0]);
  expect(screen.queryAllByRole('button')).toHaveLength(0);
});
