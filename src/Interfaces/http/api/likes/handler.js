const PutLikeCommentUseCase = require('../../../../Applications/use_case/PutLikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
  }

  async putLikeHandler(request, h) {
    const putLikeCommentUseCase = this._container.getInstance(PutLikeCommentUseCase.name);
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    await putLikeCommentUseCase.execute({
      owner,
      threadId,
      commentId
    })
    const response = h.response({
      status: 'success'
    });
    response.code(200);
    return response;
  }

}

module.exports = LikesHandler;
