using DevLore.EntitiesLibrary.Entities.Common.Comment;

namespace DevLore.EntitiesLibrary.Transfer.CommenTransferLogic
{
    public static class Comment
    {
        public static Comment ToEntity(this CommentDTO common)
        {
            return new Comment
            {
                Id = common.Id,
                UserId = common.UserId,
                Content = common.Content
            };
        }


        public static CommentDTO ToDTO(this Comment common)
        {
            return new CommentDTO
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
