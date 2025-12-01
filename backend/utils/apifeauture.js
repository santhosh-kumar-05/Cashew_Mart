class Apifeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Search by keyword (example: ?keyword=cashew)
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", // case-insensitive
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // Filter by fields (example: ?price[gte]=400&price[lte]=1000)
  filter() {
    const queryCopy = { ...this.queryStr };

    // Remove unneeded fields
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((field) => delete queryCopy[field]);

    // Convert operators (gte, gt, lte, lt) to MongoDB ($gte, $gt, $lte, $lt)
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
}

module.exports = Apifeatures;
