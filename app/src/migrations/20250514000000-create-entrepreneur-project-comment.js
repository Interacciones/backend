'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('EntrepreneurProjectComments', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'Users', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			},
			projectId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'EntrepreuneurProjects', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			},
			parentCommentId: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: { model: 'EntrepreneurProjectComments', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			},
			content: {
				type: Sequelize.STRING(1000),
				allowNull: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('EntrepreneurProjectComments');
	}
};




