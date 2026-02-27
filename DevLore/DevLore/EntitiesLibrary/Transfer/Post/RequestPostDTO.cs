namespace DevLore.EntitiesLibrary.Transfer.Post
{
    public record class RequestPostDTO
    {
        public int? Id { get; init; }
        public int UserId { get; init; }
        public string Content { get; set; } = "";

    }
}
