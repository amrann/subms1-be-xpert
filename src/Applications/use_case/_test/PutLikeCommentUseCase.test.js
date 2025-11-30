const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeCommentRepository = require('../../../Domains/likes/LikeCommentRepository');
const PutLikeCommentUseCase = require('../PutLikeCommentUseCase');

describe('PutLikeCommentUseCase', () => {
  it('should orchestrate the unlike flow correctly when comment already liked', async () => {
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123'
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    // Mock dependency methods
    mockThreadRepository.checkThreadExist = jest.fn().mockResolvedValue();
    mockCommentRepository.checkCommentExist = jest.fn().mockResolvedValue();
    mockLikeCommentRepository.checkCommentLike = jest.fn().mockResolvedValue(true);
    mockLikeCommentRepository.deleteLikeComment = jest.fn().mockResolvedValue();
    mockLikeCommentRepository.putLikeComment = jest.fn();

    const putLikeCommentUseCase = new PutLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeCommentRepository: mockLikeCommentRepository
    });

     // Act
    await putLikeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkThreadExist).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentExist).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeCommentRepository.checkCommentLike)
      .toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.commentId);
    expect(mockLikeCommentRepository.deleteLikeComment)
      .toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.commentId);
    expect(mockLikeCommentRepository.putLikeComment).not.toHaveBeenCalled();
  });

  it('should orchestrate the like flow correctly when comment not yet like', async () => {
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123'
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    // Mock dependency methods
    mockThreadRepository.checkThreadExist = jest.fn().mockResolvedValue();
    mockCommentRepository.checkCommentExist = jest.fn().mockResolvedValue();
    mockLikeCommentRepository.checkCommentLike = jest.fn().mockResolvedValue(false);
    mockLikeCommentRepository.deleteLikeComment = jest.fn().mockResolvedValue();
    mockLikeCommentRepository.putLikeComment = jest.fn().mockResolvedValue({ id: 'like-123' });;

    const putLikeCommentUseCase = new PutLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeCommentRepository: mockLikeCommentRepository
    });

     // Act
    await putLikeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkThreadExist).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentExist).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeCommentRepository.checkCommentLike)
      .toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.commentId);
    expect(mockLikeCommentRepository.putLikeComment)
      .toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.threadId, useCasePayload.commentId);
    expect(mockLikeCommentRepository.deleteLikeComment).not.toHaveBeenCalled();
  });
});
