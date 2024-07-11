class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    // http://localhost:8000/movie/v1?ratings[gt]=1&&price[gt]=9.99&&duration=169
    let filter = JSON.stringify(this.queryString).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    filter = JSON.parse(filter);

    if (this.queryString.sort) {
      delete filter.sort;
    }
    if (this.queryString.field) {
      delete filter.field;
    }
    if (this.queryString.page) {
      delete filter.page;
    }
    if (this.queryString.limit) {
      delete filter.limit;
    }
   
    this.query = this.query.find(filter);
   
    return this;
  }
  sort() {
    // http://localhost:8000/movie/v1/?sort=-price,ratings
    if (this.queryString.sort) {
      
      const sortBy = this.queryString.sort.split(",").join(" "); // 'price ratings'
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-releaseDate");
    }
    return this;
  }
  limitFields() {
    // http://localhost:8000/movie/v1/?field=ratings,price,_id
    if (this.queryString.field) {
      const field = this.queryString.field.split(",").join(" "); // 'ratings price _id'
      this.query = this.query.select(field);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate(totalDocument) {
    // http://localhost:8000/movie/v1/?page=5&limit=2
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 4;
    const skip = (page - 1) * limit;
    
    this.query = this.query.skip(skip).limit(limit);
    if (totalDocument) {
      if (skip >= totalDocument) {
        throw new Error("Not found page");
      }
    }
    return this;
  }
}

module.exports = ApiFeatures;
