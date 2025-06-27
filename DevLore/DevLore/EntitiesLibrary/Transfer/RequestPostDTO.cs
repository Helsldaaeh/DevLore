namespace DevLore.EntitiesLibrary.Transfer
{
    public class RequestPostDTO
    {
        public int? Id { get; init; }
        public int UserId { get; init; }
        public string Content { get; set; } = "";

    }
}
