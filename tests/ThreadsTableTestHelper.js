const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-defaultId123', 
    title = 'default title dari thread', 
    body = 'default body dari thread', 
    timestamp = '2025-11-09 03:31:59.941', 
    owner = 'user-defaultId123'
  }) {
    const query = {
      text: 'INSERT INTO t_threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, timestamp, owner],
    };

    await pool.query(query);
  },
  
  async findThreadsById(id) {
    const query = {
      text: 'SELECT * FROM t_threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM t_threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;