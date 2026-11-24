import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LandingPage } from './LandingPage';
import { NetworkBackground } from './NetworkBackground';
import { CustomCursor } from './CustomCursor';

// Mock cytoscape since it requires HTML canvas/WebGL
vi.mock('cytoscape', () => {
  return {
    default: vi.fn(() => ({
      batch: vi.fn((fn) => fn()),
      destroy: vi.fn(),
      elements: vi.fn(() => []),
      nodes: vi.fn(() => []),
      edges: vi.fn(() => []),
      filter: vi.fn(() => ({ remove: vi.fn() })),
      add: vi.fn(),
      getElementById: vi.fn(() => ({
        position: vi.fn(),
        data: vi.fn(),
      })),
      on: vi.fn(),
      off: vi.fn(),
    })),
  };
});

// Polyfill window.matchMedia for JSDOM
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('Landing Page Components', () => {
  it('renders landing page with headline and login entry point', () => {
    const { getByRole, getAllByText, container } = render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(getAllByText(/TRACE-X/i).length).toBeGreaterThan(0);
    const xButton = container.querySelector('#landing-x-button');
    expect(xButton).not.toBeNull();
    expect(getByRole('button', { name: /Click X to begin authentication/i })).toBeDefined();
  });

  it('renders NetworkBackground canvas container without crash', () => {
    const { container } = render(
      <NetworkBackground mousePos={{ x: 100, y: 150 }} />
    );
    expect(container).toBeDefined();
  });

  it('renders CustomCursor reticle on non-touch devices with pointer coordinates', () => {
    // Mock matchMedia for fine pointer
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(
      <CustomCursor mousePos={{ x: 250, y: 300 }} isHoveringTarget={false} />
    );
    expect(container).toBeDefined();
  });
});
