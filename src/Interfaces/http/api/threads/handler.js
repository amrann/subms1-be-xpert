const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

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
}

module.exports = ThreadsHandler;
