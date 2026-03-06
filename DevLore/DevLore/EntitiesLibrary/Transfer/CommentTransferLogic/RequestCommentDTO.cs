namespace DevLore.EntitiesLibrary.Transfer.CommenTransferLogic
{
    public class RequestCommentDTO
    {
        public int? Id { get; init; }
        public int UserId { get; init; }
        public string Content { get; set; }

    }
}