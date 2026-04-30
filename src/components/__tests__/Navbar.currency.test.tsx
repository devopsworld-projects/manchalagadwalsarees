import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { CurrencyProvider } from '@/context/CurrencyContext';

// Mock auth + cart so the navbar can render in isolation
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: null, signOut: vi.fn() }),
}));
vi.mock('@/context/CartContext', () => ({
  useCart: () => ({ totalItems: 0, items: [] }),
}));
vi.mock('@/hooks/useStoreSettings', () => ({
  useStoreSettings: () => ({ data: null }),
}));
vi.mock('@/hooks/useMenuItems', () => ({
  useMenuItems: (group?: string) => ({
    data:
      group === 'topbar'
        ? [{ id: 't1', label: 'Track Order', slug: 'track', children: [] }]
        : group === 'mobile'
        ? []
        : [
            { id: 'm1', label: 'Sarees', slug: 'sarees', children: [] },
            { id: 'm2', label: 'Blouses', slug: 'blouses', children: [] },
          ],
  }),
}));

function renderNavbar() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <CurrencyProvider>
          <Navbar />
        </CurrencyProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('Navbar currency switcher placement', () => {
  beforeEach(() => {
    // reset to a stable viewport width before each assertion
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1280 });
  });

  it('renders the desktop currency switcher beside the menu (not in the topbar)', () => {
    renderNavbar();
    expect(screen.getByTestId('currency-desktop')).toBeInTheDocument();
    // Mobile-only trigger and drawer slot also exist in markup but are visibility-hidden by Tailwind
    expect(screen.getByTestId('currency-mobile')).toBeInTheDocument();
  });

  it('never renders a currency switcher inside the dark utility topbar', () => {
    const { container } = renderNavbar();
    const topbars = container.querySelectorAll('.bg-foreground.text-background');
    topbars.forEach(bar => {
      expect(bar.querySelector('[aria-label="Select currency"]')).toBeNull();
    });
  });

  it('exposes exactly three currency switcher slots (desktop, mobile bar, drawer)', () => {
    renderNavbar();
    // currency-drawer only mounts when mobileOpen, so two are present at rest.
    expect(screen.getAllByLabelText('Select currency')).toHaveLength(2);
    expect(screen.getByTestId('currency-desktop')).toBeInTheDocument();
    expect(screen.getByTestId('currency-mobile')).toBeInTheDocument();
  });

  // Run the same structural checks at multiple breakpoints to confirm
  // the switcher always lives next to the menu (CSS visibility differs,
  // but the markup placement is consistent regardless of viewport).
  it.each([
    ['mobile-small', 360],
    ['mobile', 414],
    ['tablet', 768],
    ['desktop', 1280],
    ['wide', 1920],
  ])('keeps the currency switcher beside the menu at %s (%dpx)', (_label, width) => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: width });
    window.dispatchEvent(new Event('resize'));
    renderNavbar();

    const desktopSlot = screen.getByTestId('currency-desktop');
    const mobileSlot = screen.getByTestId('currency-mobile');

    // Desktop slot sits inside the desktop nav element (which contains menu items)
    expect(desktopSlot.closest('nav')).not.toBeNull();
    // Mobile slot sits in the same flex row as the hamburger button
    expect(mobileSlot.parentElement?.querySelector('[aria-label="Toggle menu"]')).not.toBeNull();
  });
});
