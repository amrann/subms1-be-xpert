exports.up = (pgm) => {
	pgm.createTable('t_threads', {
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true
		},
		title: {
			type: 'VARCHAR(100)',
			notNull: true
		},
        body: {
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
		}
	});
};

exports.down = (pgm) => {
	pgm.dropTable('t_threads');
};

exports.tags = ['threads-table'];
