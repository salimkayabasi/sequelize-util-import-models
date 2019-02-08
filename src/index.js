const { readdirSync } = require('fs');
const { extname, resolve } = require('path');

const findModels = (path, ext = '.js') => {
  const basePath = resolve(process.cwd(), path);
  return readdirSync(basePath, { withFileTypes: true })
    .filter((f) => f.isFile() && extname(f.name) === ext)
    .map((file) => `${basePath}/${file.name}`);
};

module.exports = async (sequelize, path) => {
  await Promise.all(
    findModels(path).map(async (modelPath) => sequelize.import(modelPath)),
  );
  await Promise.all(
    Object.values(sequelize.models).map(async (model) => {
      if (model.associate) {
        return model.associate(sequelize.models);
      }
      return Promise.resolve();
    }),
  );
};
