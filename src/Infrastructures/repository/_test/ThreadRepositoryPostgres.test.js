const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadUser = require('../../../Domains/threads/entities/ThreadUser');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should return thread user correctly', async () => {

      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdUserGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdUserGenerator);

      await userRepositoryPostgres.addUser(registerUser);

      const threadUser = new ThreadUser({
        title: 'title dari thread',
        body: 'body dari thread',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123',
      });
      const fakeIdThreadGenerator = () => 'xWy123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdThreadGenerator);

      await threadRepositoryPostgres.addThread(threadUser);

      const thread = await ThreadsTableTestHelper.findThreadsById('thread-xWy123');
      expect(thread).toHaveLength(1);

    });
  });
});