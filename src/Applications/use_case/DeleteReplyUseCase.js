const RepliedUser = require('../../Domains/threads/entities/RepliedUser');

class DeleteReplyUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const repliedUser = new RepliedUser(useCasePayload);
    const { threadId, commentId, replyId, owner } = repliedUser;

    await this._threadRepository.checkThreadExist(threadId);
    await this._threadRepository.checkCommentExist(commentId);
    await this._threadRepository.checkOwnerOfReply(replyId, owner);
    
    return this._threadRepository.deleteReplyComment(replyId);
  }

}

module.exports = DeleteReplyUseCase;
