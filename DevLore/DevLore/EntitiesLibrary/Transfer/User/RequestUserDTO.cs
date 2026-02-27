namespace DevLore.EntitiesLibrary.Transfer
{
    public record class RequestUserDTO
    {
        public int? Id { get; init; }
        public string Profile { get; set; } = "";
        public string Username { get; set; }
    }
}
