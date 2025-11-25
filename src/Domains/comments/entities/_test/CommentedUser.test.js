const CommentedUser = require('../CommentedUser');

describe('a ReplyUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      threadId: "thread-eqw3"
    };

    expect(() => new CommentedUser(payload)).toThrowError('COMMENTED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {

    const payload = {
      threadId: 2345,
      owner: "owner-123",
      commentId: "comment-sqww3"
    };

    expect(() => new CommentedUser(payload)).toThrowError('COMMENTED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
