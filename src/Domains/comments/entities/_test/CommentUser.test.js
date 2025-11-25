const CommentUser = require('../CommentUser');

describe('a ReplyUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'test content'
    };

    expect(() => new CommentUser(payload)).toThrowError('COMMENT_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {

    const payload = {
      content: 2345,
      owner: "owner-123",
      threadId: "thread-eqw3"
    };

    expect(() => new CommentUser(payload)).toThrowError('COMMENT_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
