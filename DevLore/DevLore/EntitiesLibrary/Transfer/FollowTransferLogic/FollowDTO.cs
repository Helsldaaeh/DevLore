namespace DevLore.EntitiesLibrary.Transfer.FollowTransferLogic
{
    public record class FollowDTO : IdentifiableEntityDTO
    {
        public int UserId { get; set; }
        public int FollowedUserId { get; set; }
        public DateTime FollowedAt { get; set; }
    }
}
