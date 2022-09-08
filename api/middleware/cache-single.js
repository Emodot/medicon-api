const redis = require("redis");

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

module.exports = async(req, res, next) => {
    let isCached = true;
    let result;
  try {
      const cachedResult = await redisClient.get('single');
      if (cachedResult) {
        result = JSON.parse(cachedResult);
        return res.status(200).json({
            isCached,
            result,
          });
      } else {
        next();
      }
  } catch (error) {
      return res.status(404).json({
        message: 'Patient Not Found'
      })
  }
};