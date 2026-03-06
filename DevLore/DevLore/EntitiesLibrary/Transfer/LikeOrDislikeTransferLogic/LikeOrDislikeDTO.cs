namespace DevLore.EntitiesLibrary.Transfer.LikeOrDislikeTransferLogic
{
    public class LikeOrDislikeDTO : IdentifiableEntityDTO
    {
        bool LikeOrDislike { get; set; }
        public int UserId { get; set; }
    }
}