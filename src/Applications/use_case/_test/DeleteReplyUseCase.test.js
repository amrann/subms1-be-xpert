const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrate the delete reply of comment thread action correctly', async () => {
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-234',
      commentId: 'comment-567',
      replyId: 'reply-789'
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.checkThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkOwnerOfReply = jest.fn()
      .mockImplementation(() => Promise.resolve());  
    mockReplyRepository.deleteReplyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    });

    await deleteReplyUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkThreadExist).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentExist).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.checkOwnerOfReply).toHaveBeenCalledWith(useCasePayload.replyId, useCasePayload.owner);
    expect(mockReplyRepository.deleteReplyComment).toHaveBeenCalledWith(useCasePayload.replyId);
  });
});
