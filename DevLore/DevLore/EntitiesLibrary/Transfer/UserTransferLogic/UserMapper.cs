using DevLore.EntitiesLibrary.Entities.Common;

namespace DevLore.EntitiesLibrary.Transfer.UserTransferLogic
{
    public static class UserMapper
    {
        public static User ToEntity(this RequestUserDTO dto)
        {
            var user = new User
            {
                Id = dto.Id,
                Username = dto.Username,
                Email = dto.Email,
                Profile = dto.Profile,
                RoleId = dto.RoleId
            };
            if (!string.IsNullOrWhiteSpace(dto.Password))
                user.SetPassword(dto.Password);
            return user;
        }

        public static UserDTO ToDTO(this User entity) => new()
        {
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            Id = entity.Id,
            Username = entity.Username,
            Email = entity.Email,
            Profile = entity.Profile,
            RoleId = entity.RoleId,
            RoleName = entity.Role?.Name ?? ""
        };
    }
}
