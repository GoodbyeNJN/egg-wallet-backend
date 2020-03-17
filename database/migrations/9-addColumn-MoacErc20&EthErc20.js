module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
            Add altering commands here.
            Return a promise to correctly handle asynchronicity.

            Example:
            return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */

        const { FLOAT } = Sequelize;

        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.addColumn(
                "MoacErc20",
                "balance",
                {
                    type: FLOAT,
                    comment: "余额",
                    defaultValue: 0,
                },
                {
                    after: "owner",
                    transaction,
                },
            );
            await queryInterface.addColumn(
                "EthErc20",
                "balance",
                {
                    type: FLOAT,
                    comment: "余额",
                    defaultValue: 0,
                },
                {
                    after: "owner",
                    transaction,
                },
            );

            transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        /*
            Add reverting commands here.
            Return a promise to correctly handle asynchronicity.

            Example:
            return queryInterface.dropTable('users');
        */

        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.removeColumn("MoacErc20", "balance", {
                transaction,
            });
            await queryInterface.removeColumn("EthErc20", "balance", {
                transaction,
            });

            transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
