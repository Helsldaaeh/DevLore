namespace DevLore.EntitiesLibrary.Transfer.PostTransferLogic
{
    public record class RequestPostDTO
    {
        public int? Id { get; init; }
        public int UserId { get; init; }
        public string Content { get; set; } = "";

    }
}
