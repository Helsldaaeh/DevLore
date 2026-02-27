namespace DevLore.EntitiesLibrary.Transfer
{
    public class RequestLikeOrDislikeDTO
    {
        public int? Id { get; init; }
        public int UserId { get; init; }
        public bool LikeOrDislike { get; set; }

    }
}
