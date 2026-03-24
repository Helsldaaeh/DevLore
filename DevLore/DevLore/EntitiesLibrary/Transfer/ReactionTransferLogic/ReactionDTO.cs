using DevLore.EntitiesLibrary.Entities.Common;

namespace DevLore.EntitiesLibrary.Transfer.LikeOrDislikeTransferLogic
{
    public record class ReactionDTO : IdentifiableEntityDTO
    {
        public ReactionType Type { get; set; }
        public int UserId { get; set; }
        public int? PostId { get; set; }
        public int? CommentId { get; set; }
    }
}