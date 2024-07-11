const mongoose = require("mongoose");
const validator = require("validator");
const moviesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: [true, "Name is already"],
      trim: true,
      maxlength: [100, "Movies name must not exceed 100 characters"],
      minlength: [4, "Movies must have at least 4 characters"],
      unique: true,
      validate: {
        validator: (value) => {
          return validator.isAlpha(value);
        },
        message: "{VALUE} is not a valid alphabets character",
      },
    },
    description: { type: String, default: null, trim: true },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      trim: true,
      min: [30, "Movies must have at least 30 minutes"],
    },
    ratings: {
      type: Number,
      default: 1.0,
      trim: true,
      validate: {
        validator: (value) => {
          return value >= 0 && value <= 10;
        },
        message: `'{VALUE}' invalid rating above 1 and below 10`,
      },
    },
    totalRating: {
      type: Number,
    },
    releaseYear: {
      type: Number,
      required: [true, "Release year is required"],
    },
    releaseDate: {
      type: String,
    },
    createAt: {
      type: Date,
      default: Date.now(),
      select: false, // không select ( sử dụng trong trường hợp trường là private ví dụ như mật khẩu của người dùng )
    },
    genres: {
      type: [String],
      required: [true, "Genres is required"],
    },
    directors: {
      type: [String],
      required: [true, "Directors is required"],
    },
    coverImage: {
      type: String,
      required: [true, "Cover image is required"],
    },
    actors: {
      type: [String],
      required: [true, "Actor is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    createBy: {
      type: String,
      // required: [true, "CreateBy is required"],
    },
    drink: {
      type: String,
      enum: {
        values: ["Coffee", "Tea"],
        message: "This drink not existing",
      },
    },
    email: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// filed ảo , không lưu vào db mà chỉ thêm trường khi query
moviesSchema.virtual("durationInHours").get(function () {
  return (this.duration / 60).toFixed(2) * 1;
});
// Executed before the document is saved in db
//.save() or .create() is working
// is middleware in mongodb
moviesSchema.pre("save", function (next) {
  this.createBy = "Admin";
  next();
});
// Executed before the document is find in db
//start .find() is working
moviesSchema.pre(/^find/, function (next) {
  // this.find({ duration: { $lte: 142 } });
  this.startTime = Date.now();
  next();
});
// Executed before the document is find in db
moviesSchema.post(/^find/, function (docs, next) {
  next();
});

const Movie = mongoose.model("Movie", moviesSchema);

module.exports = Movie;
