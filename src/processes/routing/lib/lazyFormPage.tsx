import { lazy, type ComponentType } from 'react'

type FormPageMode = 'create' | 'edit'
type FormPageComponent = ComponentType<{ mode: FormPageMode }>

export const lazyFormPage = (
  load: () => Promise<{ FormPage: FormPageComponent }>,
  mode: FormPageMode,
) =>
  lazy(() =>
    load().then(({ FormPage }) => ({
      default: () => <FormPage mode={mode} />,
    })),
  )
