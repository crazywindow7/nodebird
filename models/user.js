const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.ENUM('local', 'kakao'),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            }
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db){
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.Post, {
            foreignKey: 'LikingUserId',
            as: 'Likings', //관계의 이름
            through: 'Like', //중간테이블 정보
        })
        db.User.belongsToMany(db.User, { //팔로워
            foreignKey: 'followingId',
            as: 'Followers', //관계의 이름
            through: 'Follow', //중간테이블 정보
        });
        db.User.belongsToMany(db.User, { //팔로잉
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        });
    }
}

module.exports = User;