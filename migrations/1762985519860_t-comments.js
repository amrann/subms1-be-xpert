/* eslint-disable camelcase */

exports.up = (pgm) => {
	pgm.createTable('t_comments', {
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true
		},
      content: {
			type: 'VARCHAR(255)',
			notNull: true
		},
      timestamp: {
			type: 'timestamp',
			default: pgm.func('current_timestamp'),
			notNull: true
		},
		owner: {
			type: 'VARCHAR(50)',
			notNull: true,
			references: 'users(id)',
			onDelete: 'SET NULL',
		},
		thread_id: {
			type: 'VARCHAR(50)',
			notNull: true,
			references: 't_threads(id)',
			onDelete: 'SET NULL',
		}
	});
};

exports.down = (pgm) => {
	pgm.dropTable('t_comments');
};

exports.tags = ['comments-table'];

