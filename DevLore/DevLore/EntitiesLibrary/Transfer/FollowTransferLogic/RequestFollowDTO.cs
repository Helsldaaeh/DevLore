namespace DevLore.EntitiesLibrary.Transfer.FollowTransferLogic
{
    public record class RequestFollowDTO
    {
        public int? Id { get; init; }
        public int UserId { get; init; }
        public int FollowedUserId { get; init; }
    }
}
