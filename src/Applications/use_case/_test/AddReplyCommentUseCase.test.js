const ReplyUser = require('../../../Domains/replies/entities/ReplyUser');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyCommentUseCase = require('../AddReplyCommentUseCase');

describe('AddReplyCommentUseCase', () => {
  it('should orchestrate the add reply of comment thread action correctly', async () => {
    const useCasePayload = {
      content: 'content of comment',
      owner: 'user-123',
      threadId: 'thread-234',
      commentId: 'comment-456'
    };

    const mockAddedReply = new ReplyUser({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId
    });

    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    const addReplyCommentUseCase = new AddReplyCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    });

    const addedReply = await addReplyCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentExist).toBeCalledWith(useCasePayload.commentId);
    expect(addedReply).toStrictEqual(new ReplyUser({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId
    }));
    expect(mockReplyRepository.addReply)
      .toBeCalledWith(new ReplyUser({
        content: useCasePayload.content,
        owner: useCasePayload.owner,
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId
      }));
    expect(mockReplyRepository.addReply).toHaveBeenCalledTimes(1);
  });
});
