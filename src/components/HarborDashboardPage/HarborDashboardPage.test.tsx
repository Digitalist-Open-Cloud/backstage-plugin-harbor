// HarborDashboardPage.test.tsx

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HarborDashboardPage } from './HarborDashboardPage';
import { EntityProvider } from '@backstage/plugin-catalog-react';

// Explicit mocks clearly set
jest.mock('../useHarborAppData', () => ({
  useHarborAppData: jest.fn(),
}));

jest.mock('../HarborRepository', () => ({
  HarborRepository: jest.fn(({ title }) => (
    <div data-testid="mock-harbor-repository">{title}</div>
  )),
}));

import { useHarborAppData } from '../useHarborAppData';

describe('HarborDashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test-component',
    },
  };

  it('renders a HarborRepository component per repositorySlug clearly explicitly', () => {
    (useHarborAppData as jest.Mock).mockReturnValue({
      repositorySlug: 'some-host/my-project1/my-repo1, my-project2/my-repo2',
    });

    render(
      <EntityProvider entity={mockEntity}>
        <HarborDashboardPage />
      </EntityProvider>,
    );

    // Verify correct rendering and props explicitly
    const repos = screen.getAllByTestId('mock-harbor-repository');
    expect(repos).toHaveLength(2);
    expect(repos[0]).toHaveTextContent('some-host/my-project1/my-repo1');
    expect(repos[1]).toHaveTextContent('my-project2/my-repo2');
  });

  it('handles empty repositorySlug gracefully explicitly clearly', () => {
    (useHarborAppData as jest.Mock).mockReturnValue({
      repositorySlug: '',
    });

    render(
      <EntityProvider entity={mockEntity}>
        <HarborDashboardPage />
      </EntityProvider>,
    );

    expect(screen.queryByTestId('mock-harbor-repository')).not.toBeInTheDocument();
  });
});