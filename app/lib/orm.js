const ORM = {};

ORM.select = function ({ props, inners, conditions, order, limit }, Op) {
  const queryObject = {
    attributes: props && props.length > 0 ? props : undefined,
    include: inners || [],
    where: {},
    order: order || [],
    limit: limit || undefined,
  };

  if (conditions && conditions.length > 0) {
    conditions.forEach(condition => {
      const { field, operator, value } = condition;

      if (!field) { return; }

      if (value !== null && value !== undefined && value !== '') {
        if (operator === 'like' || operator === 'strict') {
          queryObject.where[field] = { [Op[operator]]: value };
        } else if (operator === 'between' && Array.isArray(value) && value.length === 2) {
          const [start, end] = value;
          if (start !== null && start !== undefined && start !== '' && end !== null && end !== undefined && end !== '') {
            queryObject.where[field] = { [Op[operator]]: [start, end] };
          }
        } else if (operator === 'greater' || operator === 'less') {
          queryObject.where[field] = { [Op[operator]]: value };
        } else if (operator === 'in' && Array.isArray(value) && value.length > 0) {
          queryObject.where[field] = { [Op[operator]]: value };
        } else if (operator === 'or' && Array.isArray(value) && value.length > 0) {
          const orConditions = value.map(orCondition => {
            const orField = orCondition.field;
            const orValue = orCondition.value;
            return { [orField]: { [Op.strict]: orValue } };
          });
          queryObject.where[field] = { [Op.or]: orConditions };
        }
      }
    });
  }

  return queryObject;
};

ORM.fill = function ({ field, operator, value, Op }, conditions) {
  if (!field) {
    // Certifique-se de ter um campo válido para construir a condição
    return;
  }

  if (value !== null && value !== undefined) {
    if (operator === 'in' && Array.isArray(value) && value.length > 0) {
      conditions.push({ [field]: { [Op.in]: value } });
    } else if (operator === 'like' || operator === 'strict') {
      conditions.push({ [field]: { [Op[operator]]: value } });
    } else if (operator === 'between' && Array.isArray(value) && value.length === 2) {
      const [start, end] = value;
      if (start !== null && start !== undefined && end !== null && end !== undefined) {
        conditions.push({ [field]: { [Op.between]: [start, end] } });
      }
    } else if ((operator === 'greater' || operator === 'less') && Number.isFinite(value)) {
      conditions.push({ [field]: { [Op[operator]]: value } });
    } else if (operator === 'or' && Array.isArray(value) && value.length > 0) {
      const orConditions = value.map(orValue => {
        return { [field]: { [Op.or]: orValue } };
      });
      conditions.push(...orConditions);
    }
  }
};

export default ORM;