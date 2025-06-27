namespace DevLore.EntitiesLibrary.Transfer
{
    public class RequestUserDTO
    {
        public int? Id { get; init; }
        public string Profile { get; set; } = "";
        public string Username { get; set; }
    }
}
