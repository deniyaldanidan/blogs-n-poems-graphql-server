const Blog = {
  async author(parent: any) {
    return parent.author;
  },
};

export default Blog;
