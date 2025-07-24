namespace DevLore.EntitiesLibrary.Transfer
{
    public record class RequestUserDTO
    {
        public int? Id { get; init; }
        public string Hash_password { get; set; }
        public string Profile { get; set; } = "";
        public string Username { get; set; }
    }
}
