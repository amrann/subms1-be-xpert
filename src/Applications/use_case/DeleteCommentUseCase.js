const CommentedUser = require('../../Domains/comments/entities/CommentedUser');

class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const commentedUser = new CommentedUser(useCasePayload);
    const { threadId, commentId, owner } = commentedUser;

    await this._threadRepository.checkThreadExist(threadId);
    await this._commentRepository.checkOwnerOfComment(commentId, owner);
    
    return this._commentRepository.deleteCommentThread(commentId);
  }

}

module.exports = DeleteCommentUseCase;
