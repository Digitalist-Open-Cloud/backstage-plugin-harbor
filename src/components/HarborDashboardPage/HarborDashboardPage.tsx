import { useEntity } from '@backstage/plugin-catalog-react'
import { HarborRepository } from '../HarborRepository'
import { useHarborAppData } from '../useHarborAppData'
import { Grid } from '@material-ui/core'

export const HarborDashboardPage = () => {
  const { entity } = useEntity()
  const { repositorySlug } = useHarborAppData({ entity })

  return (
    <Grid container spacing={3}>
      {repositorySlug.split(', ').filter(Boolean).map(slug => {
        const info = slug.split('/');
        const host: string = info.length > 2 ? (info.shift() as string) : '';
        const project: string = info.shift() as string;
        const repository: string = info.join('/');
        const key = [host, project, repository].join('/');

        return (
          <Grid item xs={12} key={key}>
            <HarborRepository
              title={`${host}${host ? '/' : ''}${project}/${repository}`}
              host={host}
              project={project}
              repository={repository}
              widget={false}
            />
          </Grid>
        );
      })}
    </Grid>
  )
}
