const AddReplyCommentUseCase = require('../../../../Applications/use_case/AddReplyCommentUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;
  }

  async postReplyHandler(request, h) {
    const addReplyCommentUseCase = this._container.getInstance(AddReplyCommentUseCase.name);
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    const addedReply = await addReplyCommentUseCase.execute({
      ...request.payload,
      owner,
      threadId,
      commentId
    })
    const response = h.response({
      status: 'success',
      data: {
        addedReply
      }
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyCommentUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const { threadId, commentId, replyId } = request.params;
    const { id: owner } = request.auth.credentials;
    await deleteReplyCommentUseCase.execute({
      threadId, 
      commentId,
      replyId,
      owner
    });

    const response = h.response({
      status: 'success'
    })
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
