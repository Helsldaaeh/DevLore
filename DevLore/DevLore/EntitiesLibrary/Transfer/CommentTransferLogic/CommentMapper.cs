using DevLore.EntitiesLibrary.Entities.Common;

namespace DevLore.EntitiesLibrary.Transfer.CommentTransferLogic
{
    public static class CommentMapper
    {
        public static Comment ToEntity(this RequestCommentDTO dto) => new()
        {
            Id = dto.Id,
            UserId = dto.UserId,
            PostId = dto.PostId,
            ParentCommentId = dto.ParentCommentId,
            Content = dto.Content
        };

        public static CommentDTO ToDTO(this Comment entity) => new()
{
    CreatedAt = entity.CreatedAt,
    UpdatedAt = entity.UpdatedAt,
    Id = entity.Id,
    UserId = entity.UserId,
    Username = entity.User?.Username ?? "Unknown",
    PostId = entity.PostId,
    ParentCommentId = entity.ParentCommentId,
    Content = entity.Content
};
    }
}
