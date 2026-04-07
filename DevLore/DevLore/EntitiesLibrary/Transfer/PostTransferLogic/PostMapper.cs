using DevLore.EntitiesLibrary.Entities.Common;

namespace DevLore.EntitiesLibrary.Transfer.PostTransferLogic
{
    public static class PostMapper
    {
        public static Post ToEntity(this RequestPostDTO dto) => new()
        {
            Id = dto.Id,
            UserId = dto.UserId,
            Content = dto.Content,
            Type = dto.Type,
            OriginalPostId = dto.OriginalPostId
        };

        public static PostDTO ToDTO(this Post entity) => new()
        {
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            Id = entity.Id,
            UserId = entity.UserId,
            Username = entity.User?.Username ?? "Unknown",
            Content = entity.Content,
            Type = entity.Type,
            OriginalPostId = entity.OriginalPostId,
            OriginalPost = entity.OriginalPost?.ToDTO(),   // рекурсивное преобразование
            Tags = entity.Tags?.Select(t => t.Name).ToList()
        };
    }
}