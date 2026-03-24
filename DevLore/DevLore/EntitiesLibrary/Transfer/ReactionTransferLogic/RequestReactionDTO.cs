using DevLore.EntitiesLibrary.Entities.Common;

namespace DevLore.EntitiesLibrary.Transfer.LikeOrDislikeTransferLogic
{
    public class RequestReactionDTO
    {
        public int? Id { get; init; }
        public int UserId { get; init; }
        public ReactionType Type { get; set; }
        public int? PostId { get; set; }
        public int? CommentId { get; set; }
    }
}
