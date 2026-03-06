using DevLore.EntitiesLibrary.Entities.Common.Post;

namespace DevLore.EntitiesLibrary.Transfer.PostTransferLogic
{
    public static class PostMapper
    {
        public static Post ToEntity(this RequestPostDTO common)
        {
            return new Post
            {
                Id = common.Id,
                UserId = common.UserId,
                Content = common.Content
            };
        }


        public static PostDTO ToDTO(this Post common)
        {
            return new PostDTO
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
