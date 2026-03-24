using DevLore.EntitiesLibrary.Entities.Common;

namespace DevLore.EntitiesLibrary.Transfer.LikeOrDislikeTransferLogic
{
    public static class ReactionMapper
    {
        public static Reaction ToEntity(this RequestReactionDTO dto) => new()
        {
            Id = dto.Id,
            UserId = dto.UserId,
            Type = dto.Type,
            PostId = dto.PostId,
            CommentId = dto.CommentId
        };

        public static ReactionDTO ToDTO(this Reaction entity) => new()
        {
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            Id = entity.Id,
            Type = entity.Type,
            UserId = entity.UserId,
            PostId = entity.PostId,
            CommentId = entity.CommentId
        };
    }
}
