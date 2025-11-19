const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const AddReplyCommentUseCase = require('../../../../Applications/use_case/AddReplyCommentUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: owner } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute({
      ...request.payload,
      owner
    });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { threadId } = request.params;
    const { id: owner } = request.auth.credentials;
    const addedComment = await addCommentUseCase.execute({
      ...request.payload,
      owner,
      threadId,
    })
    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    });
    response.code(201);
    return response;
  }

  async getThreadDetailHandler(request, h) {
    const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
    const { threadId } = request.params;
    const { thread, comments, replies } = await getThreadDetailUseCase.execute(threadId);

    const mappedThread = {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: comments.map(comment => ({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
        replies: replies
          .filter(reply => reply.comment_id === comment.id)
          .map(reply => ({
            id: reply.id,
            content: reply.is_deleted ? '**balasan telah dihapus**' : reply.content,
            date: reply.date,
            username: reply.username
          }))
      }))
    };

    const response = h.response({
      status: 'success',
      data: {
        thread: mappedThread
      }
    });
    response.code(200);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    await deleteCommentUseCase.execute({
      threadId, 
      commentId,
      owner
    });

    const response = h.response({
      status: 'success'
    })
    response.code(200);
    return response;
  }

  async postReplyCommentHandler(request, h) {
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

  async deleteReplyCommentHandler(request, h) {
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

module.exports = ThreadsHandler;
