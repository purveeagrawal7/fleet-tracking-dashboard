import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import useWebSocket from './useWebSocket';

// Tell React 19 it is running inside a test so act() flushes state updates
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function HookWrapper({ onUpdate, onResult }) {
  const result = useWebSocket(onUpdate);
  onResult(result);
  return null;
}

class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.onopen = null;
    this.onmessage = null;
    this.onerror = null;
    this.onclose = null;
    MockWebSocket.instances.push(this);
  }
  close() {}
}
MockWebSocket.instances = [];

let container;
let root;

beforeEach(() => {
  MockWebSocket.instances = [];
  global.WebSocket = MockWebSocket;
  jest.useFakeTimers();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => { root.unmount(); });
  container.remove();
  jest.useRealTimers();
});

function renderHook(onUpdate) {
  // Mutate the same object so destructured references stay live across re-renders
  const result = {};
  act(() => {
    root.render(
      <HookWrapper onUpdate={onUpdate} onResult={(r) => { Object.assign(result, r); }} />
    );
  });
  const rerender = (newOnUpdate) => {
    act(() => {
      root.render(
        <HookWrapper onUpdate={newOnUpdate} onResult={(r) => { Object.assign(result, r); }} />
      );
    });
  };
  return { result, rerender };
}

describe('useWebSocket', () => {
  it('starts with wsConnected false', () => {
    const { result } = renderHook(jest.fn());
    expect(result.wsConnected).toBe(false);
  });

  it('sets wsConnected to true when socket opens', () => {
    const { result } = renderHook(jest.fn());
    const ws = MockWebSocket.instances[0];

    act(() => { ws.onopen(); });

    expect(result.wsConnected).toBe(true);
  });

  it('sets wsConnected to false on error', () => {
    const { result } = renderHook(jest.fn());
    const ws = MockWebSocket.instances[0];

    act(() => { ws.onopen(); });
    act(() => { ws.onerror(); });

    expect(result.wsConnected).toBe(false);
  });

  it('calls onUpdate with parsed message data', () => {
    const onUpdate = jest.fn();
    renderHook(onUpdate);
    const ws = MockWebSocket.instances[0];

    act(() => {
      ws.onmessage({ data: JSON.stringify({ id: '1', speed: 60 }) });
    });

    expect(onUpdate).toHaveBeenCalledWith({ id: '1', speed: 60 });
  });

  it('ignores non-JSON messages without throwing', () => {
    const onUpdate = jest.fn();
    renderHook(onUpdate);
    const ws = MockWebSocket.instances[0];

    expect(() => {
      act(() => { ws.onmessage({ data: 'not-json' }); });
    }).not.toThrow();

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('reconnects after socket closes with a 5s delay', () => {
    renderHook(jest.fn());
    expect(MockWebSocket.instances.length).toBe(1);

    act(() => { MockWebSocket.instances[0].onclose(); });
    act(() => { jest.advanceTimersByTime(5000); });

    expect(MockWebSocket.instances.length).toBe(2);
  });

  it('uses the latest onUpdate callback without reconnecting', () => {
    const first = jest.fn();
    const second = jest.fn();
    const { rerender } = renderHook(first);
    const ws = MockWebSocket.instances[0];
    const countBefore = MockWebSocket.instances.length;

    rerender(second);

    act(() => {
      ws.onmessage({ data: JSON.stringify({ id: '2' }) });
    });

    expect(second).toHaveBeenCalledWith({ id: '2' });
    expect(first).not.toHaveBeenCalled();
    expect(MockWebSocket.instances.length).toBe(countBefore);
  });

  it('closes the socket on unmount', () => {
    renderHook(jest.fn());
    const ws = MockWebSocket.instances[0];
    const closeSpy = jest.spyOn(ws, 'close');

    act(() => { root.unmount(); });

    expect(closeSpy).toHaveBeenCalled();
  });
});
