using DevLore.EntitiesLibrary.Transfer.UserTransferLogic;

namespace DevLore.EntitiesLibrary.Transfer.Auth
{
    public record LoginRequest
    {
        public required string Email { get; init; }
        public required string Password { get; init; }
    }

    public record RegisterRequest
    {
        public required string Username { get; init; }
        public required string Email { get; init; }
        public required string Password { get; init; }
        public int? RoleId { get; init; }
    }

    public record AuthResponse
    {
        public required string Token { get; init; }
        public required UserDTO User { get; init; }
    }
}