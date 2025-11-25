const CommentUser = require('../../Domains/comments/entities/CommentUser');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const commentUser = new CommentUser(useCasePayload);
    await this._threadRepository.checkThreadExist(commentUser.threadId);

    return this._commentRepository.addComment(commentUser);
  }
}

module.exports = AddCommentUseCase;
