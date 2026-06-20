const Poem = {
  async author(parent: any) {
    return parent.author;
  },
};

export default Poem;
