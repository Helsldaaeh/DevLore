namespace DevLore.EntitiesLibrary.Transfer.CommentTransferLogic
{
    public class RequestCommentDTO
    {
        public int? Id { get; init; }
        public int UserId { get; init; }
        public int PostId { get; init; }
        public int? ParentCommentId { get; init; }
        public string Content { get; set; } = "";
    }
}