import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import RoomList from './components/RoomList';
import type { Room } from './lib/types';

const room: Room = {
  id: 'demo',
  name: 'Demo Room',
  building: 'Demo Building',
  capacity: 12,
  blocked: false,
  bookings: [{ id: 'b1', start: 600, end: 660, bookedBy: 'Demo booking' }],
};

test('R1: selection and blocked controls are not nested buttons', () => {
  const markup = renderToStaticMarkup(
    <RoomList rooms={[room]} selectedRoomId={room.id} onSelect={() => {}} onToggleBlocked={() => {}} />,
  );

  expect(markup.match(/<button\b/g)).toHaveLength(2);
  expect(markup).toContain('Toggle blocked status for Demo Room');
  expect(markup).not.toMatch(/<button\b[^>]*>(?:(?!<\/button>).)*<button\b/s);
});
