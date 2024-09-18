const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : _.maxBy(
        _.sortBy(blogs, [
          function (blog) {
            return blog.likes;
          },
        ]),
        function (blog) {
          return blog.likes;
        },
      );
};

const mostBlogs = (blogs) => {
  return blogs.length === 0
    ? null
    : _.maxBy(
        _.map(_.countBy(blogs, "author"), (value, key) => ({
          author: key,
          blogs: value,
        })),
        function (author) {
          return author.blogs;
        },
      );
};

const mostLikes = (blogs) => {
  return blogs.length === 0
    ? null
    : _(blogs)
        .groupBy("author")
        .map((objects, key) => ({
          author: key,
          likes: _.sumBy(objects, "likes"),
        }))
        .maxBy(function (object) {
          return object.likes;
        });
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
