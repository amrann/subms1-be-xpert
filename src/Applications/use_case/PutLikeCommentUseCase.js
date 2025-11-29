const LikeComment = require('../../Domains/likes/entities/LikeComment');

class PutLikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeCommentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeCommentRepository = likeCommentRepository;
  }

  async execute(useCasePayload) {
    const likeComment = new LikeComment(useCasePayload);
    await this._threadRepository.checkThreadExist(likeComment.threadId);
    await this._commentRepository.checkCommentExist(likeComment.commentId);

    return this._likeCommentRepository.likeUnlikeComment(likeComment);
  }
}

module.exports = PutLikeCommentUseCase;