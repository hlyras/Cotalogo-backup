const ORM = {};

async function (params, props, inners, orderBy, limit) {
  try {
    const whereCondition = Object.fromEntries(
      Object.entries(params || {})
        .filter(([key, { value }]) => value != null)
        .map(([key, { value, comparisonType }]) => {
          switch (comparisonType) {
            case 'strict':
              return [key, value];
            case 'like':
              return [key, { [Op.like]: `%${value}%` }];
            case 'between':
              return [key, { [Op.between]: value }];
            // Adicione mais casos conforme necessário
            default:
              return null;
          }
        })
        .filter(entry => entry !== null)
    );

    const includeModels = inners.map(model => ({
      model,
      required: model.required || false, // Define como false por padrão para LEFT JOIN
    }));

    const queryOptions = {
      where: whereCondition,
      attributes: props || undefined,
      include: includeModels,
      order: orderBy ? [orderBy] : undefined, // Adiciona opção de ordenação
      limit: limit || undefined, // Adiciona opção de limite
    };

    if (Object.keys(whereCondition).length === 0) {
      const result = await User.findAll(queryOptions);
      return result;
    }

    const result = await User.findAll(queryOptions);

    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}