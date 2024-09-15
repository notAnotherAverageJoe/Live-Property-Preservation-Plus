// src/utils/accessUtils.js

export const hasFullAccess = (accessLevel) => {
  return accessLevel === null || accessLevel === undefined || accessLevel < 1;
};
