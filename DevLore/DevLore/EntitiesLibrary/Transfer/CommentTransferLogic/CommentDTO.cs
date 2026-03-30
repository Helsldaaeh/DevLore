namespace DevLore.EntitiesLibrary.Transfer.CommentTransferLogic
{
    public record class CommentDTO : IdentifiableEntityDTO
{
    public int UserId { get; init; }
    public string Username { get; init; } = "";
    public int PostId { get; init; }
    public int? ParentCommentId { get; init; }
    public string Content { get; set; } = "";
}
}