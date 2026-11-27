import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import RoomList from './components/RoomList';
import Timeline from './components/Timeline';
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

test('R2: a reversed interval renders no candidate timeline block', () => {
  const reversed = renderToStaticMarkup(
    <Timeline room={room} candidateStart={750} candidateEnd={720} available={false} />,
  );
  const valid = renderToStaticMarkup(
    <Timeline room={room} candidateStart={660} candidateEnd={720} available={true} />,
  );

  const equal = renderToStaticMarkup(
    <Timeline room={room} candidateStart={720} candidateEnd={720} available={false} />,
  );
  const missing = renderToStaticMarkup(
    <Timeline room={room} candidateStart={null} candidateEnd={720} available={null} />,
  );
  const midnight = renderToStaticMarkup(
    <Timeline room={room} candidateStart={0} candidateEnd={30} available={false} />,
  );

  expect(reversed).not.toContain('width:-');
  expect(reversed).not.toContain('12:30–12:00 Your request');
  expect(equal).not.toContain('12:00–12:00 Your request');
  expect(missing).not.toContain('Your request"');
  expect(valid).toContain('11:00–12:00 Your request');
  expect(midnight).toContain('00:00–00:30 Your request');
  expect(reversed).toContain('10:00–11:00 Demo booking');
});
