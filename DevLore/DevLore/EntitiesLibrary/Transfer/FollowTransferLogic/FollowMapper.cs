using DevLore.EntitiesLibrary.Entities.Common;

namespace DevLore.EntitiesLibrary.Transfer.FollowTransferLogic
{
    public static class FollowMapper
    {
        public static Follow ToEntity(this RequestFollowDTO dto) => new()
        {
            Id = dto.Id,
            UserId = dto.UserId,
            FollowedUserId = dto.FollowedUserId
        };

        public static FollowDTO ToDTO(this Follow entity) => new()
        {
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            Id = entity.Id,
            UserId = entity.UserId,
            FollowedUserId = entity.FollowedUserId,
            FollowedAt = entity.FollowedAt
        };
    }
}
