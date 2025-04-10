/**
 * @type {{ADMIN: "admin", PROJECT_ADMIN: "project_admin", MEMBER: "member"} as const}
 */
export const UserRolesEnum = {
  ADMIN: "admin",
  MEMBER: "user",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

