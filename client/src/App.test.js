import React from 'react';
import { render, screen, wait, cleanup } from "@testing-library/react";
import App from './App';

var dom;

beforeEach(() => {
  dom = render(<App />);
});

test("Fetch country", async () => {
  await wait(() => expect(screen.getByText("You are in United States")).toBeInTheDocument());
});

test("Ensure amount input is 0", async () => {
  var input = dom.getByLabelText('amountInput');
  expect(input.value).toBe('0');
});
