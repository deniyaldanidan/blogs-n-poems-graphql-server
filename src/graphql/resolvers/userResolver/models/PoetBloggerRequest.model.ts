const PoetBloggerRequest = {
  async requestedBy(parent: any) {
    return parent.requestedBy;
  },
};

export default PoetBloggerRequest;
