export const AppRoutes = {
  root: '/',
  login: '/login',
  posts: '/posts',
  postsCreate: '/posts/create',
  postEdit: '/posts/:postId/edit',
  tags: '/tags',
  tagsCreate: '/tags/create',
  tagEdit: '/tags/:tagId/edit',
  authors: '/authors',
  authorsCreate: '/authors/create',
  authorEdit: '/authors/:authorId/edit',
  postDetails: '/posts/:postId',
} as const
