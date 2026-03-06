using DevLore.EntitiesLibrary.Entities.Common.Role;

namespace DevLore.EntitiesLibrary.Transfer.RoleTransferLogic
{
    public static class RoleMapper
    {
        public static Role ToEntity(this RequestRoleDTO common)
        {
            return new Role
            {
                Id = common.Id,
                Name = common.Name
            };
        }


        public static RoleDTO ToDTO(this Role common)
        {
            return new RoleDTO
            {
                CreatedAt = common.CreatedAt,
                UpdatedAt = common.UpdatedAt,
                Id = common.Id,
                Name = common.Name
            };
        }
    }
}