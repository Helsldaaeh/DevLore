using DevLore.EntitiesLibrary.Entities.Common.Post;
using DevLore.EntitiesLibrary.Entities.Common.Role;
using DevLore.EntitiesLibrary.Entities.Common.User;

namespace DevLore.EntitiesLibrary.Transfer.UserTransferLogic
{
    public static class UserMapper
    {
        public static User ToEntity(this RequestUserDTO common)
        {
            return new User
            {
                Id = common.Id,
                Username = common.Username,
                Profile = common.Profile,
                PasswordHash = common.PasswordHash,
                Role = common.Role,
                PostTransferLogic = common.Posts,
                LogIn = common.LogIn
            };
        }


        public static UserDTO ToDTO(this User common)
        {
            return new UserDTO
            {
                CreatedAt = common.CreatedAt,
                UpdatedAt = common.UpdatedAt,
                Id = common.Id,
                Username = common.Username,
                Profile = common.Profile,
                PasswordHash = common.PasswordHash,
                Role = common.Role,
                PostTransferLogic = common.Posts,
                LogIn = common.LogIn
            };
        }
    }
}
