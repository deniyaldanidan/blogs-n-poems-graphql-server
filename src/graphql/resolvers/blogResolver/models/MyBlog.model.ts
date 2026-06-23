const MyBlog = {
  async author(parent: any) {
    return parent.author;
  },
  async comments(parent: any) {
    return parent.comments;
  },
};

export default MyBlog;
