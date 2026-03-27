using DevLore.EntitiesLibrary.Entities.Common;

namespace DevLore.EntitiesLibrary.Transfer.PostTransferLogic
{
    public record class PostDTO : IdentifiableEntityDTO
    {
    public int UserId { get; set; }
    public string Username { get; set; } = ""; // добавляем
    public string Content { get; set; } = "";
    public PostType Type { get; set; }
    public int? OriginalPostId { get; set; }
    public List<string>? Tags { get; set; }
    }
}
