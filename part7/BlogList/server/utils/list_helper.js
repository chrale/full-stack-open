const _ = require('lodash');
const logger = require('./logger');

const dummy = (blogs) => {
  logger.info('Dummy function called, blogs: ', blogs);
  return 1;
};

const totalLikes = (blogs) => {
  logger.info('Total likes function called');
  return blogs.reduce(
    (accumulator, currentValue) => accumulator + currentValue.likes,
    0,
  );
};

const favoriteBlog = (blogs) => {
  logger.info('Favourite blog function called');
  if (blogs.length === 0) {
    return 'list is empty!';
  }

  const favouriteBlog = blogs.reduce((maxLikes, currentblog) => {
    return currentblog.likes > (maxLikes.likes || 0) ? currentblog : maxLikes;
  }, {});

  return {
    title: favouriteBlog.title,
    author: favouriteBlog.author,
    likes: favouriteBlog.likes,
  };
};

const mostBlogs = (blogs) => {
  logger.info('Most blogs function called');
  if (blogs.length === 0) {
    return 'list is empty!';
  }

  const blogsEdited = _(blogs)
    .groupBy('author')
    .map((objs, key) => ({
      author: key,
      blogs: _.size(objs),
    }))
    .value();

  return _.maxBy(blogsEdited, 'blogs');
};

const mostLikes = (blogs) => {
  logger.info('Most likes function called');
  if (blogs.length === 0) {
    return 'list is empty!';
  }

  const blogsEdited = _(blogs)
    .groupBy('author')
    .map((objs, key) => ({
      author: key,
      likes: _.sumBy(objs, 'likes'),
    }))
    .value();
  return _.maxBy(blogsEdited, 'likes');
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostLikes,
  mostBlogs,
};
