namespace DevLore.EntitiesLibrary.Transfer.PostTransferLogic
{
    public record class PostDTO : IdentifiableEntityDTO
    {
        public int UserId { get; set; }
        public string Content { get; set; } = "";
    }
}
