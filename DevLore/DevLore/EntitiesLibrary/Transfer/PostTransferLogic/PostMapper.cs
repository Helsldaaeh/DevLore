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
            OriginalPostId = dto.OriginalPostId,
            IsRepost = dto.OriginalPostId.HasValue || dto.IsRepost   // если есть OriginalPostId или явно указан IsRepost
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
            OriginalPost = entity.OriginalPost?.ToDTO(),
            Tags = entity.Tags?.Select(t => t.Name).ToList(),
            IsRepost = entity.IsRepost,     // заполняем
            IsOriginalDeleted = entity.IsRepost && entity.OriginalPost == null   // репост, но оригинала нет
        };
    }
}