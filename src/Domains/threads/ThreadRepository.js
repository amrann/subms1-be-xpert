class ThreadRepository {
	async addThread(threadUser) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addComment(commentUser) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async checkThreadExist(id) {
    throw new Error('THREAD_USER.NOT_FOUND');
  }
}
module.exports = ThreadRepository;
