// HarborWidget.test.tsx

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HarborWidget } from './HarborWidget';
import { TestApiProvider } from '@backstage/test-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';

jest.mock('../useHarborAppData', () => ({
  useHarborAppData: jest.fn(),
  HARBOR_ANNOTATION_REPOSITORY: 'harbor.repository',
}));

jest.mock('../../plugin', () => ({
  isHarborAvailable: jest.fn(),
}));

jest.mock('../HarborRepository', () => ({
  HarborRepository: () => <div data-testid="mock-harbor-repository" />,
}));

jest.mock('@backstage/plugin-catalog-react', () => ({
  ...jest.requireActual('@backstage/plugin-catalog-react'),
  MissingAnnotationEmptyState: ({ annotation }: { annotation: string }) => (
    <div data-testid="mock-missing-annotation-empty-state">
      Missing annotation: {annotation}
    </div>
  ),
}));

import { useHarborAppData } from '../useHarborAppData';
import { isHarborAvailable } from '../../plugin';

describe('HarborWidget', () => {
  const entityWithAnnotation: Entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test-component',
      annotations: {
        'harbor.repository': 'some-host/my-project/my-repo',
      },
    },
  };

  const entityWithoutAnnotation: Entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'no-annotation-component',
      annotations: {},
    },
  };

  beforeEach(() => {
    (useHarborAppData as jest.Mock).mockReturnValue({
      repositorySlug: 'some-host/my-project/my-repo',
    });
    jest.clearAllMocks();
  });

  it('renders MissingAnnotationEmptyState when annotation is missing', async () => {
    (isHarborAvailable as jest.Mock).mockReturnValue(false);

    render(
      <TestApiProvider apis={[[catalogApiRef, {}]]}>
        <EntityProvider entity={entityWithoutAnnotation}>
          <HarborWidget />
        </EntityProvider>
      </TestApiProvider>,
    );

    expect(
      await screen.findByTestId('mock-missing-annotation-empty-state'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Missing annotation: harbor.repository/i),
    ).toBeInTheDocument();
  });

  it('renders HarborRepository when annotation is present', async () => {
    (isHarborAvailable as jest.Mock).mockReturnValue(true);

    render(
      <TestApiProvider apis={[[catalogApiRef, {}]]}>
        <EntityProvider entity={entityWithAnnotation}>
          <HarborWidget />
        </EntityProvider>
      </TestApiProvider>,
    );

    expect(await screen.findByTestId('mock-harbor-repository')).toBeInTheDocument();
  });
});