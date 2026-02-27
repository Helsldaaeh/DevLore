using DevLore.EntitiesLibrary.Entities.Common;

namespace DevLore.EntitiesLibrary.Transfer.LikeOrDislike
{
    public static class LikeOrDislikeMapper
    {
        public static LikeOrDislike ToEntity(this RequestLikeOrDislikeDTO common)
        {
            return new LikeOrDislike
            {
                Id = common.Id,
                UserId = common.UserId,
                LikeOrDislike = common.LikeOrDislike
            };
        }


        public static LikeOrDislikeDTO ToDTO(this LikeOrDislike common)
        {
            return new LikeOrDislikeDTO
            {
                CreatedAt = common.CreatedAt,
                UpdatedAt = common.UpdatedAt,
                Id = common.Id,
                UserId = common.UserId,
                Content = common.Content
            };
        }
    }
}
