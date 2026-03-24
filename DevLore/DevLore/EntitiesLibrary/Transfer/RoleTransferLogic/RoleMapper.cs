using DevLore.EntitiesLibrary.Entities.Common;

namespace DevLore.EntitiesLibrary.Transfer.RoleTransferLogic
{
    public static class RoleMapper
    {
        public static Role ToEntity(this RequestRoleDTO dto) => new()
        {
            Id = dto.Id,
            Name = dto.Name
        };

        public static RoleDTO ToDTO(this Role entity) => new()
        {
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            Id = entity.Id,
            Name = entity.Name
        };
    }
}