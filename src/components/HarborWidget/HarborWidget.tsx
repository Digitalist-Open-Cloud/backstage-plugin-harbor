import { Entity } from '@backstage/catalog-model'
import { MissingAnnotationEmptyState } from '@backstage/plugin-catalog-react'
import { useEntity } from '@backstage/plugin-catalog-react'
import { Grid } from '@material-ui/core'
import { isHarborAvailable } from '../../plugin'
import { HarborRepository } from '../HarborRepository'
import {
  HARBOR_ANNOTATION_REPOSITORY,
  useHarborAppData,
} from '../useHarborAppData'
import { InfoCard } from '@backstage/core-components'

const Widget = ({ entity }: { entity: Entity, width?: number, height?: number }) => {
  const { repositorySlug } = useHarborAppData({ entity })

  return (
    <InfoCard title="Vulnerabilities in latest image" variant="gridItem">
      <Grid item xs={12}>
        {repositorySlug.split(', ').map(slug => {
          const info = slug.split('/');
          const host: string = info.length > 2 ? (info.shift() as string) : '';
          const project: string = info.shift() as string;
          const repository: string = info.join('/');
          const key = [host, project, repository].join('/');

          return (
            <Grid item xs={12} key={key}>
              <HarborRepository
                host={host}
                project={project}
                repository={repository}
                widget
              />
            </Grid>
          );
        })}
      </Grid>
    </InfoCard>
  )
}

export const HarborWidget = (props: {
  width?: number;
  height?: number;
}) => {
  const { entity } = useEntity()

  return !isHarborAvailable(entity) ? (
    <MissingAnnotationEmptyState annotation={HARBOR_ANNOTATION_REPOSITORY} />
  ) : (
    <Widget entity={entity} width={props.width} height={props.height} />
  )
}

export const HarborWidgetEntity = ({ entity, width, height }: { entity: Entity, width?: number, height?: number }) => {
  return !isHarborAvailable(entity) ? (
    <MissingAnnotationEmptyState annotation={HARBOR_ANNOTATION_REPOSITORY} />
  ) : (
    <Widget entity={entity} width={width} height={height} />
  )
}
