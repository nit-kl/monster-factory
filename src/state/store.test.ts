import { beforeEach, expect, test } from 'vitest';
import { useGameStore } from './store';
import { screens } from '../data/screens';
beforeEach(() => useGameStore.setState({ screen: 'factory' }));
test('工場から開始し、4画面すべてに切り替えられる', () => {
  expect(useGameStore.getState().screen).toBe('factory');
  expect(screens.map((s) => s.id)).toEqual(['factory', 'design', 'battle', 'story']);
  for (const screen of screens) {
    useGameStore.getState().setScreen(screen.id);
    expect(useGameStore.getState().screen).toBe(screen.id);
  }
});
