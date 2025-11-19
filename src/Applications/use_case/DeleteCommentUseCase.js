const CommentedUser = require('../../Domains/threads/entities/CommentedUser');

class DeleteCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const commentedUser = new CommentedUser(useCasePayload);
    const { threadId, commentId, owner } = commentedUser;

    await this._threadRepository.checkThreadExist(threadId);
    await this._threadRepository.checkOwnerOfComment(commentId, owner);
    
    return this._threadRepository.deleteCommentThread(commentId);
  }

}

module.exports = DeleteCommentUseCase;
