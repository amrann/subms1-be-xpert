const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThreadHandler(request, h),
    options: {
			auth: 'forum_api_jwt'
		}
  },

  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: (request, h) => handler.postCommentHandler(request, h),
    options: {
			auth: 'forum_api_jwt'
		}
  }
]);

module.exports = routes;