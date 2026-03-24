using DevLore.EntitiesLibrary.Entities.Common;

namespace DevLore.EntitiesLibrary.Transfer.TagTransferLogic
{
    public static class TagMapper
    {
        public static Tag ToEntity(this RequestTagDTO dto) => new()
        {
            Id = dto.Id,
            Name = dto.Name
        };

        public static TagDTO ToDTO(this Tag entity) => new()
        {
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            Id = entity.Id,
            Name = entity.Name
        };
    }
}
