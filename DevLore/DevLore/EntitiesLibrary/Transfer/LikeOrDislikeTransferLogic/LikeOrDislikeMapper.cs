using DevLore.EntitiesLibrary.Entities.Common.LikeOrDislike;

namespace DevLore.EntitiesLibrary.Transfer.LikeOrDislikeTransferLogic
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
                LikeOrDislike = common.LikeOrDislike
            };
        }
    }
}
