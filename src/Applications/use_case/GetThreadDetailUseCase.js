class GetThreadDetailUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    await this._threadRepository.checkThreadExist(threadId);

    const { thread, comments, replies, likes } = await this._threadRepository.getDetailThread(threadId);

    const likeCounts = {};
    likes.forEach(like => {
      likeCounts[like.comment_id] = Number(like.like_count);
    });

    const mappedThread = {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: comments.map(comment => ({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
        likeCount: likeCounts[comment.id] || 0,
        replies: replies
          .filter(reply => reply.comment_id === comment.id)
          .map(reply => ({
            id: reply.id,
            content: reply.is_deleted ? '**balasan telah dihapus**' : reply.content,
            date: reply.date,
            username: reply.username
          }))
      }))
    };
    return mappedThread;
  }
}

module.exports = GetThreadDetailUseCase;
