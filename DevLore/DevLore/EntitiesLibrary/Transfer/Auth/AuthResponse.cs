using DevLore.EntitiesLibrary.Transfer.UserTransferLogic;

namespace DevLore.EntitiesLibrary.Transfer.Auth
{
    public record LoginRequest
    {
        public string Email { get; init; }
        public string Password { get; init; }
    }

    public record RegisterRequest
    {
        public string Username { get; init; }
        public string Email { get; init; }
        public string Password { get; init; }
        public int? RoleId { get; init; }
    }

    public record AuthResponse
    {
        public string Token { get; init; }
        public UserDTO User { get; init; }
    }
}