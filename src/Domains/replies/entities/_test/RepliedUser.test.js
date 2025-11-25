const RepliedUser = require('../RepliedUser');

describe('a RepliedUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      replyId: 'reply-345'
    };

    expect(() => new RepliedUser(payload)).toThrowError('REPLY_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {

    const payload = {
      replyId: 2345,
      owner: "owner-123",
      threadId: "thread-asw",
      commentId: 3434
    };

    expect(() => new RepliedUser(payload)).toThrowError('REPLY_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});