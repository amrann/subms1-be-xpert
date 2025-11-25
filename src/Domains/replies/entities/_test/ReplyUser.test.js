const ReplyUser = require('../ReplyUser');

describe('a ReplyUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'test content'
    };

    expect(() => new ReplyUser(payload)).toThrowError('REPLY_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {

    const payload = {
      content: 2345,
      owner: "owner-123",
      threadId: "thread-asw",
      commentId: 3434
    };

    expect(() => new ReplyUser(payload)).toThrowError('REPLY_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
