const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate the get thread detail action correctly', async () => {
    const threadId = 'thread-123';

    const mockThread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2025-12-12T07:10:00.000Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-1',
        username: 'userA',
        content: 'Comment A',
        date: '2024-12-10',
        is_delete: false,
      },
      {
        id: 'comment-2',
        username: 'userB',
        content: 'Comment B',
        date: '2024-12-10',
        is_delete: true
      },
    ];

    const mockReplies = [
      {
        id: 'reply-1',
        comment_id: 'comment-1',
        username: 'userC',
        content: 'Reply A1',
        date: '2024-12-10',
        is_deleted: false,
      },
      {
        id: 'reply-2',
        comment_id: 'comment-2',
        username: 'userD',
        content: 'Reply B1',
        date: '2024-12-10',
        is_deleted: true
      },
    ];

    const mockLikes = [
      { comment_id: 'comment-1', like_count: '2' }
    ];

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkThreadExist = jest.fn().mockResolvedValue();
    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(mockThread);
    mockThreadRepository.getCommentsByThreadId = jest.fn().mockResolvedValue(mockComments);
    mockThreadRepository.getRepliesByThreadId = jest.fn().mockResolvedValue(mockReplies);
    mockThreadRepository.getLikeCountByCommentIds = jest.fn().mockResolvedValue(mockLikes);

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
    });

    const result = await getThreadDetailUseCase.execute(threadId);

    expect(mockThreadRepository.checkThreadExist).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockThreadRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockThreadRepository.getRepliesByThreadId).toBeCalledWith(threadId);
    expect(mockThreadRepository.getLikeCountByCommentIds)
      .toBeCalledWith(['comment-1', 'comment-2']);
    expect(result).toMatchObject({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2025-12-12T07:10:00.000Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-1',
          username: 'userA',
          content: 'Comment A',
          date: '2024-12-10',
          likeCount: 2,
          replies: [
            {
              id: 'reply-1',
              content: 'Reply A1',
              date: '2024-12-10',
              username: 'userC'
            }
          ]
        },
        {
          id: 'comment-2',
          username: 'userB',
          content: '**komentar telah dihapus**',
          date: '2024-12-10',
          likeCount: 0,
          replies: [
            {
              id: 'reply-2',
              content: '**balasan telah dihapus**',
              date: '2024-12-10',
              username: 'userD'
            }
          ]
        }
      ]
    });
  });
});