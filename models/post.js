const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
    static initiate(sequelize) {
        Post.init({
            content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            }
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,
            modelName: 'Post',
            tableName: 'posts',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
    }

    static associate(db){
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.User, {
            foreignKey: 'LikedPostId',
            as: 'Likeds', //관계의 이름
            through: 'Like', //중간테이블 정보
        })
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' })
    }
}

module.exports = Post;