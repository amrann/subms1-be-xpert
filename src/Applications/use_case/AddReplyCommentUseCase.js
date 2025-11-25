const ReplyUser = require('../../Domains/replies/entities/ReplyUser');

class AddReplyCommentUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const replyUser = new ReplyUser(useCasePayload);
    const { threadId, commentId } = replyUser;

    await this._threadRepository.checkThreadExist(threadId);
    await this._commentRepository.checkCommentExist(commentId);

    return this._replyRepository.addReply(replyUser);
  }
}

module.exports = AddReplyCommentUseCase;
