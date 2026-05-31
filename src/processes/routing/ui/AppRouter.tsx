import { lazy, Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Spin } from 'antd'

import { PreventDirectAccessGuard } from '@features/auth-by-email'
import { AppRoutes } from '@shared/config'
import { HeaderLayout } from '@widgets/header-layout'

import { lazyFormPage } from '../lib/lazyFormPage'

const LoginPage = lazy(() =>
  import('@pages/login').then((module) => ({ default: module.LoginPage })),
)

const PostsPage = lazy(() =>
  import('@pages/posts').then((module) => ({ default: module.PostsPage })),
)

const PostCreatePage = lazyFormPage(
  () => import('@pages/posts').then((module) => ({ FormPage: module.PostFormPage })),
  'create',
)

const PostEditPage = lazyFormPage(
  () => import('@pages/posts').then((module) => ({ FormPage: module.PostFormPage })),
  'edit',
)

const TagsPage = lazy(() =>
  import('@pages/tags').then((module) => ({ default: module.TagsPage })),
)

const TagCreatePage = lazyFormPage(
  () => import('@pages/tags').then((module) => ({ FormPage: module.TagFormPage })),
  'create',
)

const TagEditPage = lazyFormPage(
  () => import('@pages/tags').then((module) => ({ FormPage: module.TagFormPage })),
  'edit',
)

const AuthorsPage = lazy(() =>
  import('@pages/authors').then((module) => ({ default: module.AuthorsPage })),
)

const AuthorCreatePage = lazyFormPage(
  () => import('@pages/authors').then((module) => ({ FormPage: module.AuthorFormPage })),
  'create',
)

const AuthorEditPage = lazyFormPage(
  () => import('@pages/authors').then((module) => ({ FormPage: module.AuthorFormPage })),
  'edit',
)

const PostDetailsPage = lazy(() =>
  import('@pages/post-details').then((module) => ({
    default: module.PostDetailsPage,
  })),
)

export const AppRouter = () => (
  <Suspense fallback={<Spin size="large" />}>
    <Switch>
      <Route exact path={AppRoutes.login} component={LoginPage} />
      <Route>
        <HeaderLayout>
          <Switch>
            <PreventDirectAccessGuard
              exact
              path={AppRoutes.root}
              render={() => <Redirect to={AppRoutes.posts} />}
            />
            <PreventDirectAccessGuard exact path={AppRoutes.posts} component={PostsPage} />
            <PreventDirectAccessGuard exact path={AppRoutes.postsCreate} component={PostCreatePage} />
            <PreventDirectAccessGuard exact path={AppRoutes.postEdit} component={PostEditPage} />
            <PreventDirectAccessGuard exact path={AppRoutes.tags} component={TagsPage} />
            <PreventDirectAccessGuard exact path={AppRoutes.tagsCreate} component={TagCreatePage} />
            <PreventDirectAccessGuard exact path={AppRoutes.tagEdit} component={TagEditPage} />
            <PreventDirectAccessGuard exact path={AppRoutes.authors} component={AuthorsPage} />
            <PreventDirectAccessGuard
              exact
              path={AppRoutes.authorsCreate}
              component={AuthorCreatePage}
            />
            <PreventDirectAccessGuard exact path={AppRoutes.authorEdit} component={AuthorEditPage} />
            <PreventDirectAccessGuard
              exact
              path={AppRoutes.postDetails}
              component={PostDetailsPage}
            />
            <PreventDirectAccessGuard render={() => <Redirect to={AppRoutes.posts} />} />
          </Switch>
        </HeaderLayout>
      </Route>
    </Switch>
  </Suspense>
)
