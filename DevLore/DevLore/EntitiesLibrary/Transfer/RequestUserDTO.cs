namespace DevLore.EntitiesLibrary.Transfer
{
    public class RequestUserDTO
    {
        public int? Id { get; init; }
        public string Hashed_Password { get; set; }
        public string Profile { get; set; } = "";
        public string Username { get; set; }
    }
}
