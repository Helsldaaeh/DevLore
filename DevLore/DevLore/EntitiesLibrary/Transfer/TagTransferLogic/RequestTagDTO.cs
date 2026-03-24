namespace DevLore.EntitiesLibrary.Transfer.TagTransferLogic
{
    public record class RequestTagDTO
    {
        public int? Id { get; init; }
        public string Name { get; init; } = "";
    }
}
