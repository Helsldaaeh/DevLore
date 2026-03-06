namespace DevLore.EntitiesLibrary.Transfer.CommenTransferLogic
{
    public class CommentDTO : IdentifiableEntityDTO
    {
        public int UserId { get; init; }
        public string Content { get; set; }
    }
}