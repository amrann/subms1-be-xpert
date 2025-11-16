const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

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
    const { thread, comments } = await getThreadDetailUseCase.execute(threadId);

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
        content: comment.content
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
}


module.exports = ThreadsHandler;
