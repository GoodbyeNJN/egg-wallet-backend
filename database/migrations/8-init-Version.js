module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
            Add altering commands here.
            Return a promise to correctly handle asynchronicity.

            Example:
            return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */

        const { INTEGER, STRING, TEXT, BOOLEAN } = Sequelize;

        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                "Version",
                {
                    id: { type: INTEGER, comment: "序号", autoIncrement: true, primaryKey: true },
                    walletName: {
                        type: STRING,
                        comment: "钱包名或项目名",
                        allowNull: false,
                        unique: true,
                    },
                    version: { type: STRING, comment: "版本号（例：12.4.56）" },
                    versionNumber: {
                        type: INTEGER,
                        comment: "版本号的数字化表示（例：120456）",
                    },
                    validVersion: {
                        type: STRING,
                        comment: "有效版本号，即该版本以上不用强制更新（例：12.4.56）",
                    },
                    validVersionNumber: {
                        type: INTEGER,
                        comment: "有效版本号的数字化表示（例：120456）",
                    },
                    downloadUrl: {
                        type: STRING,
                        comment: "更新地址",
                    },
                    deleted: { type: BOOLEAN, comment: "假删除", defaultValue: false },
                },
                {
                    charset: "utf8",
                    transaction,
                },
            );

            await queryInterface.addIndex("Version", ["walletName"], { transaction });

            transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: (queryInterface, Sequelize) => {
        /*
            Add reverting commands here.
            Return a promise to correctly handle asynchronicity.

            Example:
            return queryInterface.dropTable('users');
        */
        return queryInterface.dropTable("Version");
    },
};
