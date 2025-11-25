const RepliedUser = require('../../Domains/replies/entities/RepliedUser');

class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const repliedUser = new RepliedUser(useCasePayload);
    const { threadId, commentId, replyId, owner } = repliedUser;

    await this._threadRepository.checkThreadExist(threadId);
    await this._commentRepository.checkCommentExist(commentId);
    await this._replyRepository.checkOwnerOfReply(replyId, owner);
    
    return this._replyRepository.deleteReplyComment(replyId);
  }

}

module.exports = DeleteReplyUseCase;
