class GetThreadDetailUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    await this._threadRepository.checkThreadExist(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);

    const comments = await this._threadRepository.getCommentsByThreadId(threadId);
    const commentIds = comments.map(c => c.id);

    const replies = await this._threadRepository.getRepliesByThreadId(threadId);

    const likes = await this._threadRepository.getLikeCountByCommentIds(commentIds);

    const likeMap = {};
    likes.forEach((item) => {
      likeMap[item.comment_id] = Number(item.like_count);
    });

    // 6. Rangkai replies ke comment masing-masing
    const commentWithReplies = comments.map((comment) => ({
      ...comment,
      likeCount: likeMap[comment.id] || 0,
      replies: replies.filter(r => r.comment_id === comment.id)
                      .map(r => ({
                        id: r.id,
                        content: r.is_deleted ? '**balasan telah dihapus**' : r.content,
                        date: r.date,
                        username: r.username,
                      })),
      content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
    }));

    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: commentWithReplies,
    };

  }
}

module.exports = GetThreadDetailUseCase;
