using DevLore.EntitiesLibrary.Entities.Common.Post;
using DevLore.EntitiesLibrary.Entities.Common.Role;

namespace DevLore.EntitiesLibrary.Transfer.UserTransferLogic
{
    public record class UserDTO : IdentifiableEntityDTO
    {
        public string Profile { get; set; } = "";
        public string Username { get; set; }
        public string LogIn { get; set; }
        public List<Post>? Posts { get; set; }
        public Role Role { get; set; }
    }
}
