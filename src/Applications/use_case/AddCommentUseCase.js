const CommentUser = require('../../Domains/threads/entities/CommentUser');

class AddCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const commentUser = new CommentUser(useCasePayload);
    await this._threadRepository.checkThreadExist(commentUser.threadId);

    return this._threadRepository.addComment(commentUser);
  }
}

module.exports = AddCommentUseCase;
