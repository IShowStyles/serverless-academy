export function InsertQuery(table, values) {
  const valuesString = Object.keys(values);
  values = Object.values(values);
  const valuesIDs = values.map((_, i) => `$${i + 1},`).join(' ').slice(0, -1);
  return [`INSERT INTO ${table} (${valuesString.join(',')}) VALUES (${valuesIDs}) RETURNING *;`, values, [values]];
}

export function SelectQuery(table, values) {
  values = Object.keys(values).map((key) => `${key} = '${values[key]}'`);
  return `SELECT * FROM ${table} WHERE ${values.join(" AND ")};`
}

export function SelectAllQuery(table) {
  return `SELECT * FROM ${table};`
}

export function UpdateQuery(table, updates, conditions) {
  const updateColumns = Object.keys(updates);
  const updateValues = Object.values(updates);
  const setClauses = updateColumns.map((col, i) => `${col} = $${i + 1}`).join(",");
  const conditionColumns = Object.keys(conditions);
  const conditionValues = Object.values(conditions);
  const whereClauses = conditionColumns.map((col, i) => `${col} = $${i + updateValues.length + 1}`).join(" AND ");
  const values = [...updateValues, ...conditionValues];
  const query = `UPDATE ${table} SET ${setClauses} WHERE ${whereClauses} RETURNING *;`;
  return [query, values];
}

export function DeleteQuery(values) {
  const valuesIDs = values.map((_, i) => `$${i + 1},`);
  return `DELETE FROM users WHERE ${values.join(" AND ")};`
}

export const selectAllQuery = `SELECT * FROM users;`
export const deleteAllQuery = `DELETE FROM users;`
export const dropTableQuery = `DROP TABLE IF EXISTS users;`