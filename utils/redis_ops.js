const redis = require("async-redis");

// Initializing Redis db
const client = redis.createClient();

client.on("error", function (error) {
  console.error(error);
});

const is_exists = (key) => {
  return client
    .exists(key)
    .then((res) => {
      return Boolean(res);
    })
    .catch((err) => {
      return false;
    });
};

const add_key = async (key, extime) => {
  const { err, reply } = await client.setex(key, extime, "");

  return Boolean(!err);
};

module.exports = { is_exists, add_key };
