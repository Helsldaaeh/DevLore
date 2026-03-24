

namespace DevLore.EntitiesLibrary.Transfer.UserTransferLogic
{
    public record class RequestUserDTO
    {
        public int? Id { get; init; }
        public string Username { get; init; } = "";
        public string Email { get; init; } = "";
        public string Password { get; init; } = "";
        public string Profile { get; init; } = "";
        public int RoleId { get; init; }
    }
}
