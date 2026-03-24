namespace DevLore.EntitiesLibrary.Transfer.TagTransferLogic
{
    public record class TagDTO : IdentifiableEntityDTO
    {
        public string Name { get; set; } = "";
    }
}
