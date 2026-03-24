namespace DevLore.EntitiesLibrary.Transfer.UserTransferLogic
{
    public record class UserDTO : IdentifiableEntityDTO
    {
        public string Username { get; set; } = "";
        public string Email { get; set; } = "";
        public string Profile { get; set; } = "";
        public int RoleId { get; set; }
        public string RoleName { get; set; } = "";
    }
}
