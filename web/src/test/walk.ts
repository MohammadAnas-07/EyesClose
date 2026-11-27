import { fireEvent, screen, within } from '@testing-library/react';
import axe from 'axe-core';

// jsdom cannot compute colours, so contrast is checked in a real browser instead (see the PR).
export async function expectNoAxeViolations() {
  const result = await axe.run(document.body, { rules: { 'color-contrast': { enabled: false } } });
  expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
}

export const next = () => fireEvent.click(screen.getByRole('button', { name: /Next question|See my checklist/ }));
export const pick = (label: string) => fireEvent.click(screen.getByLabelText(label));
export const pickIn = (group: string, label: string) =>
  fireEvent.click(within(screen.getByRole('group', { name: group })).getByLabelText(label));

/** Answers all 10 questions with a fixed, fake case. */
export function answerAll() {
  fireEvent.click(screen.getByRole('button', { name: 'Start the questions' }));
  fireEvent.change(screen.getByLabelText('What was their full name?'), { target: { value: 'Test Name Markerone' } });
  next();
  pick('Daughter');
  next();
  pick('Not yet');
  next();
  pick('SBI');
  pick('Another bank');
  next();
  pickIn('Was any bank account joint?', 'Yes');
  pickIn('Did they name a nominee?', 'No');
  pickIn('Did they leave a will?', 'Not sure');
  next();
  pick('Jio');
  next();
  pick('PhonePe');
  next();
  pick('Private job with provident fund (EPFO)');
  next();
  for (const g of ['Life insurance', 'Health insurance', 'A vehicle and its insurance', 'Any loan or credit card'])
    pickIn(g, 'No');
  next();
  pickIn('Email or social media accounts', 'Yes');
  pickIn('Paid subscriptions', 'No');
  pickIn('Crypto or online investments', 'Not sure');
  next();
}
