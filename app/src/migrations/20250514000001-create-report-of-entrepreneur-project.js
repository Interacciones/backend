'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('ReportOfEntrepreneurProjects', {
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
			description: {
				type: Sequelize.STRING,
				allowNull: false
			},
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending'
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
		await queryInterface.dropTable('ReportOfEntrepreneurProjects');
	}
};


